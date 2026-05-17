import fs from "fs";
import path from "path";
import { db } from "./drizzle";
import { usersTable, problemsTable, submissionsTable, contestsTable, sampleTestCasesTable } from "./db/schema";
import { eq, and, desc, SQL } from "drizzle-orm";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_URL,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-username, x-admin-password",
  "Access-Control-Allow-Credentials": "true",
};

const json = (data: any, init?: ResponseInit) =>
  Response.json(data, { ...init, headers: { ...corsHeaders, ...init?.headers } });

// For super user authorization on problem creation
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin_pass";

const problemSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  inputDescription: z.string().optional(),
  outputDescription: z.string().optional(),
  difficulty: z.number().int().min(0),
  timeLimit: z.number().int().min(1).default(1000),
  memoryLimit: z.number().int().min(1).default(256),
  tags: z.array(z.string()).default([]),
});

// Helper to sign a simple token
const signToken = (payload: any) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature_placeholder`;
};

const decodeToken = (token: string) => {
  try {
    const parts = token.split(".");
    const bodyPart = parts[1];
    if (!bodyPart) return null;
    return JSON.parse(atob(bodyPart));
  } catch {
    return null;
  }
};

const getAuthenticatedUser = (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  return decodeToken(token);
};

const pollJudge0 = async (token: string, maxRetries = 60, interval = 500): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`);
    const data = await res.json();
    if (data.status?.id !== 1 && data.status?.id !== 2) return data;
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error("Judge0 polling timed out");
};

const slugify = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

const mapJudge0Status = (statusId: number) => {
  switch (statusId) {
    case 1:
    case 2: return "PENDING";
    case 3: return "AC";
    case 4: return "WA";
    case 5: return "TLE";
    case 6: return "CE";
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12: return "RE";
    default: return "PENDING";
  }
};

const server = Bun.serve({
  port: 3001,
  routes: {
    // Auth APIs
    // POST /api/auth/signup - Register a new user
    "/api/auth/signup": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      POST: async (req) => {
        const { username, email, password } = await req.json();
        if (!username || !email || !password) {
          return json({ error: "Missing fields" }, { status: 400 });
        }

        const passwordHash = await Bun.password.hash(password);
        
        try {
          const results = await db.insert(usersTable).values({ 
            username, 
            email, 
            passwordHash,
          }).returning();

          const user = results[0];
          if (!user) throw new Error("Failed to create user");

          const token = signToken({ id: user.id, username: user.username });
          return json({ user: { id: user.id, username: user.username, email: user.email }, token });
        } catch (e: any) {
          return json({ error: "User already exists or database error" }, { status: 409 });
        }
      }
    },

    // POST /api/auth/signin - Sign in with username and password
    "/api/auth/signin": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      POST: async (req) => {
        const { username, password } = await req.json();
        const results = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
        const user = results[0];
        if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
          return json({ error: "Invalid credentials" }, { status: 401 });
        }
        const token = signToken({ id: user.id, username: user.username});
        return json({ user: { id: user.id, username: user.username, email: user.email }, token });
      }
    },

    // GET /api/auth/me - Get authenticated user's profile
    "/api/auth/me": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      GET: async (req) => {
        const userToken = getAuthenticatedUser(req);
        if (!userToken) return json({ error: "Unauthorized" }, { status: 401 });
        const results = await db.select().from(usersTable).where(eq(usersTable.id, userToken.id)).limit(1);
        const user = results[0];
        if (!user) return json({ error: "User not found" }, { status: 404 });
        return json({ id: user.id, username: user.username, email: user.email });
      }
    },

    // Problem APIs
    // GET /api/problems - List problems (paginated, max 100 per request)
    "/api/problems": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      GET: async (req) => {
        const { searchParams } = new URL(req.url);
        const offset = parseInt(searchParams.get("offset") || "0");
        const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 100);
        const problems = await db.select().from(problemsTable).orderBy(desc(problemsTable.id)).limit(limit).offset(offset);
        return json(problems);
      },
      // POST /api/problems - Create a new problem (admin only)
      POST: async (req) => {
        // Super user check using credentials from .env
        const adminUser = req.headers.get("x-admin-username");
        const adminPass = req.headers.get("x-admin-password");

        if (adminUser !== ADMIN_USERNAME || adminPass !== ADMIN_PASSWORD) {
          return json({ error: "Forbidden: Invalid admin credentials" }, { status: 403 });
        }

        const body = await req.json();
        
        // Zod validation
        const result = problemSchema.safeParse(body);
        if (!result.success) {
          return json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
        }

        const results = await db.insert(problemsTable).values(result.data).returning();
        return json(results[0]);
      }
    },

    // GET /api/problems/:id - Get a single problem by ID
    "/api/problems/:id": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      GET: async (req) => {
        const id = parseInt(req.params.id);
        const results = await db.select().from(problemsTable).where(eq(problemsTable.id, id)).limit(1);
        const problem = results[0];
        if (!problem) return json({ error: "Problem not found" }, { status: 404 });
        return json(problem);
      }
    },

    // GET /api/problems/:id/testcases - Get sample test cases for a problem
    "/api/problems/:id/testcases": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      GET: async (req) => {
        const id = parseInt(req.params.id);
        const testcases = await db.select().from(sampleTestCasesTable).where(eq(sampleTestCasesTable.problemId, id)).orderBy(sampleTestCasesTable.order);
        return json(testcases);
      }
    },

    // Submission APIs
    // GET /api/submissions - List submissions (optional userId, problemId filters)
    "/api/submissions": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      GET: async (req) => {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const problemId = searchParams.get("problemId");
        const conditions: SQL[] = [];
        if (userId) conditions.push(eq(submissionsTable.userId, parseInt(userId)));
        if (problemId) conditions.push(eq(submissionsTable.problemId, parseInt(problemId)));
        let query = db.select().from(submissionsTable);
        if (conditions.length > 0) {
          // @ts-ignore
          query = query.where(and(...conditions));
        }
        const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 100);
        const offset = parseInt(searchParams.get("offset") || "0");
        const submissions = await query.orderBy(desc(submissionsTable.createdAt)).limit(limit).offset(offset);
        return json(submissions);
      },
      // POST /api/submissions - Submit code for a problem
      POST: async (req) => {
        const user = getAuthenticatedUser(req);
        if (!user) return json({ error: "Unauthorized" }, { status: 401 });

        const { problemId, language_id, source_code, stdin } = await req.json();
        
        // 1. Submit to Judge0
        const judgeResponse = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language_id, source_code, stdin }),
        });
        
        const { token: judgeToken } = await judgeResponse.json();

        // 2. Save in DB
        const [submission] = await db.insert(submissionsTable).values({
          userId: user.id,
          problemId: parseInt(problemId),
          language: language_id.toString(),
          code: source_code,
          status: "PENDING",
          judgeToken: judgeToken,
        }).returning();

        return json(submission);
      }
    },

    // POST /api/judge/submit - Submit code against all test case files
    "/api/judge/submit": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      POST: async (req) => {
        const user = getAuthenticatedUser(req);
        if (!user) return json({ error: "Unauthorized" }, { status: 401 });

        const { problemId, language_id, source_code } = await req.json();

        const [problem] = await db.select().from(problemsTable).where(eq(problemsTable.id, parseInt(problemId))).limit(1);
        if (!problem) return json({ error: "Problem not found" }, { status: 404 });

        const slug = slugify(problem.title);
        const inputDir = path.join(process.cwd(), "problems", slug, "input");
        const outputDir = path.join(process.cwd(), "problems", slug, "output");

        let inputFiles: string[];
        try {
          inputFiles = fs.readdirSync(inputDir).filter(f => f.endsWith(".txt")).sort();
          if (inputFiles.length === 0) throw new Error();
        } catch {
          return json({ error: "Test case files not found" }, { status: 404 });
        }

        // Submit each input file to Judge0
        const jobs = await Promise.all(
          inputFiles.map(async (file) => {
            const inputContent = fs.readFileSync(path.join(inputDir, file), "utf-8");
            const expectedOutput = fs.readFileSync(path.join(outputDir, file), "utf-8");
            const res = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ language_id, source_code, stdin: inputContent }),
            });
            const { token } = await res.json();
            return { file, token, expectedOutput };
          })
        );

        // Save submission with first token (others tracked in parallel)
        const [submission] = await db.insert(submissionsTable).values({
          userId: user.id,
          problemId: parseInt(problemId),
          language: language_id.toString(),
          code: source_code,
          status: "PENDING",
          judgeToken: jobs[0]!.token,
        }).returning();

        return json({ submission, testCases: jobs });
      }
    },

    // GET /api/judge/submit/:id - Poll Judge0 and return result for first file
    "/api/judge/submit/:id": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      GET: async (req) => {
        const id = parseInt(req.params.id);
        const [submission] = await db.select().from(submissionsTable).where(eq(submissionsTable.id, id)).limit(1);
        if (!submission) return json({ error: "Submission not found" }, { status: 404 });
        if (!submission.judgeToken) return json(submission);

        const judgeData = await pollJudge0(submission.judgeToken);
        const actualOutput = (judgeData.stdout || "").trim();
        const newStatus = mapJudge0Status(judgeData.status?.id);

        const [problem] = await db.select().from(problemsTable).where(eq(problemsTable.id, submission.problemId)).limit(1);
        let expectedOutput = "";
        let passed = false;
        if (problem) {
          try {
            expectedOutput = fs.readFileSync(path.join(process.cwd(), "problems", slugify(problem.title), "output", "1.txt"), "utf-8").trim();
            passed = newStatus === "AC" && actualOutput === expectedOutput;
          } catch {}
        }

        const finalStatus = passed ? "AC" : newStatus === "AC" ? "WA" : newStatus;

        await db.update(submissionsTable)
          .set({
            status: finalStatus,
            executionTime: judgeData.time ? Math.round(parseFloat(judgeData.time) * 1000) : null,
            memoryUsed: judgeData.memory,
          })
          .where(eq(submissionsTable.id, id));

        return json({
          id: submission.id,
          status: finalStatus,
          expectedOutput,
          actualOutput,
          passed,
          executionTime: judgeData.time ? Math.round(parseFloat(judgeData.time) * 1000) : null,
          memoryUsed: judgeData.memory,
        });
      }
    },

    // GET /api/submissions/:id/status - Get submission verdict from Judge0
    "/api/submissions/:id/status": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      GET: async (req) => {
        const id = parseInt(req.params.id);
        const [submission] = await db.select().from(submissionsTable).where(eq(submissionsTable.id, id)).limit(1);
        
        if (!submission) return json({ error: "Submission not found" }, { status: 404 });
        if (!submission.judgeToken) return json(submission);

        // Fetch from Judge0
        const judgeResponse = await fetch(`${JUDGE0_URL}/submissions/${submission.judgeToken}?base64_encoded=false`);
        const judgeData = await judgeResponse.json();

        const newStatus = mapJudge0Status(judgeData.status?.id);
        
        // Update DB if status changed
        if (newStatus !== submission.status) {
          await db.update(submissionsTable)
            .set({ 
              status: newStatus,
              executionTime: judgeData.time ? Math.round(parseFloat(judgeData.time) * 1000) : null,
              memoryUsed: judgeData.memory,
            })
            .where(eq(submissionsTable.id, id));
            
          submission.status = newStatus;
          submission.executionTime = judgeData.time ? Math.round(parseFloat(judgeData.time) * 1000) : null;
          submission.memoryUsed = judgeData.memory;
        }

        return json({ ...submission, judgeData });
      }
    },

    // GET /api/status - Health check
    "/api/status": {
      OPTIONS: () => new Response(null, { headers: corsHeaders }),
      GET: () => new Response("OK", { headers: corsHeaders }),
    },
  },

  fetch(req) {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

console.log(`Server running at ${server.url}`);

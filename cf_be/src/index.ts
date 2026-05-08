import { db } from "./drizzle";
import { usersTable, problemsTable, submissionsTable, contestsTable } from "./db/schema";
import { eq, and, desc, SQL } from "drizzle-orm";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";

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
    "/api/auth/signup": {
      POST: async (req) => {
        const { username, email, password } = await req.json();
        if (!username || !email || !password) {
          return Response.json({ error: "Missing fields" }, { status: 400 });
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
          return Response.json({ user: { id: user.id, username: user.username, email: user.email }, token });
        } catch (e: any) {
          return Response.json({ error: "User already exists or database error" }, { status: 409 });
        }
      }
    },

    "/api/auth/signin": {
      POST: async (req) => {
        const { email, password } = await req.json();
        const results = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
        const user = results[0];
        if (!user || !(await Bun.password.verify(password, user.passwordHash))) {
          return Response.json({ error: "Invalid credentials" }, { status: 401 });
        }
        const token = signToken({ id: user.id, username: user.username });
        return Response.json({ user: { id: user.id, username: user.username, email: user.email }, token });
      }
    },

    "/api/auth/me": {
      GET: async (req) => {
        const userToken = getAuthenticatedUser(req);
        if (!userToken) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const results = await db.select().from(usersTable).where(eq(usersTable.id, userToken.id)).limit(1);
        const user = results[0];
        if (!user) return Response.json({ error: "User not found" }, { status: 404 });
        return Response.json({ id: user.id, username: user.username, email: user.email });
      }
    },

    // Problem APIs
    "/api/problems": {
      GET: async () => {
        const problems = await db.select().from(problemsTable).orderBy(desc(problemsTable.id));
        return Response.json(problems);
      },
      POST: async (req) => {
        // Super user check using credentials from .env
        const adminUser = req.headers.get("x-admin-username");
        const adminPass = req.headers.get("x-admin-password");

        if (adminUser !== ADMIN_USERNAME || adminPass !== ADMIN_PASSWORD) {
          return Response.json({ error: "Forbidden: Invalid admin credentials" }, { status: 403 });
        }

        const body = await req.json();
        
        // Zod validation
        const result = problemSchema.safeParse(body);
        if (!result.success) {
          return Response.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
        }

        const results = await db.insert(problemsTable).values(result.data).returning();
        return Response.json(results[0]);
      }
    },

    "/api/problems/:id": {
      GET: async (req) => {
        const id = parseInt(req.params.id);
        const results = await db.select().from(problemsTable).where(eq(problemsTable.id, id)).limit(1);
        const problem = results[0];
        if (!problem) return Response.json({ error: "Problem not found" }, { status: 404 });
        return Response.json(problem);
      }
    },

    // Submission APIs
    "/api/submissions": {
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
        const submissions = await query.orderBy(desc(submissionsTable.createdAt));
        return Response.json(submissions);
      },
      POST: async (req) => {
        const user = getAuthenticatedUser(req);
        if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

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

        return Response.json(submission);
      }
    },

    "/api/submissions/:id/status": {
      GET: async (req) => {
        const id = parseInt(req.params.id);
        const [submission] = await db.select().from(submissionsTable).where(eq(submissionsTable.id, id)).limit(1);
        
        if (!submission) return Response.json({ error: "Submission not found" }, { status: 404 });
        if (!submission.judgeToken) return Response.json(submission);

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

        return Response.json({ ...submission, judgeData });
      }
    },

    "/api/status": new Response("OK"),
  },

  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at ${server.url}`);

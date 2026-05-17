import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { db } from "../drizzle";
import { problemsTable, sampleTestCasesTable } from "./schema";
import { eq } from "drizzle-orm";

const PROBLEMS_DIR = path.join(process.cwd(), "problems");

interface ProblemData {
  title: string;
  difficulty: number;
  timeLimit?: number;
  memoryLimit?: number;
  tags?: string[];
}

function getAllProblemDirs(dir: string): string[] {
  const dirs: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const problemMd = path.join(dir, entry.name, "problem.md");
      if (fs.existsSync(problemMd)) dirs.push(path.join(dir, entry.name));
    }
  }
  return dirs;
}

async function seed() {
  console.log("Seeding problems...");
  
  if (!fs.existsSync(PROBLEMS_DIR)) {
    console.error(`Directory not found: ${PROBLEMS_DIR}`);
    return;
  }

  const problemDirs = getAllProblemDirs(PROBLEMS_DIR);
  
  for (const dir of problemDirs) {
    const mdPath = path.join(dir, "problem.md");
    const fileContent = fs.readFileSync(mdPath, "utf-8");
    const { data, content } = matter(fileContent);
    const problemData = data as ProblemData;
    
    const inputMatch = content.match(/## Input Description\n([\s\S]*?)(?=\n##|$)/);
    const outputMatch = content.match(/## Output Description\n([\s\S]*?)(?=\n##|$)/);
    
    const inputDescription = inputMatch && inputMatch[1] ? inputMatch[1].trim() : "";
    const outputDescription = outputMatch && outputMatch[1] ? outputMatch[1].trim() : "";
    
    const contentParts = content.split("## Input Description");
    const mainDescription = (contentParts[0] || "No description provided.").trim();

    try {
      await db.insert(problemsTable).values({
        title: problemData.title,
        difficulty: problemData.difficulty,
        timeLimit: problemData.timeLimit ?? 1000,
        memoryLimit: problemData.memoryLimit ?? 256,
        tags: problemData.tags ?? [],
        description: mainDescription || "No description provided.",
        inputDescription: inputDescription,
        outputDescription: outputDescription,
      }).onConflictDoUpdate({
        target: problemsTable.title,
        set: {
          difficulty: problemData.difficulty,
          timeLimit: problemData.timeLimit ?? 1000,
          memoryLimit: problemData.memoryLimit ?? 256,
          tags: problemData.tags ?? [],
          description: mainDescription || "No description provided.",
          inputDescription: inputDescription,
          outputDescription: outputDescription,
        }
      });

      const [problem] = await db.select().from(problemsTable).where(eq(problemsTable.title, problemData.title)).limit(1);
      if (!problem) throw new Error("Problem not found after upsert");

      // Store sample test cases as the full content of input/1.txt and output/1.txt
      await db.delete(sampleTestCasesTable).where(eq(sampleTestCasesTable.problemId, problem.id));

      const inputPath = path.join(dir, "input", "1.txt");
      const outputPath = path.join(dir, "output", "1.txt");
      const explMatch = content.match(/## Sample Explanations\n([\s\S]*?)(?=\n##|$)/);
      const explanations = explMatch ? explMatch[1]!.concat("\n").trim() : "";

      if (fs.existsSync(inputPath) && fs.existsSync(outputPath)) {
        const inputContent = fs.readFileSync(inputPath, "utf-8").trim();
        const outputContent = fs.readFileSync(outputPath, "utf-8").trim();
        await db.insert(sampleTestCasesTable).values({
          problemId: problem.id,
          input: inputContent,
          output: outputContent,
          explanation: explanations || null,
          order: 1,
        });
      }

      console.log(`Synced problem: ${problemData.title}`);
    } catch (error) {
      console.error(`Error syncing problem ${problemData.title}:`, error);
    }
  }
  
  console.log("Seeding completed.");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed script failed:", err);
  process.exit(1);
});

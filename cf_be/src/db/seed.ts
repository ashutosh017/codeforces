import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { db } from "../drizzle";
import { problemsTable } from "./schema";
import { eq } from "drizzle-orm";

const PROBLEMS_DIR = path.join(process.cwd(), "problems");

interface ProblemData {
  title: string;
  difficulty: number;
  timeLimit?: number;
  memoryLimit?: number;
  tags?: string[];
}

function getAllProblemFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllProblemFiles(filePath, fileList);
    } else if (file === "problem.md") {
      fileList.push(filePath);
    }
  });
  return fileList;
}

async function seed() {
  console.log("Seeding problems...");
  
  if (!fs.existsSync(PROBLEMS_DIR)) {
    console.error(`Directory not found: ${PROBLEMS_DIR}`);
    return;
  }

  const problemFiles = getAllProblemFiles(PROBLEMS_DIR);
  
  for (const filePath of problemFiles) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const problemData = data as ProblemData;
    
    const inputMatch = content.match(/## Input Description\n([\s\S]*?)(?=\n##|$)/);
    const outputMatch = content.match(/## Output Description\n([\s\S]*?)(?=\n##|$)/);
    
    const inputDescription = inputMatch && inputMatch[1] ? inputMatch[1].trim() : "";
    const outputDescription = outputMatch && outputMatch[1] ? outputMatch[1].trim() : "";
    
    const contentParts = content.split("## Input Description");
    const mainDescription = (contentParts[0] || "No description provided.").trim();

    try {
      // Use upsert logic by title
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

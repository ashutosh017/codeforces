import fs from "fs";
import path from "path";

const DIR = path.dirname(new URL(import.meta.url).pathname);

function solve(input: string): string {
  const lines = input.trim().split("\n");
  console.log(lines.length)
  const T = parseInt(lines[0]!);
  const results: string[] = [];
  for (let i = 1; i <= T; i++) {
    const x = parseInt(lines[i]!);
    const s = x.toString();
    const reversed = s.split("").reverse().join("");
    results.push((s === reversed).toString());
  }
  return results.join("\n");
}

const inputDir = path.join(DIR, "input");
const outputDir = path.join(DIR, "output");
const files = fs.readdirSync(inputDir).filter(f => f.endsWith(".txt")).sort();
for (const file of files) {
  const input = fs.readFileSync(path.join(inputDir, file), "utf-8");
  const output = solve(input);
  fs.writeFileSync(path.join(outputDir, file), output);
  console.log(`Generated output/${file}`);
}

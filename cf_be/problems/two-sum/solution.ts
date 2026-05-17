import fs from "fs";
import path from "path";

const DIR = path.dirname(new URL(import.meta.url).pathname);

function solve(input: string): string {
  const lines = input.trim().split("\n");
  const T = parseInt(lines[0]!);
  const results: string[] = [];
  let idx = 1;
  for (let t = 0; t < T; t++) {
    const [target, n] = lines[idx]!.split(" ").map(Number);
    const nums = lines[idx + 1]!.split(" ").map(Number).slice(0, n);
    idx += 2;
    const map = new Map<number, number>();
    for (let j = 0; j < nums.length; j++) {
      const complement = target! - nums[j]!;
      if (map.has(complement)) {
        results.push(`[${map.get(complement)},${j}]`);
        break;
      }
      map.set(nums[j]!, j);
    }
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

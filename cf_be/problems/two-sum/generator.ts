import fs from "fs";
import path from "path";

const DIR = path.dirname(new URL(import.meta.url).pathname);
const INPUT_DIR = path.join(DIR, "input");

const MAX_VAL = 1_000_000_000;

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOne(target: number, n: number): number[] {
  const nums: number[] = new Array(n);
  const i1 = Math.floor(Math.random() * n);
  let i2 = Math.floor(Math.random() * n);
  while (i2 === i1) i2 = Math.floor(Math.random() * n);

  const a = randInt(0, target);
  nums[i1] = a;
  nums[i2] = target - a;

  // Non-solution values from an upper range where no two values sum to target
  // For target=0, use [1, MAX_VAL] (no two positive numbers sum to 0)
  const lowerBound = target === 0 ? 1 : Math.floor(target / 2) + 1;

  for (let j = 0; j < n; j++) {
    if (j === i1 || j === i2) continue;
    let v: number;
    do {
      v = randInt(lowerBound, MAX_VAL);
    } while (v === a || v === target - a);
    nums[j] = v;
  }

  return nums;
}

function formatTestCase(target: number, nums: number[]): string {
  return `${target} ${nums.length}\n${nums.join(" ")}`;
}

// File 2: Small random (T = 100, n ∈ [2, 100])
{
  const T = 100;
  const lines = [T.toString()];
  for (let t = 0; t < T; t++) {
    const target = randInt(0, MAX_VAL);
    const n = randInt(2, 100);
    lines.push(formatTestCase(target, generateOne(target, n)));
  }
  fs.writeFileSync(path.join(INPUT_DIR, "2.txt"), lines.join("\n"));
  console.log("Generated input/2.txt (small random)");
}

// File 3: Medium random (T = 1000, n ∈ [2, 50])
{
  const T = 1000;
  const lines = [T.toString()];
  for (let t = 0; t < T; t++) {
    const target = randInt(0, MAX_VAL);
    const n = randInt(2, 50);
    lines.push(formatTestCase(target, generateOne(target, n)));
  }
  fs.writeFileSync(path.join(INPUT_DIR, "3.txt"), lines.join("\n"));
  console.log("Generated input/3.txt (medium random)");
}

// File 4: Large random (T = 10000, n ∈ [2, 20])
{
  const T = 10000;
  const lines = [T.toString()];
  for (let t = 0; t < T; t++) {
    const target = randInt(0, MAX_VAL);
    const n = randInt(2, 20);
    lines.push(formatTestCase(target, generateOne(target, n)));
  }
  fs.writeFileSync(path.join(INPUT_DIR, "4.txt"), lines.join("\n"));
  console.log("Generated input/4.txt (large random)");
}

// File 5: Stress / extreme n (T = 15, n up to 100k)
{
  const cases = [
    { target: 0, n: 100_000 },
    { target: MAX_VAL, n: 100_000 },
    { target: 1, n: 100_000 },
    { target: MAX_VAL - 1, n: 100_000 },
    { target: randInt(0, MAX_VAL), n: 100_000 },
    { target: randInt(0, MAX_VAL), n: 100_000 },
    { target: randInt(0, MAX_VAL), n: 100_000 },
    { target: randInt(0, MAX_VAL), n: 100_000 },
    { target: randInt(0, MAX_VAL), n: 100_000 },
    { target: randInt(0, MAX_VAL), n: 100_000 },
    { target: randInt(0, MAX_VAL), n: 50_000 },
    { target: randInt(0, MAX_VAL), n: 50_000 },
    { target: randInt(0, MAX_VAL), n: 10_000 },
    { target: randInt(0, MAX_VAL), n: 10_000 },
    { target: randInt(0, MAX_VAL), n: 5_000 },
  ];
  const lines = [cases.length.toString()];
  for (const { target, n } of cases) {
    lines.push(formatTestCase(target, generateOne(target, n)));
  }
  fs.writeFileSync(path.join(INPUT_DIR, "5.txt"), lines.join("\n"));
  console.log("Generated input/5.txt (stress test)");
}

// File 6: Edge cases (T = 10)
{
  const cases = [
    { target: 0, n: 2 },
    { target: 0, n: 100 },
    { target: 1, n: 5 },
    { target: 2, n: 3 },
    { target: MAX_VAL, n: 10 },
    { target: MAX_VAL - 1, n: 100 },
    { target: 500_000_000, n: 2 },
    { target: 500_000_000, n: 100_000 },
    { target: 999_999_999, n: 1000 },
    { target: 100, n: 1000 },
  ];
  const lines = [cases.length.toString()];
  for (const { target, n } of cases) {
    lines.push(formatTestCase(target, generateOne(target, n)));
  }
  fs.writeFileSync(path.join(INPUT_DIR, "6.txt"), lines.join("\n"));
  console.log("Generated input/6.txt (edge cases)");
}

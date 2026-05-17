import fs from "fs";
import path from "path";

const DIR = path.dirname(new URL(import.meta.url).pathname);
const INPUT_DIR = path.join(DIR, "input");

let lastT = 1;

for (let fileNum = 1; fileNum <= 4; fileNum++) {
  let T = 10**fileNum;
  const lines = [(2*(T-lastT)).toString()];
  for (let t = lastT; t < T; t++) {
    lines.push(t.toString());
    lines.push((-1*t).toString())
  }
  lastT = T;
  fs.writeFileSync(path.join(INPUT_DIR, `${fileNum+1}.txt`), lines.join("\n"));
  console.log(`Generated input/${fileNum+1}.txt`);
}

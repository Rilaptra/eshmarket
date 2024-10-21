import { execSync } from "child_process";

function main() {
  const step1 = execSync("git add .");
  if (!step1) {
    console.error("Error adding files to git");
    return;
  }
  const step2 = execSync("git commit -m 'auto commit'");
  if (!step2) {
    console.error("Error committing changes to git");
    return;
  }
  const step3 = execSync("git push -u origin main");
  if (!step3) {
    console.error("Error pushing changes to git");
    return;
  }
  console.log("Git operations completed successfully!");
}

main();

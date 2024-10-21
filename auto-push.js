import { execSync } from "child_process";

function main() {
  try {
    execSync("git add .");
    try {
      execSync("git commit -m 'auto commit'");
      try {
        execSync("git push -u origin main");
        console.log("Git push completed successfully!");
      } catch (error) {}
    } catch (error) {
      throw new Error("Error committing changes to git");
    }
  } catch (error) {
    throw new Error("Error adding changes to git");
  }
}

main();

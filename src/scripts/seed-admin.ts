import "dotenv/config";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

function setEnvVar(content: string, key: string, value: string): string {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(content)) return content.replace(re, line);
  return `${content.trimEnd()}\n${line}\n`;
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin";
  const password = process.env.ADMIN_PASSWORD || "Andii0817@";
  const hash = await bcrypt.hash(password, 12);
  // Next.js expands $VAR in .env files — escape every $ in bcrypt hashes
  const escapedHash = hash.replace(/\$/g, "\\$");

  const envPath = path.join(process.cwd(), ".env.local");
  let content = "";
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, "utf8");
  } else if (fs.existsSync(path.join(process.cwd(), ".env.example"))) {
    content = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf8");
  }

  content = setEnvVar(content, "ADMIN_EMAIL", email);
  content = setEnvVar(content, "ADMIN_PASSWORD", password);
  content = setEnvVar(content, "ADMIN_PASSWORD_HASH", escapedHash);

  if (!content.includes("JWT_SECRET=") || content.match(/JWT_SECRET=\s*$/m)) {
    content = setEnvVar(content, "JWT_SECRET", `dev-secret-${Date.now()}`);
  }

  fs.writeFileSync(envPath, content, "utf8");
  console.log(`Admin ready: ${email} / ${password}`);
  console.log("Wrote escaped ADMIN_PASSWORD_HASH + ADMIN_PASSWORD to .env.local");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

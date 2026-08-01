import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: "env.download" });

const SOURCE_URI =
  process.env.SOURCE_MONGODB_URI || "mongodb://127.0.0.1:27017/tarot";

const TARGET_URI =
  process.env.ATLAS_MONGODB_URI ||
  (process.env.MONGODB_URI?.includes("mongodb+srv")
    ? process.env.MONGODB_URI
    : "");

if (!TARGET_URI) {
  console.error(`
Atlas URI not found. Set ATLAS_MONGODB_URI before running:

  PowerShell:
    $env:ATLAS_MONGODB_URI="mongodb+srv://USER:PASSWORD@cluster.mongodb.net/tarot?retryWrites=true&w=majority"
    npm run migrate:atlas

  Or add ATLAS_MONGODB_URI=... to .env.local
`);
  process.exit(1);
}

if (
  TARGET_URI.includes("127.0.0.1") ||
  TARGET_URI.includes("localhost")
) {
  console.error("TARGET must be your Atlas URI (mongodb+srv://...), not local.");
  process.exit(1);
}

async function migrate() {
  console.log("Source:", SOURCE_URI.replace(/\/\/.*@/, "//***@"));
  console.log("Target:", TARGET_URI.replace(/\/\/.*@/, "//***@"));

  const source = await mongoose.createConnection(SOURCE_URI).asPromise();
  const target = await mongoose.createConnection(TARGET_URI).asPromise();

  const sourceDb = source.db;
  const targetDb = target.db;
  if (!sourceDb || !targetDb) {
    throw new Error("Database connection failed");
  }

  const collections = await sourceDb.listCollections().toArray();
  if (collections.length === 0) {
    console.log("No collections in source database.");
    await source.close();
    await target.close();
    return;
  }

  let totalDocs = 0;

  for (const { name } of collections) {
    if (name.startsWith("system.")) continue;

    const docs = await sourceDb.collection(name).find({}).toArray();
    if (docs.length === 0) {
      console.log(`  skip ${name} (empty)`);
      continue;
    }

    await targetDb.collection(name).deleteMany({});
    await targetDb.collection(name).insertMany(docs, { ordered: false });

    totalDocs += docs.length;
    console.log(`  ✓ ${name}: ${docs.length} document(s)`);
  }

  await source.close();
  await target.close();

  console.log(`\nDone — migrated ${totalDocs} document(s) to Atlas.`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});

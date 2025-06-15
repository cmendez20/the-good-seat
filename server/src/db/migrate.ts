// server/src/db/migrate.ts
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3"; // No curly braces for default export
import path from "path";
import fs from "fs"; // Import fs module

const dbUrl = process.env.DATABASE_URL || "./data/sqlite.db";

// Ensure the directory for the DB file exists if it's not in root
const dbFilePath = dbUrl.replace("file:", ""); // Remove 'file:' prefix if present
const dbDir = path.dirname(dbFilePath);

if (dbDir !== ".") {
  // Check if it's not the current directory
  try {
    if (!fs.existsSync(dbDir)) {
      console.log(`Creating database directory: ${dbDir}`);
      fs.mkdirSync(dbDir, { recursive: true });
    }
  } catch (error) {
    console.error("Error ensuring DB directory exists:", error);
    process.exit(1);
  }
}

// CORRECTED: Use 'new Database()' to create the client instance
const sqlite = new Database(dbFilePath); // Use the cleaned path
sqlite.pragma("journal_mode = WAL"); // Recommended for better concurrency

const db = drizzle(sqlite);

async function runMigrations() {
  try {
    console.log("Running migrations...");
    // Drizzle Kit generates migrations into a 'drizzle' folder by default
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations complete!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

runMigrations();

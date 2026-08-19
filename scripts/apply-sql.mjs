import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const raw =
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .find((line) => line.startsWith("DATABASE_URL="))
    ?.replace("DATABASE_URL=", "")
    .replaceAll('"', "") ?? "";

const sqlPath = process.argv[2];
if (!sqlPath) {
  throw new Error("Usage: node scripts/apply-sql.mjs <file.sql>");
}

const sql = fs.readFileSync(path.resolve(sqlPath), "utf8");
const withoutLineComments = sql
  .split(/\r?\n/)
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n");
const statements = withoutLineComments
  .split(";")
  .map((statement) => statement.trim())
  .filter((statement) => statement.length > 0);

const client = new pg.Client({
  connectionString: raw,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
for (const statement of statements) {
  await client.query(statement);
}
await client.end();
console.log(`applied ${statements.length} statements from ${sqlPath}`);

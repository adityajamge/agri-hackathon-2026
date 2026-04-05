require("dotenv").config();

function clean(value) {
  if (typeof value !== "string") {
    return value;
  }
  return value.replace(/^['"]|['"]$/g, "").trim();
}

module.exports = {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: clean(process.env.DATABASE_URL || ""),
  },
  strict: true,
  verbose: true,
};

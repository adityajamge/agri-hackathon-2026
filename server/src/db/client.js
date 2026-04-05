const postgres = require("postgres");
const { drizzle } = require("drizzle-orm/postgres-js");
const schema = require("./schema");
const { env } = require("../config/env");

const queryClient = postgres(env.DATABASE_URL, {
  max: 10,
  prepare: false,
});

const db = drizzle(queryClient, { schema });

module.exports = {
  db,
  queryClient,
};

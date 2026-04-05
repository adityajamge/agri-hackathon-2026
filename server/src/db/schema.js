const {
  pgTable,
  text,
  timestamp,
  real,
  boolean,
  jsonb,
  index,
} = require("drizzle-orm/pg-core");
const { sql } = require("drizzle-orm");

const users = pgTable("users", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  farmName: text("farm_name").notNull(),
  village: text("village").notNull(),
  district: text("district").notNull(),
  primaryCrop: text("primary_crop").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const scanResults = pgTable(
  "scan_results",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    imageHash: text("image_hash").notNull(),
    cropName: text("crop_name"),
    diseaseName: text("disease_name").notNull(),
    probability: real("probability").notNull().default(0),
    treatment: jsonb("treatment").notNull().default(sql`'{}'::jsonb`),
    isHealthy: boolean("is_healthy").notNull().default(false),
    latitude: real("latitude"),
    longitude: real("longitude"),
    rawResponse: jsonb("raw_response").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userCreatedIdx: index("scan_results_user_created_idx").on(table.userId, table.createdAt),
    userImageHashIdx: index("scan_results_user_image_hash_idx").on(table.userId, table.imageHash),
  }),
);

module.exports = {
  users,
  scanResults,
};

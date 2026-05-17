import { integer, pgTable, varchar, text, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";

export const submissionStatusEnum = pgEnum("submission_status", [
  "PENDING",
  "AC", // Accepted
  "WA", // Wrong Answer
  "TLE", // Time Limit Exceeded
  "MLE", // Memory Limit Exceeded
  "RE", // Runtime Error
  "CE", // Compilation Error
  "SKIPPED",
]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 50 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  rating: integer().default(0).notNull(),
  rank: varchar({ length: 50 }).default("Newbie").notNull(),
  bio: text(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const problemsTable = pgTable("problems", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull().unique(),
  description: text().notNull(),
  inputDescription: text("input_description"),
  outputDescription: text("output_description"),
  difficulty: integer().notNull(), // rating like 800, 1200, 2400
  timeLimit: integer("time_limit").default(1000).notNull(), // in ms
  memoryLimit: integer("memory_limit").default(256).notNull(), // in mb
  tags: jsonb().default([]).notNull(), // array of strings: ["dp", "greedy", "math"]
  solvedCount: integer().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contestsTable = pgTable("contests", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  startTime: timestamp("start_time").notNull(),
  duration: integer().notNull(), // in minutes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissionsTable = pgTable("submissions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  problemId: integer("problem_id").references(() => problemsTable.id).notNull(),
  contestId: integer("contest_id").references(() => contestsTable.id),
  language: varchar({ length: 50 }).notNull(),
  code: text().notNull(),
  status: submissionStatusEnum("status").default("PENDING").notNull(),
  judgeToken: varchar("judge_token", { length: 255 }),
  executionTime: integer("execution_time"), // in ms
  memoryUsed: integer("memory_used"), // in kb
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sampleTestCasesTable = pgTable("sample_test_cases", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  problemId: integer("problem_id").references(() => problemsTable.id).notNull(),
  input: text().notNull(),
  output: text().notNull(),
  explanation: text(),
  order: integer().notNull().default(0),
});

export const contestParticipantsTable = pgTable("contest_participants", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  contestId: integer("contest_id").references(() => contestsTable.id).notNull(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  score: integer().default(0).notNull(),
  rank: integer(),
  ratingChange: integer("rating_change"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

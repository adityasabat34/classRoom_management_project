import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const classStatusEnum = pgEnum("class_status", [
  "active",
  "inactive",
  "archived",
]);

export const departments = pgTable("departments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 250 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 500 }),
  ...timestamps,
});

export const subjects = pgTable("subjects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departments.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 250 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 500 }),
  ...timestamps,
});

export const classes = pgTable("classes", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  teacherId: text("teacher_id").notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  inviteCode: varchar("invite_code", { length: 50 }).notNull().unique(),
  bannerCldPubId: text("banner_cld_pub_id"),
  bannerUrl: text("banner_url"),
  capacity: integer("capacity").notNull().default(50),
  description: text("description"),
  status: classStatusEnum("status").notNull().default("active"),
  schedule: jsonb("schedule").$type<Schedule[]>().notNull(),
  ...timestamps,
});

export const departmentRelations = relations(departments, ({ many }) => ({
  subjects: many(subjects),
}));

export const subjectRelations = relations(subjects, ({ one }) => ({
  department: one(departments, {
    fields: [subjects.departmentId],
    references: [departments.id],
  }),
}));

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

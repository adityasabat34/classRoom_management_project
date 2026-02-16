import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["student", "teacher", "admin"]);

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at"), // null = active, timestamp = soft deleted
};

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "approved",
  "rejected",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: roleEnum("role").notNull().default("student"),
  imageCldPubId: text("image_cld_pub_id"),

  ...timestamps,
});

export const teacherProfiles = pgTable("teacher_profiles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  //1:1 with user
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  bio: text("bio"),

  resumeUrl: text("resume_url"),
  resumeCldPubId: text("resume_cld_pub_id"),

  verificationStatus: verificationStatusEnum("verification_status")
    .notNull()
    .default("pending"),

  verifiedBy: text("verified_by").references(() => user.id, {
    onDelete: "set null",
  }),

  verifiedAt: timestamp("verified_at"),

  ...timestamps,
});

export const teacherProfilesRelations = relations(
  teacherProfiles,
  ({ one }) => ({
    user: one(user, {
      fields: [teacherProfiles.userId],
      references: [user.id],
    }),
  }),
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type TeacherProfile = typeof teacherProfiles.$inferSelect;
export type NewTeacherProfile = typeof teacherProfiles.$inferInsert;

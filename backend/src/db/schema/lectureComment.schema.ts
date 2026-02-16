import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { lectures } from "./index";
import { user } from "./auth.schema";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at"),
};

export const lectureComments = pgTable(
  "lecture_comments",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    lectureId: integer("lecture_id")
      .notNull()
      .references(() => lectures.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    content: text("content").notNull(),

    // Optional: for replies (future feature)
    parentId: integer("parent_id"),

    ...timestamps,
  },
  (table) => [
    index("lecture_comments_lecture_id_idx").on(table.lectureId),
    index("lecture_comments_user_id_idx").on(table.userId),
  ],
);

export const lectureCommentsRelations = relations(
  lectureComments,
  ({ one }) => ({
    lecture: one(lectures, {
      fields: [lectureComments.lectureId],
      references: [lectures.id],
    }),
    user: one(user, {
      fields: [lectureComments.userId],
      references: [user.id],
    }),
  }),
);

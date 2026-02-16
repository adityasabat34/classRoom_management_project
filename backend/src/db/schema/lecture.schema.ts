import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { classes } from "./index"; // your existing classes table

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at"),
};

export const lectures = pgTable(
  "lectures",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

    classId: integer("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),

    // Cloudinary Video
    videoUrl: text("video_url"),
    videoCldPubId: text("video_cld_pub_id"),

    // Cloudinary Notes (PDF)
    notesUrl: text("notes_url"),
    notesCldPubId: text("notes_cld_pub_id"),

    // Lecture ordering inside class
    order: integer("order").notNull().default(1),

    // Draft / Publish control
    isPublished: boolean("is_published").notNull().default(false),

    ...timestamps,
  },
  (table) => [index("lectures_class_id_idx").on(table.classId)],
);

export const lecturesRelations = relations(lectures, ({ one }) => ({
  class: one(classes, {
    fields: [lectures.classId],
    references: [classes.id],
  }),
}));

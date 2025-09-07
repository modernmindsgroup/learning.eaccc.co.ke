import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  index,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("student"), // student, instructor, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Instructors table
export const instructors = pgTable("instructors", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id), // Link to user account
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  email: varchar("email", { length: 255 }).unique(),
  profileImage: varchar("profile_image"),
  expertise: text("expertise").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  instructorId: integer("instructor_id").references(() => instructors.id),
  duration: varchar("duration"), // e.g., "2:07 Hours"
  price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
  isFree: boolean("is_free").default(true),
  hasQuiz: boolean("has_quiz").default(false),
  hasCertificate: boolean("has_certificate").default(true),
  isFeatured: boolean("is_featured").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  level: varchar("level", { length: 50 }), // "Beginner", "Intermediate", "Advanced"
  thumbnailUrl: varchar("thumbnail_url"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  enrollmentCount: integer("enrollment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Topics table for course organization
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  title: varchar("title", { length: 255 }).notNull(),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  topicId: integer("topic_id").references(() => topics.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content"), // For text-based lessons
  contentType: varchar("content_type", { length: 50 }).default("video"), // "video", "pdf", "pptx", "docx"
  videoUrl: varchar("video_url"), // For video lessons
  fileUrl: varchar("file_url"), // For document lessons (PDF, PPTX, DOCX)
  totalPages: integer("total_pages"), // For document lessons
  duration: varchar("duration"), // e.g., "15 minutes"
  orderIndex: integer("order_index").notNull(),
  sectionTitle: varchar("section_title", { length: 255 }).default("Introduction"),
  sectionOrder: integer("section_order").default(1),
  isLocked: boolean("is_locked").default(false),
  isPreview: boolean("is_preview").default(false), // Can be previewed without enrollment
  isRequired: boolean("is_required").default(true), // Required for course completion
  completeOnVideoEnd: boolean("complete_on_video_end").default(true), // Auto-complete when video ends
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  progress: integer("progress").default(0), // Percentage (0-100)
  certificateIssued: boolean("certificate_issued").default(false),
});

// Lesson Progress table
export const lessonProgress = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  currentPage: integer("current_page").default(1), // For document lessons
  pagesViewed: text("pages_viewed"), // JSON array of viewed page numbers
}, (table) => ({
  unique: { columns: [table.userId, table.lessonId] },
}));

// Document Progress table for tracking individual page views
export const documentProgress = pgTable("document_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  page: integer("page").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
}, (table) => ({
  unique: { columns: [table.userId, table.lessonId, table.page] },
}));

// Certificates table
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  certificateNumber: varchar("certificate_number").unique().notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  pdfUrl: varchar("pdf_url"),
});

// Course Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blog Posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  thumbnailUrl: varchar("thumbnail_url"),
  category: varchar("category", { length: 100 }),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table for payment tracking
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, completed, failed, cancelled
  paystackReference: varchar("paystack_reference").unique(),
  paystackAccessCode: varchar("paystack_access_code"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  lessonProgress: many(lessonProgress),
  certificates: many(certificates),
  reviews: many(reviews),
  orders: many(orders),
}));

export const instructorsRelations = relations(instructors, ({ many }) => ({
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(instructors, {
    fields: [courses.instructorId],
    references: [instructors.id],
  }),
  topics: many(topics),
  lessons: many(lessons),
  enrollments: many(enrollments),
  certificates: many(certificates),
  reviews: many(reviews),
  orders: many(orders),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  course: one(courses, {
    fields: [topics.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [orders.courseId],
    references: [courses.id],
  }),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  topic: one(topics, {
    fields: [lessons.topicId],
    references: [topics.id],
  }),
  progress: many(lessonProgress),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertInstructorSchema = createInsertSchema(instructors).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  enrollmentCount: true,
  rating: true,
});

export const insertTopicSchema = createInsertSchema(topics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
  completedAt: true,
  progress: true,
  certificateIssued: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Instructor = typeof instructors.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type LessonProgress = typeof lessonProgress.$inferSelect;
export type DocumentProgress = typeof documentProgress.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertInstructor = z.infer<typeof insertInstructorSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Course with instructor details
export type CourseWithInstructor = Course & {
  instructor: Instructor;
  _count?: {
    enrollments: number;
    reviews: number;
  };
};

// Course with progress for enrolled users
export type CourseWithProgress = CourseWithInstructor & {
  enrollment?: Enrollment;
  userProgress?: number;
};

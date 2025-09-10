import {
  users,
  instructors,
  courses,
  topics,
  lessons,
  enrollments,
  lessonProgress,
  documentProgress,
  certificates,
  reviews,
  blogPosts,
  orders,
  type User,
  type UpsertUser,
  type Instructor,
  type InsertInstructor,
  type Course,
  type InsertCourse,
  type CourseWithInstructor,
  type CourseWithProgress,
  type Topic,
  type InsertTopic,
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type LessonProgress,
  type DocumentProgress,
  type Certificate,
  type Review,
  type InsertReview,
  type BlogPost,
  type Order,
  type InsertOrder,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, sql, ilike, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Instructor operations
  getInstructors(): Promise<Instructor[]>;
  getInstructor(id: number): Promise<Instructor | undefined>;
  createInstructor(instructor: InsertInstructor): Promise<Instructor>;

  // Course operations
  getCourses(filters?: {
    category?: string;
    isFree?: boolean;
    hasQuiz?: boolean;
    hasCertificate?: boolean;
    isFeatured?: boolean;
    search?: string;
    sortBy?: "newest" | "priceLowHigh" | "priceHighLow" | "rating";
  }): Promise<CourseWithInstructor[]>;
  getCourse(id: number): Promise<CourseWithInstructor | undefined>;
  getCourseWithProgress(id: number, userId?: string): Promise<CourseWithProgress | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: InsertCourse): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;
  getNewestCourses(limit?: number): Promise<CourseWithInstructor[]>;
  getFreeCourses(limit?: number): Promise<CourseWithInstructor[]>;
  getFeaturedCourses(): Promise<CourseWithInstructor[]>;

  // Topic operations
  getCourseTopics(courseId: number): Promise<Topic[]>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  updateTopic(id: number, topic: Partial<InsertTopic>): Promise<Topic | undefined>;
  deleteTopic(id: number): Promise<boolean>;
  duplicateTopic(id: number): Promise<Topic>;
  reorderTopics(courseId: number, topicOrders: { id: number; orderIndex: number }[]): Promise<void>;

  // Lesson operations
  getCourseLessons(courseId: number): Promise<Lesson[]>;
  getTopicLessons(topicId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<Lesson | undefined>;
  deleteLesson(id: number): Promise<boolean>;
  reorderLessons(topicId: number, lessonOrders: { id: number; orderIndex: number }[]): Promise<void>;

  // Enrollment operations
  enrollUser(enrollment: InsertEnrollment): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<(Enrollment & { course: CourseWithInstructor })[]>;
  getUserEnrollment(userId: string, courseId: number): Promise<Enrollment | undefined>;
  updateEnrollmentProgress(userId: string, courseId: number, progress: number): Promise<void>;

  // Lesson progress operations
  markLessonComplete(userId: string, lessonId: number): Promise<void>;
  getUserLessonProgress(userId: string, courseId: number): Promise<LessonProgress[]>;

  // Certificate operations
  issueCertificate(userId: string, courseId: number): Promise<Certificate>;
  getUserCertificates(userId: string): Promise<Certificate[]>;
  getCertificate(id: number): Promise<Certificate | undefined>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getCourseReviews(courseId: number): Promise<(Review & { user: User })[]>;

  // Blog operations
  getBlogPosts(limit?: number): Promise<BlogPost[]>;
  getPublishedBlogPosts(limit?: number): Promise<BlogPost[]>;

  // Stats
  getStats(): Promise<{
    instructorCount: number;
    studentCount: number;
    courseCount: number;
  }>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByReference(reference: string): Promise<Order | undefined>;
  updateOrderStatus(id: number, status: string, paystackReference?: string): Promise<void>;
  getUserOrders(userId: string): Promise<(Order & { course: Course })[]>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllCourses(): Promise<Course[]>;
  updateUserRole(userId: string, role: string): Promise<void>;
  getAdminStats(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalInstructors: number;
    totalRevenue: number;
    recentEnrollments: number;
  }>;

  // Instructor operations
  getInstructorStats(userId: string): Promise<{
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    avgRating: number;
  }>;
  getInstructorCourses(userId: string): Promise<Course[]>;
  getInstructorAnalytics(userId: string): Promise<any[]>;
  getInstructorStudents(userId: string): Promise<any[]>;

  // Document progress operations
  trackDocumentProgress(userId: string, lessonId: number, page: number): Promise<void>;
  getDocumentProgress(userId: string, lessonId: number): Promise<number[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error: any) {
      // If there's a unique constraint error on email, try to update by email instead
      if (error.code === '23505' && error.constraint === 'users_email_unique') {
        const [existingUser] = await db
          .update(users)
          .set({
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email!))
          .returning();
        
        if (existingUser) {
          return existingUser;
        }
      }
      throw error;
    }
  }

  // Instructor operations
  async getInstructors(): Promise<Instructor[]> {
    return await db.select().from(instructors).orderBy(asc(instructors.name));
  }

  async getInstructor(id: number): Promise<Instructor | undefined> {
    const [instructor] = await db.select().from(instructors).where(eq(instructors.id, id));
    return instructor;
  }

  async createInstructor(instructorData: InsertInstructor): Promise<Instructor> {
    const [instructor] = await db.insert(instructors).values(instructorData).returning();
    return instructor;
  }

  // Course operations
  async getCourses(filters?: {
    category?: string;
    isFree?: boolean;
    hasQuiz?: boolean;
    hasCertificate?: boolean;
    isFeatured?: boolean;
    search?: string;
    sortBy?: "newest" | "priceLowHigh" | "priceHighLow" | "rating";
  }): Promise<CourseWithInstructor[]> {
    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(courses.category, filters.category));
    }
    if (filters?.isFree !== undefined) {
      conditions.push(eq(courses.isFree, filters.isFree));
    }
    if (filters?.hasQuiz !== undefined) {
      conditions.push(eq(courses.hasQuiz, filters.hasQuiz));
    }
    if (filters?.hasCertificate !== undefined) {
      conditions.push(eq(courses.hasCertificate, filters.hasCertificate));
    }
    if (filters?.isFeatured !== undefined) {
      conditions.push(eq(courses.isFeatured, filters.isFeatured));
    }
    if (filters?.search) {
      conditions.push(ilike(courses.title, `%${filters.search}%`));
    }

    // Build the order clause
    let orderClause;
    switch (filters?.sortBy) {
      case "newest":
        orderClause = desc(courses.createdAt);
        break;
      case "priceLowHigh":
        orderClause = asc(courses.price);
        break;
      case "priceHighLow":
        orderClause = desc(courses.price);
        break;
      case "rating":
        orderClause = desc(courses.rating);
        break;
      default:
        orderClause = desc(courses.createdAt);
    }

    const results = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        category: courses.category,
        instructorId: courses.instructorId,
        duration: courses.duration,
        price: courses.price,
        isFree: courses.isFree,
        hasQuiz: courses.hasQuiz,
        hasCertificate: courses.hasCertificate,
        isFeatured: courses.isFeatured,
        isBestseller: courses.isBestseller,
        level: courses.level,
        thumbnailUrl: courses.thumbnailUrl,
        rating: courses.rating,
        enrollmentCount: courses.enrollmentCount,
        published: courses.published,
        publishedAt: courses.publishedAt,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
          userId: instructors.userId,
          name: instructors.name,
          bio: instructors.bio,
          email: instructors.email,
          profileImage: instructors.profileImage,
          expertise: instructors.expertise,
          createdAt: instructors.createdAt,
        },
      })
      .from(courses)
      .leftJoin(instructors, eq(courses.instructorId, instructors.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderClause);

    return results.map(row => ({
      ...row,
      instructor: row.instructor || {
        id: 0,
        userId: null,
        name: 'Unknown Instructor',
        bio: null,
        email: null,
        profileImage: null,
        expertise: null,
        createdAt: null,
      },
    }));
  }

  async getCourse(id: number): Promise<CourseWithInstructor | undefined> {
    const [course] = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        category: courses.category,
        instructorId: courses.instructorId,
        duration: courses.duration,
        price: courses.price,
        isFree: courses.isFree,
        hasQuiz: courses.hasQuiz,
        hasCertificate: courses.hasCertificate,
        isFeatured: courses.isFeatured,
        isBestseller: courses.isBestseller,
        level: courses.level,
        thumbnailUrl: courses.thumbnailUrl,
        rating: courses.rating,
        enrollmentCount: courses.enrollmentCount,
        published: courses.published,
        publishedAt: courses.publishedAt,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
          userId: instructors.userId,
          name: instructors.name,
          bio: instructors.bio,
          email: instructors.email,
          profileImage: instructors.profileImage,
          expertise: instructors.expertise,
          createdAt: instructors.createdAt,
        },
      })
      .from(courses)
      .leftJoin(instructors, eq(courses.instructorId, instructors.id))
      .where(eq(courses.id, id));
    
    if (!course) return undefined;
    
    return {
      ...course,
      instructor: course.instructor || {
        id: 0,
        userId: null,
        name: 'Unknown Instructor',
        bio: null,
        email: null,
        profileImage: null,
        expertise: null,
        createdAt: null,
      },
    };
  }

  async getCourseWithProgress(id: number, userId?: string): Promise<CourseWithProgress | undefined> {
    const course = await this.getCourse(id);
    if (!course || !userId) return course;

    const enrollment = await this.getUserEnrollment(userId, id);
    return {
      ...course,
      enrollment,
      userProgress: enrollment?.progress || 0,
    };
  }

  async createCourse(courseData: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  async updateCourse(id: number, courseData: InsertCourse): Promise<Course | undefined> {
    const [course] = await db
      .update(courses)
      .set({
        ...courseData,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async deleteCourse(id: number): Promise<boolean> {
    // First check if there are enrollments for this course
    const existingEnrollments = await db.select().from(enrollments).where(eq(enrollments.courseId, id));
    
    if (existingEnrollments.length > 0) {
      throw new Error(`Cannot delete course: ${existingEnrollments.length} student(s) are enrolled. Please remove all enrollments first.`);
    }

    // Also check for other dependencies and clean them up
    const existingTopics = await db.select().from(topics).where(eq(topics.courseId, id));
    const existingReviews = await db.select().from(reviews).where(eq(reviews.courseId, id));
    const existingCertificates = await db.select().from(certificates).where(eq(certificates.courseId, id));
    
    // Delete related data first to avoid foreign key constraints
    if (existingTopics.length > 0) {
      // Delete lessons first, then topics
      for (const topic of existingTopics) {
        // Delete lesson progress and document progress for lessons in this topic
        const topicLessons = await db.select().from(lessons).where(eq(lessons.topicId, topic.id));
        for (const lesson of topicLessons) {
          await db.delete(lessonProgress).where(eq(lessonProgress.lessonId, lesson.id));
          await db.delete(documentProgress).where(eq(documentProgress.lessonId, lesson.id));
        }
        await db.delete(lessons).where(eq(lessons.topicId, topic.id));
      }
      await db.delete(topics).where(eq(topics.courseId, id));
    }
    
    if (existingReviews.length > 0) {
      await db.delete(reviews).where(eq(reviews.courseId, id));
    }
    
    if (existingCertificates.length > 0) {
      await db.delete(certificates).where(eq(certificates.courseId, id));
    }

    // Finally delete the course
    const result = await db.delete(courses).where(eq(courses.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getNewestCourses(limit = 6): Promise<CourseWithInstructor[]> {
    const results = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        category: courses.category,
        instructorId: courses.instructorId,
        duration: courses.duration,
        price: courses.price,
        isFree: courses.isFree,
        hasQuiz: courses.hasQuiz,
        hasCertificate: courses.hasCertificate,
        isFeatured: courses.isFeatured,
        isBestseller: courses.isBestseller,
        level: courses.level,
        thumbnailUrl: courses.thumbnailUrl,
        rating: courses.rating,
        enrollmentCount: courses.enrollmentCount,
        published: courses.published,
        publishedAt: courses.publishedAt,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
          userId: instructors.userId,
          name: instructors.name,
          bio: instructors.bio,
          email: instructors.email,
          profileImage: instructors.profileImage,
          expertise: instructors.expertise,
          createdAt: instructors.createdAt,
        },
      })
      .from(courses)
      .leftJoin(instructors, eq(courses.instructorId, instructors.id))
      .orderBy(desc(courses.createdAt))
      .limit(limit);

    return results.map(row => ({
      ...row,
      instructor: row.instructor || {
        id: 0,
        userId: null,
        name: 'Unknown Instructor',
        bio: null,
        email: null,
        profileImage: null,
        expertise: null,
        createdAt: null,
      },
    }));
  }

  async getFreeCourses(limit = 4): Promise<CourseWithInstructor[]> {
    const results = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        category: courses.category,
        instructorId: courses.instructorId,
        duration: courses.duration,
        price: courses.price,
        isFree: courses.isFree,
        hasQuiz: courses.hasQuiz,
        hasCertificate: courses.hasCertificate,
        isFeatured: courses.isFeatured,
        isBestseller: courses.isBestseller,
        level: courses.level,
        thumbnailUrl: courses.thumbnailUrl,
        rating: courses.rating,
        enrollmentCount: courses.enrollmentCount,
        published: courses.published,
        publishedAt: courses.publishedAt,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
          userId: instructors.userId,
          name: instructors.name,
          bio: instructors.bio,
          email: instructors.email,
          profileImage: instructors.profileImage,
          expertise: instructors.expertise,
          createdAt: instructors.createdAt,
        },
      })
      .from(courses)
      .leftJoin(instructors, eq(courses.instructorId, instructors.id))
      .where(eq(courses.isFree, true))
      .orderBy(desc(courses.rating))
      .limit(limit);

    return results.map(row => ({
      ...row,
      instructor: row.instructor || {
        id: 0,
        userId: null,
        name: 'Unknown Instructor',
        bio: null,
        email: null,
        profileImage: null,
        expertise: null,
        createdAt: null,
      },
    }));
  }

  async getFeaturedCourses(): Promise<CourseWithInstructor[]> {
    const results = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        category: courses.category,
        instructorId: courses.instructorId,
        duration: courses.duration,
        price: courses.price,
        isFree: courses.isFree,
        hasQuiz: courses.hasQuiz,
        hasCertificate: courses.hasCertificate,
        isFeatured: courses.isFeatured,
        isBestseller: courses.isBestseller,
        level: courses.level,
        thumbnailUrl: courses.thumbnailUrl,
        rating: courses.rating,
        enrollmentCount: courses.enrollmentCount,
        published: courses.published,
        publishedAt: courses.publishedAt,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
          userId: instructors.userId,
          name: instructors.name,
          bio: instructors.bio,
          email: instructors.email,
          profileImage: instructors.profileImage,
          expertise: instructors.expertise,
          createdAt: instructors.createdAt,
        },
      })
      .from(courses)
      .leftJoin(instructors, eq(courses.instructorId, instructors.id))
      .where(eq(courses.isFeatured, true))
      .orderBy(desc(courses.rating));

    return results.map(row => ({
      ...row,
      instructor: row.instructor || {
        id: 0,
        userId: null,
        name: 'Unknown Instructor',
        bio: null,
        email: null,
        profileImage: null,
        expertise: null,
        createdAt: null,
      },
    }));
  }

  // Topic operations
  async getCourseTopics(courseId: number): Promise<Topic[]> {
    return await db
      .select()
      .from(topics)
      .where(eq(topics.courseId, courseId))
      .orderBy(asc(topics.orderIndex));
  }

  async createTopic(topicData: InsertTopic): Promise<Topic> {
    const [topic] = await db.insert(topics).values(topicData).returning();
    return topic;
  }

  async updateTopic(id: number, topicData: Partial<InsertTopic>): Promise<Topic | undefined> {
    const [topic] = await db
      .update(topics)
      .set({
        ...topicData,
        updatedAt: new Date(),
      })
      .where(eq(topics.id, id))
      .returning();
    return topic;
  }

  async deleteTopic(id: number): Promise<boolean> {
    // First delete all lessons in this topic
    await db.delete(lessons).where(eq(lessons.topicId, id));
    // Then delete the topic
    const result = await db.delete(topics).where(eq(topics.id, id));
    return (result.rowCount || 0) > 0;
  }

  async duplicateTopic(id: number): Promise<Topic> {
    const originalTopic = await db.select().from(topics).where(eq(topics.id, id));
    if (!originalTopic[0]) throw new Error("Topic not found");

    const topic = originalTopic[0];
    const topicLessons = await this.getTopicLessons(id);
    
    // Get next order index
    const [maxOrder] = await db
      .select({ max: sql<number>`max(${topics.orderIndex})` })
      .from(topics)
      .where(eq(topics.courseId, topic.courseId!));
    
    const newOrderIndex = (maxOrder.max || 0) + 1;

    // Create duplicate topic
    const [newTopic] = await db
      .insert(topics)
      .values({
        courseId: topic.courseId,
        title: `${topic.title} (Copy)`,
        orderIndex: newOrderIndex,
      })
      .returning();

    // Duplicate lessons
    for (const lesson of topicLessons) {
      await this.createLesson({
        courseId: lesson.courseId,
        topicId: newTopic.id,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        orderIndex: lesson.orderIndex,
        sectionTitle: lesson.sectionTitle,
        sectionOrder: lesson.sectionOrder,
        isLocked: lesson.isLocked,
        isPreview: lesson.isPreview,
        isRequired: lesson.isRequired,
        completeOnVideoEnd: lesson.completeOnVideoEnd,
      });
    }

    return newTopic;
  }

  async reorderTopics(courseId: number, topicOrders: { id: number; orderIndex: number }[]): Promise<void> {
    for (const { id, orderIndex } of topicOrders) {
      await db
        .update(topics)
        .set({ orderIndex, updatedAt: new Date() })
        .where(eq(topics.id, id));
    }
  }

  // Lesson operations
  async getCourseLessons(courseId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.orderIndex));
  }

  async getTopicLessons(topicId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.topicId, topicId))
      .orderBy(asc(lessons.orderIndex));
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(lessonData).returning();
    return lesson;
  }

  async updateLesson(id: number, lessonData: Partial<InsertLesson>): Promise<Lesson | undefined> {
    const [lesson] = await db
      .update(lessons)
      .set({
        ...lessonData,
        updatedAt: new Date(),
      })
      .where(eq(lessons.id, id))
      .returning();
    return lesson;
  }

  async deleteLesson(id: number): Promise<boolean> {
    const result = await db.delete(lessons).where(eq(lessons.id, id));
    return (result.rowCount || 0) > 0;
  }

  async reorderLessons(topicId: number, lessonOrders: { id: number; orderIndex: number }[]): Promise<void> {
    for (const { id, orderIndex } of lessonOrders) {
      await db
        .update(lessons)
        .set({ orderIndex, updatedAt: new Date() })
        .where(eq(lessons.id, id));
    }
  }

  // Enrollment operations
  async enrollUser(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(enrollmentData).returning();
    return enrollment;
  }

  async getUserEnrollments(userId: string): Promise<(Enrollment & { course: CourseWithInstructor })[]> {
    const results = await db
      .select({
        id: enrollments.id,
        userId: enrollments.userId,
        courseId: enrollments.courseId,
        enrolledAt: enrollments.enrolledAt,
        completedAt: enrollments.completedAt,
        progress: enrollments.progress,
        certificateIssued: enrollments.certificateIssued,
        course: {
          id: courses.id,
          title: courses.title,
          description: courses.description,
          category: courses.category,
          instructorId: courses.instructorId,
          duration: courses.duration,
          price: courses.price,
          isFree: courses.isFree,
          hasQuiz: courses.hasQuiz,
          hasCertificate: courses.hasCertificate,
          isFeatured: courses.isFeatured,
          isBestseller: courses.isBestseller,
          level: courses.level,
          thumbnailUrl: courses.thumbnailUrl,
          rating: courses.rating,
          enrollmentCount: courses.enrollmentCount,
          published: courses.published,
          publishedAt: courses.publishedAt,
          createdAt: courses.createdAt,
          updatedAt: courses.updatedAt,
        },
        instructor: {
          id: instructors.id,
          userId: instructors.userId,
          name: instructors.name,
          bio: instructors.bio,
          email: instructors.email,
          profileImage: instructors.profileImage,
          expertise: instructors.expertise,
          createdAt: instructors.createdAt,
        },
      })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .leftJoin(instructors, eq(courses.instructorId, instructors.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));

    return results.map(row => ({
      id: row.id,
      userId: row.userId,
      courseId: row.courseId,
      enrolledAt: row.enrolledAt,
      completedAt: row.completedAt,
      progress: row.progress,
      certificateIssued: row.certificateIssued,
      course: row.course ? {
        id: row.course.id,
        title: row.course.title,
        description: row.course.description,
        category: row.course.category,
        instructorId: row.course.instructorId,
        duration: row.course.duration,
        price: row.course.price,
        isFree: row.course.isFree,
        hasQuiz: row.course.hasQuiz,
        hasCertificate: row.course.hasCertificate,
        isFeatured: row.course.isFeatured,
        isBestseller: row.course.isBestseller,
        level: row.course.level,
        thumbnailUrl: row.course.thumbnailUrl,
        rating: row.course.rating,
        enrollmentCount: row.course.enrollmentCount,
        published: row.course.published,
        publishedAt: row.course.publishedAt,
        createdAt: row.course.createdAt,
        updatedAt: row.course.updatedAt,
        instructor: row.instructor || {
          id: 0,
          userId: null,
          name: 'Unknown Instructor',
          bio: null,
          email: null,
          profileImage: null,
          expertise: null,
          createdAt: null,
        },
      } : {
        id: 0,
        title: 'Unknown Course',
        description: null,
        category: null,
        instructorId: null,
        duration: null,
        price: null,
        isFree: null,
        hasQuiz: null,
        hasCertificate: null,
        isFeatured: null,
        isBestseller: null,
        level: null,
        thumbnailUrl: null,
        rating: null,
        enrollmentCount: null,
        published: null,
        publishedAt: null,
        createdAt: null,
        updatedAt: null,
        instructor: {
          id: 0,
          userId: null,
          name: 'Unknown Instructor',
          bio: null,
          email: null,
          profileImage: null,
          expertise: null,
          createdAt: null,
        },
      },
    }));
  }

  async getUserEnrollment(userId: string, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment;
  }

  async updateEnrollmentProgress(userId: string, courseId: number, progress: number): Promise<void> {
    await db
      .update(enrollments)
      .set({ 
        progress,
        completedAt: progress === 100 ? new Date() : null,
      })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  }

  // Lesson progress operations
  async markLessonComplete(userId: string, lessonId: number): Promise<void> {
    try {
      await db
        .insert(lessonProgress)
        .values({
          userId,
          lessonId,
          completed: true,
          completedAt: new Date(),
        });
    } catch (error) {
      // If record already exists, update it
      await db
        .update(lessonProgress)
        .set({
          completed: true,
          completedAt: new Date(),
        })
        .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)));
    }
  }

  async getUserLessonProgress(userId: string, courseId: number): Promise<any[]> {
    return await db
      .select({
        id: lessonProgress.id,
        userId: lessonProgress.userId,
        lessonId: lessonProgress.lessonId,
        completed: lessonProgress.completed,
        completedAt: lessonProgress.completedAt,
        lesson: {
          id: lessons.id,
          courseId: lessons.courseId,
        }
      })
      .from(lessonProgress)
      .leftJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
      .where(and(eq(lessonProgress.userId, userId), eq(lessons.courseId, courseId)));
  }

  // Certificate operations
  async issueCertificate(userId: string, courseId: number): Promise<Certificate> {
    const certificateNumber = `EACCC-${Date.now()}-${userId.slice(-6)}`;
    
    const [certificate] = await db
      .insert(certificates)
      .values({
        userId,
        courseId,
        certificateNumber,
      })
      .returning();

    // Update enrollment to mark certificate as issued
    await db
      .update(enrollments)
      .set({ certificateIssued: true })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));

    return certificate;
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId))
      .orderBy(desc(certificates.issuedAt));
  }

  async getCertificate(id: number): Promise<Certificate | undefined> {
    const [certificate] = await db.select().from(certificates).where(eq(certificates.id, id));
    return certificate;
  }

  // Review operations
  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    
    // Update course rating
    const [avgRating] = await db
      .select({ avg: sql<number>`avg(${reviews.rating})` })
      .from(reviews)
      .where(eq(reviews.courseId, reviewData.courseId!));

    if (avgRating.avg) {
      await db
        .update(courses)
        .set({ rating: avgRating.avg.toFixed(2) })
        .where(eq(courses.id, reviewData.courseId!));
    }

    return review;
  }

  async getCourseReviews(courseId: number): Promise<(Review & { user: User })[]> {
    const results = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        courseId: reviews.courseId,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.courseId, courseId))
      .orderBy(desc(reviews.createdAt));

    return results.map(row => ({
      id: row.id,
      userId: row.userId,
      courseId: row.courseId,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.createdAt,
      user: row.user || {
        id: 'unknown',
        email: null,
        firstName: null,
        lastName: null,
        profileImageUrl: null,
        role: null,
        createdAt: null,
        updatedAt: null,
      },
    }));
  }

  // Blog operations
  async getBlogPosts(limit = 10): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit);
  }

  async getPublishedBlogPosts(limit = 3): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  }

  // Stats
  async getStats(): Promise<{
    instructorCount: number;
    studentCount: number;
    courseCount: number;
  }> {
    const [instructorCount] = await db.select({ count: count() }).from(instructors);
    const [studentCount] = await db.select({ count: count() }).from(users);
    const [courseCount] = await db.select({ count: count() }).from(courses);

    return {
      instructorCount: instructorCount.count,
      studentCount: studentCount.count,
      courseCount: courseCount.count,
    };
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByReference(reference: string): Promise<Order | undefined> {
    console.log("DB: Searching for order with reference:", reference);
    const [order] = await db.select().from(orders).where(eq(orders.paystackReference, reference));
    console.log("DB: Query result:", order ? `Found order ${order.id}` : "No order found");
    if (order) {
      console.log("DB: Order details - ID:", order.id, "Reference:", order.paystackReference, "Status:", order.status);
    }
    return order;
  }

  async updateOrderStatus(id: number, status: string, paystackReference?: string, paystackAccessCode?: string): Promise<void> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };
    
    if (paystackReference) {
      updateData.paystackReference = paystackReference;
    }
    
    if (paystackAccessCode) {
      updateData.paystackAccessCode = paystackAccessCode;
    }

    await db.update(orders).set(updateData).where(eq(orders.id, id));
  }

  async getUserOrders(userId: string): Promise<(Order & { course: Course })[]> {
    return await db
      .select({
        id: orders.id,
        userId: orders.userId,
        courseId: orders.courseId,
        amount: orders.amount,
        currency: orders.currency,
        status: orders.status,
        paystackReference: orders.paystackReference,
        paystackAccessCode: orders.paystackAccessCode,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        course: courses,
      })
      .from(orders)
      .innerJoin(courses, eq(orders.courseId, courses.id))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalInstructors: number;
    totalRevenue: number;
    recentEnrollments: number;
  }> {
    const [userCountResult] = await db.select({ count: count(users.id) }).from(users);
    const [courseCountResult] = await db.select({ count: count(courses.id) }).from(courses);
    const [instructorCountResult] = await db.select({ count: count(instructors.id) }).from(instructors);
    
    // Calculate total revenue from completed orders
    const [revenueResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.amount}), 0)` })
      .from(orders)
      .where(eq(orders.status, "completed"));

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [recentEnrollmentsResult] = await db
      .select({ count: count(enrollments.id) })
      .from(enrollments)
      .where(sql`${enrollments.enrolledAt} >= ${thirtyDaysAgo}`);

    return {
      totalUsers: userCountResult.count,
      totalCourses: courseCountResult.count,
      totalInstructors: instructorCountResult.count,
      totalRevenue: Number(revenueResult.total) || 0,
      recentEnrollments: recentEnrollmentsResult.count,
    };
  }

  // Instructor operations
  async getInstructorStats(userId: string): Promise<{
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    avgRating: number;
  }> {
    // Get instructor record
    const [instructor] = await db
      .select()
      .from(instructors)
      .where(eq(instructors.userId, userId));

    if (!instructor) {
      return { totalCourses: 0, totalStudents: 0, totalRevenue: 0, avgRating: 0 };
    }

    // Count courses by this instructor
    const [courseCountResult] = await db
      .select({ count: count(courses.id) })
      .from(courses)
      .where(eq(courses.instructorId, instructor.id));

    // Count total students enrolled in instructor's courses
    const [studentCountResult] = await db
      .select({ count: count(enrollments.id) })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(courses.instructorId, instructor.id));

    // Calculate revenue from instructor's courses
    const [revenueResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${orders.amount}), 0)` })
      .from(orders)
      .innerJoin(courses, eq(orders.courseId, courses.id))
      .where(and(
        eq(courses.instructorId, instructor.id),
        eq(orders.status, "completed")
      ));

    // Calculate average rating for instructor's courses
    const [ratingResult] = await db
      .select({ avg: sql<number>`COALESCE(AVG(${courses.rating}), 0)` })
      .from(courses)
      .where(eq(courses.instructorId, instructor.id));

    return {
      totalCourses: courseCountResult.count,
      totalStudents: studentCountResult.count,
      totalRevenue: Number(revenueResult.total) || 0,
      avgRating: Number(ratingResult.avg) || 0,
    };
  }

  async getInstructorCourses(userId: string): Promise<Course[]> {
    // Get instructor record
    const [instructor] = await db
      .select()
      .from(instructors)
      .where(eq(instructors.userId, userId));

    if (!instructor) {
      return [];
    }

    return await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, instructor.id))
      .orderBy(desc(courses.createdAt));
  }

  async getInstructorAnalytics(userId: string): Promise<any[]> {
    // Get instructor record
    const [instructor] = await db
      .select()
      .from(instructors)
      .where(eq(instructors.userId, userId));

    if (!instructor) {
      return [];
    }

    // Get analytics for each course
    const courseAnalytics = await db
      .select({
        courseId: courses.id,
        title: courses.title,
        enrollments: sql<number>`COALESCE(COUNT(DISTINCT ${enrollments.id}), 0)`,
        completions: sql<number>`COALESCE(COUNT(DISTINCT CASE WHEN ${enrollments.progress} = 100 THEN ${enrollments.id} END), 0)`,
        revenue: sql<number>`COALESCE(SUM(CASE WHEN ${orders.status} = 'completed' THEN ${orders.amount} ELSE 0 END), 0)`,
        rating: courses.rating,
      })
      .from(courses)
      .leftJoin(enrollments, eq(courses.id, enrollments.courseId))
      .leftJoin(orders, eq(courses.id, orders.courseId))
      .where(eq(courses.instructorId, instructor.id))
      .groupBy(courses.id, courses.title, courses.rating);

    return courseAnalytics.map(row => ({
      courseId: row.courseId,
      title: row.title,
      enrollments: Number(row.enrollments),
      completions: Number(row.completions),
      revenue: Number(row.revenue),
      rating: Number(row.rating),
    }));
  }

  async getInstructorStudents(userId: string): Promise<any[]> {
    // Get instructor record
    const [instructor] = await db
      .select()
      .from(instructors)
      .where(eq(instructors.userId, userId));

    if (!instructor) {
      return [];
    }

    // Get students enrolled in instructor's courses
    const studentProgress = await db
      .select({
        userId: users.id,
        studentName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        courseTitle: courses.title,
        progress: enrollments.progress,
        enrolledAt: enrollments.enrolledAt,
        lastActive: enrollments.enrolledAt, // Using enrolled date as placeholder for last active
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .innerJoin(users, eq(enrollments.userId, users.id))
      .where(eq(courses.instructorId, instructor.id))
      .orderBy(desc(enrollments.enrolledAt));

    return studentProgress.map(row => ({
      userId: row.userId,
      studentName: row.studentName,
      courseTitle: row.courseTitle,
      progress: row.progress || 0,
      enrolledAt: row.enrolledAt?.toISOString() || "",
      lastActive: row.lastActive?.toISOString() || "",
    }));
  }

  // Document progress operations
  async trackDocumentProgress(userId: string, lessonId: number, page: number): Promise<void> {
    // Insert or update document progress for the specific page
    await db
      .insert(documentProgress)
      .values({
        userId,
        lessonId,
        page,
        viewedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [documentProgress.userId, documentProgress.lessonId, documentProgress.page],
        set: {
          viewedAt: new Date(),
        },
      });
  }

  async getDocumentProgress(userId: string, lessonId: number): Promise<number[]> {
    const progress = await db
      .select({
        page: documentProgress.page,
      })
      .from(documentProgress)
      .where(
        and(
          eq(documentProgress.userId, userId),
          eq(documentProgress.lessonId, lessonId)
        )
      )
      .orderBy(asc(documentProgress.page));

    return progress.map(p => p.page);
  }
}

export const storage = new DatabaseStorage();

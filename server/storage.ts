import {
  users,
  instructors,
  courses,
  lessons,
  enrollments,
  lessonProgress,
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
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type LessonProgress,
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
  getNewestCourses(limit?: number): Promise<CourseWithInstructor[]>;
  getFreeCourses(limit?: number): Promise<CourseWithInstructor[]>;
  getFeaturedCourses(): Promise<CourseWithInstructor[]>;

  // Lesson operations
  getCourseLessons(courseId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

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
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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
    let query = db
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
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
          name: instructors.name,
          bio: instructors.bio,
          email: instructors.email,
          profileImage: instructors.profileImage,
          expertise: instructors.expertise,
          createdAt: instructors.createdAt,
        },
      })
      .from(courses)
      .leftJoin(instructors, eq(courses.instructorId, instructors.id));

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

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case "newest":
        query = query.orderBy(desc(courses.createdAt));
        break;
      case "priceLowHigh":
        query = query.orderBy(asc(courses.price));
        break;
      case "priceHighLow":
        query = query.orderBy(desc(courses.price));
        break;
      case "rating":
        query = query.orderBy(desc(courses.rating));
        break;
      default:
        query = query.orderBy(desc(courses.createdAt));
    }

    return await query;
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
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
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
    
    return course;
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

  async getNewestCourses(limit = 6): Promise<CourseWithInstructor[]> {
    return await db
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
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
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
  }

  async getFreeCourses(limit = 4): Promise<CourseWithInstructor[]> {
    return await db
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
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
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
  }

  async getFeaturedCourses(): Promise<CourseWithInstructor[]> {
    return await db
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
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructor: {
          id: instructors.id,
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
  }

  // Lesson operations
  async getCourseLessons(courseId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
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

  // Enrollment operations
  async enrollUser(enrollmentData: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(enrollmentData).returning();
    return enrollment;
  }

  async getUserEnrollments(userId: string): Promise<(Enrollment & { course: CourseWithInstructor })[]> {
    return await db
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
          createdAt: courses.createdAt,
          updatedAt: courses.updatedAt,
          instructor: {
            id: instructors.id,
            name: instructors.name,
            bio: instructors.bio,
            email: instructors.email,
            profileImage: instructors.profileImage,
            expertise: instructors.expertise,
            createdAt: instructors.createdAt,
          },
        },
      })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .leftJoin(instructors, eq(courses.instructorId, instructors.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
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

  async getUserLessonProgress(userId: string, courseId: number): Promise<LessonProgress[]> {
    return await db
      .select()
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
      .where(eq(reviews.courseId, reviewData.courseId));

    if (avgRating.avg) {
      await db
        .update(courses)
        .set({ rating: avgRating.avg.toFixed(2) })
        .where(eq(courses.id, reviewData.courseId));
    }

    return review;
  }

  async getCourseReviews(courseId: number): Promise<(Review & { user: User })[]> {
    return await db
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
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.courseId, courseId))
      .orderBy(desc(reviews.createdAt));
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
    const [order] = await db.select().from(orders).where(eq(orders.paystackReference, reference));
    return order;
  }

  async updateOrderStatus(id: number, status: string, paystackReference?: string): Promise<void> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };
    
    if (paystackReference) {
      updateData.paystackReference = paystackReference;
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
}

export const storage = new DatabaseStorage();

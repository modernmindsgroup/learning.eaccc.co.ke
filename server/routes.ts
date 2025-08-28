import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCourseSchema, 
  insertLessonSchema,
  insertEnrollmentSchema,
  insertReviewSchema,
  insertInstructorSchema,
  insertOrderSchema 
} from "@shared/schema";
import { z } from "zod";
import { paystackService } from "./paystack";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static assets (course images and other attachments)
  app.use('/attached_assets', express.static('attached_assets'));

  // Serve course images - generated and placeholder
  const courseImages: Record<string, string> = {
    'customer-excellence-final-new.jpg': 'Customer_Excellence_Training_Photo_3be7b22a.png',
    'mastering-customer-experience-new.jpg': 'Advanced_Customer_Experience_Course_0caa0cf1.png',
    'introduction-customer-service-new.jpg': 'Basic_Customer_Service_Course_e5eb5899.png',
    'enhancing-customer-experience-new.jpg': 'Intermediate_Customer_Experience_Course_514aa6b9.png',
    'business-development.jpg': 'Business_Development_Training_Course_7f058f5d.png',
    'customer-retention.jpg': 'Customer_Retention_Strategy_Course_492098ce.png'
  };

  app.get("/api/placeholder/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    
    // Check if we have a generated image for this course
    if (courseImages[imageName]) {
      const imagePath = `attached_assets/generated_images/${courseImages[imageName]}`;
      return res.sendFile(imagePath, { root: process.cwd() });
    }
    
    // Return a simple SVG placeholder with EACCC branding for other images
    const svg = `
      <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="225" fill="#F8F9FA"/>
        <rect x="20" y="20" width="360" height="185" fill="#0097D7" rx="8"/>
        <text x="200" y="100" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">EACCC Learning</text>
        <text x="200" y="130" text-anchor="middle" fill="#F7941D" font-family="Arial, sans-serif" font-size="12">${imageName.replace(/[.-]/g, ' ').replace(/jpg|png/g, '').trim()}</text>
      </svg>
    `;
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public routes - Stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Public routes - Courses
  app.get("/api/courses", async (req, res) => {
    try {
      const {
        category,
        isFree,
        hasQuiz,
        hasCertificate,
        isFeatured,
        search,
        sortBy,
      } = req.query;

      const filters = {
        category: category as string,
        isFree: isFree === "true" ? true : isFree === "false" ? false : undefined,
        hasQuiz: hasQuiz === "true" ? true : hasQuiz === "false" ? false : undefined,
        hasCertificate: hasCertificate === "true" ? true : hasCertificate === "false" ? false : undefined,
        isFeatured: isFeatured === "true" ? true : isFeatured === "false" ? false : undefined,
        search: search as string,
        sortBy: sortBy as "newest" | "priceLowHigh" | "priceHighLow" | "rating",
      };

      const courses = await storage.getCourses(filters);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/newest", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const courses = await storage.getNewestCourses(limit);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching newest courses:", error);
      res.status(500).json({ message: "Failed to fetch newest courses" });
    }
  });

  app.get("/api/courses/free", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const courses = await storage.getFreeCourses(limit);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching free courses:", error);
      res.status(500).json({ message: "Failed to fetch free courses" });
    }
  });

  app.get("/api/courses/featured", async (req, res) => {
    try {
      const courses = await storage.getFeaturedCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching featured courses:", error);
      res.status(500).json({ message: "Failed to fetch featured courses" });
    }
  });

  app.get("/api/courses/:id", async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      // Get basic course information
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // If user is authenticated, include enrollment information
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const enrollment = await storage.getUserEnrollment(userId, courseId);
        
        // Add enrollment and progress information for authenticated users
        const courseWithProgress = {
          ...course,
          enrollment: enrollment || null,
          userProgress: enrollment?.progress || 0,
        };
        
        res.json(courseWithProgress);
      } else {
        // For non-authenticated users, return basic course info
        res.json(course);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Course lessons
  app.get("/api/courses/:id/lessons", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const lessons = await storage.getCourseLessons(courseId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching course lessons:", error);
      res.status(500).json({ message: "Failed to fetch course lessons" });
    }
  });

  // Course reviews
  app.get("/api/courses/:id/reviews", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const reviews = await storage.getCourseReviews(courseId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching course reviews:", error);
      res.status(500).json({ message: "Failed to fetch course reviews" });
    }
  });

  // Instructors
  app.get("/api/instructors", async (req, res) => {
    try {
      const instructors = await storage.getInstructors();
      res.json(instructors);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      res.status(500).json({ message: "Failed to fetch instructors" });
    }
  });

  app.get("/api/instructors/:id", async (req, res) => {
    try {
      const instructorId = parseInt(req.params.id);
      const instructor = await storage.getInstructor(instructorId);
      
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }
      
      res.json(instructor);
    } catch (error) {
      console.error("Error fetching instructor:", error);
      res.status(500).json({ message: "Failed to fetch instructor" });
    }
  });

  // Blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const posts = await storage.getPublishedBlogPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Protected routes - require authentication
  
  // User enrollment
  app.post("/api/courses/:id/enroll", isAuthenticated, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Check if user is already enrolled
      const existingEnrollment = await storage.getUserEnrollment(userId, courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      // Check if course exists
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const enrollment = await storage.enrollUser({
        userId,
        courseId,
      });

      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling user:", error);
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  // User enrollments
  app.get("/api/my-enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Get lesson progress for a course
  app.get("/api/lesson-progress/:courseId", isAuthenticated, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = req.user.claims.sub;
      
      const progress = await storage.getUserLessonProgress(userId, courseId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  // Mark lesson complete
  app.post("/api/lessons/:id/complete", isAuthenticated, async (req: any, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      await storage.markLessonComplete(userId, lessonId);

      // Get lesson to find course
      const lesson = await storage.getLesson(lessonId);
      if (lesson) {
        // Calculate and update course progress
        const allLessons = await storage.getCourseLessons(lesson.courseId);
        const userProgress = await storage.getUserLessonProgress(userId, lesson.courseId);
        const progress = Math.round((userProgress.length / allLessons.length) * 100);
        
        await storage.updateEnrollmentProgress(userId, lesson.courseId, progress);

        // Issue certificate if course is completed
        if (progress === 100) {
          const course = await storage.getCourse(lesson.courseId);
          if (course?.hasCertificate) {
            await storage.issueCertificate(userId, lesson.courseId);
          }
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error marking lesson complete:", error);
      res.status(500).json({ message: "Failed to mark lesson complete" });
    }
  });

  // Get user certificates
  app.get("/api/my-certificates", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const certificates = await storage.getUserCertificates(userId);
      res.json(certificates);
    } catch (error) {
      console.error("Error fetching user certificates:", error);
      res.status(500).json({ message: "Failed to fetch certificates" });
    }
  });

  // Create course review
  app.post("/api/courses/:id/reviews", isAuthenticated, async (req: any, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId,
        courseId,
      });

      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Admin routes (for demo purposes, these would normally require admin auth)
  
  // Create instructor
  app.post("/api/instructors", async (req, res) => {
    try {
      const instructorData = insertInstructorSchema.parse(req.body);
      const instructor = await storage.createInstructor(instructorData);
      res.json(instructor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid instructor data", errors: error.errors });
      }
      console.error("Error creating instructor:", error);
      res.status(500).json({ message: "Failed to create instructor" });
    }
  });

  // Create course
  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Create lesson
  app.post("/api/lessons", async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.json(lesson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lesson data", errors: error.errors });
      }
      console.error("Error creating lesson:", error);
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  // Payment routes
  app.post("/api/payments/initialize", isAuthenticated, async (req: any, res) => {
    try {
      const { courseId } = req.body;
      const userId = req.user.claims.sub;

      // Get course details
      const course = await storage.getCourse(parseInt(courseId));
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check if user is already enrolled
      const existingEnrollment = await storage.getUserEnrollment(userId, parseInt(courseId));
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      // Get user details
      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email is required for payment" });
      }

      // Generate reference
      const reference = `eaccc_${Date.now()}_${courseId}_${userId}`;

      // Create order record
      const order = await storage.createOrder({
        userId,
        courseId: parseInt(courseId),
        amount: course.price,
        currency: "USD",
        status: "pending",
        paystackReference: reference,
      });

      // Initialize payment with Paystack
      const paymentData = {
        email: user.email,
        amount: parseFloat(course.price) * 100, // Convert to cents
        reference,
        callback_url: `${req.protocol}://${req.get('host')}/api/payments/callback`,
        metadata: {
          courseId: courseId,
          courseName: course.title,
          userId: userId,
          orderId: order.id,
        },
      };

      const paymentResponse = await paystackService.initializePayment(paymentData);

      if (paymentResponse.status) {
        // Update order with access code
        await storage.updateOrderStatus(order.id, "pending", paymentResponse.data.access_code);

        res.json({
          status: true,
          data: {
            authorization_url: paymentResponse.data.authorization_url,
            access_code: paymentResponse.data.access_code,
            reference: paymentResponse.data.reference,
          },
        });
      } else {
        await storage.updateOrderStatus(order.id, "failed");
        res.status(400).json({ message: "Failed to initialize payment" });
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/payments/callback", async (req, res) => {
    try {
      const { reference } = req.query;

      if (!reference) {
        return res.redirect("/?payment=failed");
      }

      // Verify payment
      const verification = await paystackService.verifyPayment(reference as string);

      if (verification.status && verification.data.status === "success") {
        // Get order
        const order = await storage.getOrderByReference(reference as string);
        
        if (order) {
          // Update order status
          await storage.updateOrderStatus(order.id, "completed", reference as string);

          // Enroll user in course
          if (order.userId && order.courseId) {
            await storage.enrollUser({
              userId: order.userId,
              courseId: order.courseId,
            });

            // Redirect to course page
            res.redirect(`/course/${order.courseId}?payment=success`);
          } else {
            res.redirect("/?payment=failed");
          }
        } else {
          res.redirect("/?payment=failed");
        }
      } else {
        res.redirect("/?payment=failed");
      }
    } catch (error) {
      console.error("Payment callback error:", error);
      res.redirect("/?payment=failed");
    }
  });

  app.post("/api/payments/verify", isAuthenticated, async (req: any, res) => {
    try {
      const { reference } = req.body;

      if (!reference) {
        return res.status(400).json({ message: "Reference is required" });
      }

      const verification = await paystackService.verifyPayment(reference);

      if (verification.status && verification.data.status === "success") {
        // Get order
        const order = await storage.getOrderByReference(reference);
        
        if (order) {
          // Update order status
          await storage.updateOrderStatus(order.id, "completed", reference);

          // Enroll user in course
          if (order.userId && order.courseId) {
            await storage.enrollUser({
              userId: order.userId,
              courseId: order.courseId,
            });

            res.json({ 
              status: true, 
              message: "Payment verified successfully",
              courseId: order.courseId 
            });
          } else {
            res.status(400).json({ message: "Invalid order data" });
          }
        } else {
          res.status(404).json({ message: "Order not found" });
        }
      } else {
        res.status(400).json({ message: "Payment verification failed" });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Order routes
  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const order = await storage.getOrder(orderId);
      
      if (!order || order.userId !== userId) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

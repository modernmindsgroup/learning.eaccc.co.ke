-- PostgreSQL Database Export
-- Generated on: 2025-09-10T05:47:26.554Z
-- 

SET session_replication_role = replica;

-- Table: blog_posts (4 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" INTEGER NOT NULL DEFAULT nextval('blog_posts_id_seq'::regclass),
  "title" CHARACTER VARYING(255) NOT NULL,
  "slug" CHARACTER VARYING(255) NOT NULL,
  "excerpt" TEXT,
  "content" TEXT,
  "thumbnail_url" CHARACTER VARYING,
  "category" CHARACTER VARYING(100),
  "published" BOOLEAN DEFAULT false,
  "published_at" TIMESTAMP WITHOUT TIME ZONE,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

INSERT INTO "blog_posts" ("id", "title", "slug", "excerpt", "content", "thumbnail_url", "category", "published", "published_at", "created_at") VALUES
  (1, '10 Essential Customer Service Skills Every Professional Needs', '10-essential-customer-service-skills', 'Discover the fundamental skills that separate good customer service from exceptional customer service in today''s competitive market.', 'Customer service excellence starts with mastering these 10 essential skills: active listening, empathy, clear communication, problem-solving, patience, product knowledge, positive attitude, time management, adaptability, and emotional intelligence. Each skill plays a crucial role in creating memorable customer experiences that drive business growth.', '/api/placeholder/400/250', 'Customer Service', TRUE, '2025-08-23T12:12:05.056Z', '2025-08-28T12:12:05.056Z'),
  (2, 'The Future of Customer Experience in East Africa', 'future-customer-experience-east-africa', 'Explore emerging trends and technologies shaping customer experience across East African markets.', 'East Africa is experiencing a digital transformation that''s reshaping customer expectations. From mobile-first approaches to AI-powered customer support, businesses must adapt to stay competitive. This article explores key trends including digital payment integration, multilingual support systems, and culturally-sensitive service design.', '/api/placeholder/400/250', 'Industry Trends', TRUE, '2025-08-25T12:12:05.056Z', '2025-08-28T12:12:05.056Z'),
  (3, 'Building a Customer-Centric Culture: A Leadership Guide', 'building-customer-centric-culture', 'Learn how leaders can foster a culture that puts customers at the heart of every business decision.', 'Creating a customer-centric culture requires intentional leadership and systematic change. This comprehensive guide covers strategy development, employee engagement, measurement systems, and sustainable culture transformation. Real case studies from successful East African companies provide practical insights.', '/api/placeholder/400/250', 'Leadership', TRUE, '2025-08-27T12:12:05.056Z', '2025-08-28T12:12:05.056Z'),
  (4, 'Digital Customer Support: Tools and Best Practices', 'digital-customer-support-tools', 'Master modern customer support technologies and learn implementation best practices.', 'The digital customer support landscape is evolving rapidly. From chatbots to omnichannel platforms, businesses have more tools than ever to serve customers effectively. This article reviews popular platforms, integration strategies, and best practices for maintaining personal touch in digital interactions.', '/api/placeholder/400/250', 'Technology', TRUE, '2025-08-21T12:12:05.056Z', '2025-08-28T12:12:05.056Z');

ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");


-- Table: certificates (7 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "certificates" (
  "id" INTEGER NOT NULL DEFAULT nextval('certificates_id_seq'::regclass),
  "user_id" CHARACTER VARYING,
  "course_id" INTEGER,
  "certificate_number" CHARACTER VARYING NOT NULL,
  "issued_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "pdf_url" CHARACTER VARYING
);

INSERT INTO "certificates" ("id", "user_id", "course_id", "certificate_number", "issued_at", "pdf_url") VALUES
  (1, 'user_demo_001', 1, 'EACCC-CS001-2024-001', '2025-08-26T12:12:48.087Z', '/api/certificates/EACCC-CS001-2024-001.pdf'),
  (2, 'user_demo_002', 1, 'EACCC-CS001-2024-002', '2025-08-23T12:12:48.087Z', '/api/certificates/EACCC-CS001-2024-002.pdf'),
  (3, 'user_demo_003', 5, 'EACCC-COM005-2024-003', '2025-08-25T12:12:48.087Z', '/api/certificates/EACCC-COM005-2024-003.pdf'),
  (4, 'user_demo_004', 1, 'EACCC-CS001-2024-004', '2025-08-18T12:12:48.087Z', '/api/certificates/EACCC-CS001-2024-004.pdf'),
  (5, 'user_demo_007', 1, 'EACCC-CS001-2024-007', '2025-08-13T12:12:48.087Z', '/api/certificates/EACCC-CS001-2024-007.pdf'),
  (6, 'user_demo_008', 5, 'EACCC-COM005-2024-008', '2025-08-27T12:12:48.087Z', '/api/certificates/EACCC-COM005-2024-008.pdf'),
  (7, '45058292', 12, 'EACCC-1757003124114-058292', '2025-09-04T16:25:24.166Z', NULL);

ALTER TABLE "certificates" ADD CONSTRAINT "certificates_pkey" PRIMARY KEY ("id");


-- Table: courses (13 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "courses" (
  "id" INTEGER NOT NULL DEFAULT nextval('courses_id_seq'::regclass),
  "title" CHARACTER VARYING(255) NOT NULL,
  "description" TEXT,
  "category" CHARACTER VARYING(100),
  "instructor_id" INTEGER,
  "duration" CHARACTER VARYING,
  "price" NUMERIC(10,2) DEFAULT 0.00,
  "is_free" BOOLEAN DEFAULT true,
  "has_quiz" BOOLEAN DEFAULT false,
  "has_certificate" BOOLEAN DEFAULT true,
  "is_featured" BOOLEAN DEFAULT false,
  "is_bestseller" BOOLEAN DEFAULT false,
  "level" CHARACTER VARYING(50),
  "thumbnail_url" CHARACTER VARYING,
  "rating" NUMERIC(3,2) DEFAULT 0.00,
  "enrollment_count" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "published" BOOLEAN DEFAULT false,
  "published_at" TIMESTAMP WITHOUT TIME ZONE
);

INSERT INTO "courses" ("id", "title", "description", "category", "instructor_id", "duration", "price", "is_free", "has_quiz", "has_certificate", "is_featured", "is_bestseller", "level", "thumbnail_url", "rating", "enrollment_count", "created_at", "updated_at", "published", "published_at") VALUES
  (7, 'Digital Customer Support Excellence', 'Modern approaches to customer support using digital channels. Learn about chatbots, social media support, and omnichannel customer experiences.', 'Customer Service', 4, '3:30 Hours', '109.99', FALSE, TRUE, TRUE, FALSE, FALSE, 'Intermediate', '/attached_assets/generated_images/Customer_Excellence_Training_Photo_3be7b22a.png', '4.40', 278, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (8, 'Basic Customer Service Skills', 'Perfect for newcomers to customer service. Learn fundamental skills including active listening, empathy, problem-solving, and professional communication.', 'Customer Service', 1, '2:15 Hours', '0.00', TRUE, TRUE, TRUE, FALSE, FALSE, 'Beginner', '/attached_assets/generated_images/Basic_Customer_Service_Course_e5eb5899.png', '4.30', 1543, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (9, 'Intermediate Customer Experience Design', 'Bridge the gap between basic and advanced customer service. Learn experience design principles and how to create memorable customer interactions.', 'Customer Service', 1, '4:00 Hours', '69.99', FALSE, TRUE, TRUE, FALSE, FALSE, 'Intermediate', '/attached_assets/generated_images/Intermediate_Customer_Experience_Course_514aa6b9.png', '4.70', 445, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (10, 'Strategic Business Development for SMEs', 'Specialized training for small and medium enterprises. Learn how to identify opportunities, develop partnerships, and scale your business effectively.', 'Business Development', 2, '3:15 Hours', '149.99', FALSE, TRUE, TRUE, TRUE, FALSE, 'Advanced', '/attached_assets/generated_images/Business_development_course_thumbnail_4a65670f.png', '4.90', 198, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (1, 'Customer Service Excellence Fundamentals', 'Master the core principles of exceptional customer service. Learn how to handle difficult customers, exceed expectations, and build lasting relationships that drive business growth.', 'Customer Service', 1, '3:45 Hours', '0.00', TRUE, TRUE, TRUE, TRUE, TRUE, 'Beginner', '/attached_assets/generated_images/Customer_service_training_thumbnail_3803c939.png', '4.80', 1247, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (2, 'Advanced Customer Experience Management', 'Take your customer service skills to the next level. Learn advanced CX strategies, customer journey mapping, and how to implement service excellence programs.', 'Customer Service', 2, '5:20 Hours', '89.99', FALSE, TRUE, TRUE, TRUE, FALSE, 'Advanced', '/attached_assets/generated_images/Advanced_Customer_Experience_Course_0caa0cf1.png', '4.90', 432, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (3, 'Business Development Mastery', 'Comprehensive training on business growth strategies, market analysis, customer acquisition, and building sustainable revenue streams for East African markets.', 'Business Development', 3, '4:15 Hours', '129.99', FALSE, TRUE, TRUE, FALSE, TRUE, 'Intermediate', '/attached_assets/generated_images/Business_Development_Training_Course_7f058f5d.png', '4.70', 689, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (4, 'Leadership in Customer-Centric Organizations', 'Develop leadership skills specifically for customer service teams. Learn how to motivate staff, implement service standards, and create a customer-first culture.', 'Leadership', 4, '2:30 Hours', '79.99', FALSE, TRUE, TRUE, FALSE, FALSE, 'Intermediate', '/attached_assets/generated_images/Leadership_development_course_thumbnail_c51b9ce9.png', '4.60', 324, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (5, 'Effective Communication Skills', 'Master professional communication techniques for customer interactions, team collaboration, and conflict resolution in multicultural environments.', 'Communication', 1, '3:00 Hours', '0.00', TRUE, TRUE, TRUE, TRUE, FALSE, 'Beginner', '/attached_assets/generated_images/Communication_skills_course_thumbnail_88066040.png', '4.50', 987, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (6, 'Customer Retention Strategies', 'Learn proven techniques to retain customers, increase loyalty, and reduce churn. Focus on relationship building and value creation for long-term success.', 'Customer Service', 2, '2:45 Hours', '99.99', FALSE, TRUE, TRUE, FALSE, FALSE, 'Intermediate', '/attached_assets/generated_images/Customer_Retention_Strategy_Course_492098ce.png', '4.80', 156, '2025-08-28T12:11:02.344Z', '2025-08-28T12:11:02.344Z', FALSE, NULL),
  (11, 'Introduction to n8n', 'A beginner series into n8n ', 'technology', 1, NULL, '20.00', FALSE, FALSE, TRUE, FALSE, FALSE, 'Beginner', NULL, '0.00', 0, '2025-08-30T09:45:25.834Z', '2025-08-30T09:45:25.834Z', FALSE, NULL),
  (12, 'Introduction to prompt engineering ', 'Introduction to prompt engineering ', 'technology', 1, '2 hours', '19.81', FALSE, FALSE, TRUE, FALSE, FALSE, 'Beginner', '', '0.00', 0, '2025-08-30T12:33:04.783Z', '2025-08-30T12:33:04.783Z', FALSE, NULL),
  (14, 'Introduction To software engineering ', 'Introduction To software engineering ', 'technology', 3, '3', '0.00', TRUE, FALSE, TRUE, FALSE, FALSE, 'Beginner', '', '0.00', 0, '2025-09-07T15:07:52.509Z', '2025-09-07T15:11:21.383Z', TRUE, '2025-09-07T15:11:21.383Z');

ALTER TABLE "courses" ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");


-- Table: document_progress (0 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "document_progress" (
  "id" INTEGER NOT NULL DEFAULT nextval('document_progress_id_seq'::regclass),
  "user_id" CHARACTER VARYING,
  "lesson_id" INTEGER,
  "page" INTEGER NOT NULL,
  "viewed_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

ALTER TABLE "document_progress" ADD CONSTRAINT "document_progress_pkey" PRIMARY KEY ("id");


-- Table: enrollments (20 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "enrollments" (
  "id" INTEGER NOT NULL DEFAULT nextval('enrollments_id_seq'::regclass),
  "user_id" CHARACTER VARYING,
  "course_id" INTEGER,
  "enrolled_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "completed_at" TIMESTAMP WITHOUT TIME ZONE,
  "progress" INTEGER DEFAULT 0,
  "certificate_issued" BOOLEAN DEFAULT false
);

INSERT INTO "enrollments" ("id", "user_id", "course_id", "enrolled_at", "completed_at", "progress", "certificate_issued") VALUES
  (1, 'user_demo_001', 1, '2025-08-13T12:12:17.552Z', '2025-08-26T12:12:17.552Z', 100, TRUE),
  (2, 'user_demo_001', 5, '2025-08-18T12:12:17.552Z', NULL, 75, FALSE),
  (3, 'user_demo_002', 1, '2025-08-08T12:12:17.552Z', '2025-08-23T12:12:17.552Z', 100, TRUE),
  (4, 'user_demo_002', 2, '2025-08-20T12:12:17.552Z', NULL, 45, FALSE),
  (5, 'user_demo_003', 3, '2025-08-16T12:12:17.552Z', NULL, 60, FALSE),
  (6, 'user_demo_003', 5, '2025-08-10T12:12:17.552Z', '2025-08-25T12:12:17.552Z', 100, TRUE),
  (7, 'user_demo_004', 1, '2025-08-03T12:12:17.552Z', '2025-08-18T12:12:17.552Z', 100, TRUE),
  (8, 'user_demo_004', 6, '2025-08-22T12:12:17.552Z', NULL, 30, FALSE),
  (9, 'user_demo_005', 2, '2025-08-14T12:12:17.552Z', NULL, 80, FALSE),
  (10, 'user_demo_006', 4, '2025-08-19T12:12:17.552Z', NULL, 55, FALSE),
  (11, 'user_demo_007', 1, '2025-07-29T12:12:17.552Z', '2025-08-13T12:12:17.552Z', 100, TRUE),
  (12, 'user_demo_007', 3, '2025-08-23T12:12:17.552Z', NULL, 25, FALSE),
  (13, 'user_demo_008', 5, '2025-08-12T12:12:17.552Z', '2025-08-27T12:12:17.552Z', 100, TRUE),
  (14, '46204420', 1, '2025-08-28T12:21:29.884Z', NULL, 0, FALSE),
  (15, '45058292', 7, '2025-08-29T16:15:00.358Z', NULL, 0, FALSE),
  (16, '46204420', 9, '2025-08-29T16:20:21.569Z', NULL, 0, FALSE),
  (17, '46204420', 7, '2025-08-30T06:58:45.546Z', NULL, 0, FALSE),
  (18, '46204420', 3, '2025-08-30T07:01:03.176Z', NULL, 0, FALSE),
  (19, '45058292', 12, '2025-09-04T14:08:30.683Z', '2025-09-04T16:25:23.800Z', 100, TRUE),
  (21, '45058292', 14, '2025-09-07T15:11:52.330Z', NULL, 0, FALSE);

ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id");


-- Table: instructors (4 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "instructors" (
  "id" INTEGER NOT NULL DEFAULT nextval('instructors_id_seq'::regclass),
  "name" CHARACTER VARYING(255) NOT NULL,
  "bio" TEXT,
  "email" CHARACTER VARYING(255),
  "profile_image" CHARACTER VARYING,
  "expertise" ARRAY,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "user_id" CHARACTER VARYING
);

INSERT INTO "instructors" ("id", "name", "bio", "email", "profile_image", "expertise", "created_at", "user_id") VALUES
  (1, 'Sarah Mbeki', 'Senior Customer Experience Manager with over 10 years of experience in East African markets. Specializes in customer retention strategies and service excellence.', 'sarah.mbeki@eaccc.org', '/api/placeholder/150/150', '["Customer Experience","Service Excellence","Team Leadership"]', '2025-08-28T12:10:35.821Z', 'instructor_1'),
  (2, 'James Kariuki', 'Business Development Expert and former Regional Sales Director. Expert in growth strategies for East African businesses and customer acquisition.', 'james.kariuki@eaccc.org', '/api/placeholder/150/150', '["Business Development","Sales Strategy","Market Growth"]', '2025-08-28T12:10:35.821Z', 'instructor_2'),
  (3, 'Amina Hassan', 'Communication Skills Trainer and Leadership Coach. Focuses on cross-cultural communication and team management in diverse environments.', 'amina.hassan@eaccc.org', '/api/placeholder/150/150', '["Communication Skills","Leadership","Cross-Cultural Training"]', '2025-08-28T12:10:35.821Z', 'instructor_3'),
  (4, 'Michael Okonkwo', 'Digital Customer Service Specialist with expertise in modern customer support technologies and omnichannel experiences.', 'michael.okonkwo@eaccc.org', '/api/placeholder/150/150', '["Digital Customer Service","Technology Integration","Support Systems"]', '2025-08-28T12:10:35.821Z', 'instructor_4');

ALTER TABLE "instructors" ADD CONSTRAINT "instructors_pkey" PRIMARY KEY ("id");


-- Table: lesson_progress (40 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "lesson_progress" (
  "id" INTEGER NOT NULL DEFAULT nextval('lesson_progress_id_seq'::regclass),
  "user_id" CHARACTER VARYING,
  "lesson_id" INTEGER,
  "completed" BOOLEAN DEFAULT false,
  "completed_at" TIMESTAMP WITHOUT TIME ZONE,
  "current_page" INTEGER DEFAULT 1,
  "pages_viewed" TEXT
);

INSERT INTO "lesson_progress" ("id", "user_id", "lesson_id", "completed", "completed_at", "current_page", "pages_viewed") VALUES
  (1, 'user_demo_001', 1, TRUE, '2025-08-15T12:12:42.985Z', 1, NULL),
  (2, 'user_demo_001', 2, TRUE, '2025-08-16T12:12:42.985Z', 1, NULL),
  (3, 'user_demo_001', 3, TRUE, '2025-08-18T12:12:42.985Z', 1, NULL),
  (4, 'user_demo_001', 4, TRUE, '2025-08-20T12:12:42.985Z', 1, NULL),
  (5, 'user_demo_001', 5, TRUE, '2025-08-23T12:12:42.985Z', 1, NULL),
  (6, 'user_demo_001', 17, TRUE, '2025-08-20T12:12:42.985Z', 1, NULL),
  (7, 'user_demo_001', 18, TRUE, '2025-08-22T12:12:42.985Z', 1, NULL),
  (8, 'user_demo_001', 19, TRUE, '2025-08-24T12:12:42.985Z', 1, NULL),
  (9, 'user_demo_002', 1, TRUE, '2025-08-10T12:12:42.985Z', 1, NULL),
  (10, 'user_demo_002', 2, TRUE, '2025-08-12T12:12:42.985Z', 1, NULL),
  (11, 'user_demo_002', 3, TRUE, '2025-08-14T12:12:42.985Z', 1, NULL),
  (12, 'user_demo_002', 4, TRUE, '2025-08-16T12:12:42.985Z', 1, NULL),
  (13, 'user_demo_002', 5, TRUE, '2025-08-20T12:12:42.985Z', 1, NULL),
  (14, 'user_demo_002', 6, TRUE, '2025-08-22T12:12:42.985Z', 1, NULL),
  (15, 'user_demo_002', 7, TRUE, '2025-08-24T12:12:42.985Z', 1, NULL),
  (16, 'user_demo_003', 17, TRUE, '2025-08-12T12:12:42.985Z', 1, NULL),
  (17, 'user_demo_003', 18, TRUE, '2025-08-14T12:12:42.985Z', 1, NULL),
  (18, 'user_demo_003', 19, TRUE, '2025-08-18T12:12:42.985Z', 1, NULL),
  (19, 'user_demo_003', 20, TRUE, '2025-08-22T12:12:42.985Z', 1, NULL),
  (20, 'user_demo_004', 1, TRUE, '2025-08-05T12:12:42.985Z', 1, NULL),
  (21, 'user_demo_004', 2, TRUE, '2025-08-07T12:12:42.985Z', 1, NULL),
  (22, 'user_demo_004', 3, TRUE, '2025-08-10T12:12:42.985Z', 1, NULL),
  (23, 'user_demo_004', 4, TRUE, '2025-08-13T12:12:42.985Z', 1, NULL),
  (24, 'user_demo_004', 5, TRUE, '2025-08-16T12:12:42.985Z', 1, NULL),
  (25, 'user_demo_007', 1, TRUE, '2025-07-31T12:12:42.985Z', 1, NULL),
  (26, 'user_demo_007', 2, TRUE, '2025-08-03T12:12:42.985Z', 1, NULL),
  (27, 'user_demo_007', 3, TRUE, '2025-08-06T12:12:42.985Z', 1, NULL),
  (28, 'user_demo_007', 4, TRUE, '2025-08-09T12:12:42.985Z', 1, NULL),
  (29, 'user_demo_007', 5, TRUE, '2025-08-11T12:12:42.985Z', 1, NULL),
  (30, 'user_demo_008', 17, TRUE, '2025-08-14T12:12:42.985Z', 1, NULL),
  (31, 'user_demo_008', 18, TRUE, '2025-08-16T12:12:42.985Z', 1, NULL),
  (32, 'user_demo_008', 19, TRUE, '2025-08-20T12:12:42.985Z', 1, NULL),
  (33, 'user_demo_008', 20, TRUE, '2025-08-25T12:12:42.985Z', 1, NULL),
  (34, '46204420', 5, TRUE, '2025-08-29T12:06:49.254Z', 1, NULL),
  (35, '45058292', 135, TRUE, '2025-09-04T14:23:34.768Z', 1, NULL),
  (36, '45058292', 135, TRUE, '2025-09-04T14:30:12.525Z', 1, NULL),
  (37, '45058292', 132, TRUE, '2025-09-04T14:38:02.829Z', 1, NULL),
  (38, '45058292', 133, TRUE, '2025-09-04T14:38:19.059Z', 1, NULL),
  (39, '45058292', 134, TRUE, '2025-09-04T14:41:19.462Z', 1, NULL),
  (40, '45058292', 136, TRUE, '2025-09-04T16:25:23.007Z', 1, NULL);

ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id");


-- Table: lessons (129 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "lessons" (
  "id" INTEGER NOT NULL DEFAULT nextval('lessons_id_seq'::regclass),
  "course_id" INTEGER,
  "title" CHARACTER VARYING(255) NOT NULL,
  "description" TEXT,
  "content" TEXT,
  "video_url" CHARACTER VARYING,
  "duration" CHARACTER VARYING,
  "order_index" INTEGER NOT NULL,
  "is_locked" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "section_title" CHARACTER VARYING(255) DEFAULT 'Introduction'::character varying,
  "section_order" INTEGER DEFAULT 1,
  "topic_id" INTEGER,
  "is_preview" BOOLEAN DEFAULT false,
  "is_required" BOOLEAN DEFAULT true,
  "complete_on_video_end" BOOLEAN DEFAULT true,
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "content_type" CHARACTER VARYING(50) DEFAULT 'video'::character varying,
  "file_url" CHARACTER VARYING,
  "total_pages" INTEGER
);

INSERT INTO "lessons" ("id", "course_id", "title", "description", "content", "video_url", "duration", "order_index", "is_locked", "created_at", "section_title", "section_order", "topic_id", "is_preview", "is_required", "complete_on_video_end", "updated_at", "content_type", "file_url", "total_pages") VALUES
  (1, 1, 'Introduction to Customer Service Excellence', 'Welcome to the course! Learn what makes exceptional customer service and why it matters for business success.', 'Understanding the fundamentals of customer service and its impact on business growth.', 'https://example.com/video1', '15 minutes', 1, FALSE, '2025-08-28T12:11:23.041Z', 'Getting Started with Customer Service', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (2, 1, 'Understanding Customer Expectations', 'Dive deep into what customers really want and how to consistently exceed their expectations.', 'Exploring customer psychology and expectation management techniques.', 'https://example.com/video2', '22 minutes', 2, FALSE, '2025-08-28T12:11:23.041Z', 'Getting Started with Customer Service', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (3, 1, 'Active Listening and Communication', 'Master the art of active listening and effective communication with customers.', 'Practical techniques for better customer communication.', 'https://example.com/video3', '28 minutes', 3, FALSE, '2025-08-28T12:11:23.041Z', 'Getting Started with Customer Service', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (4, 1, 'Handling Difficult Customers', 'Learn proven strategies for dealing with challenging customer situations with professionalism.', 'De-escalation techniques and conflict resolution strategies.', 'https://example.com/video4', '35 minutes', 4, FALSE, '2025-08-28T12:11:23.041Z', 'Advanced Customer Service Techniques', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (5, 1, 'Building Customer Loyalty', 'Discover how to turn satisfied customers into loyal brand advocates.', 'Loyalty building techniques and retention strategies.', 'https://example.com/video5', '25 minutes', 5, FALSE, '2025-08-28T12:11:23.041Z', 'Advanced Customer Service Techniques', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (6, 2, 'Customer Journey Mapping', 'Learn how to map and optimize the complete customer journey.', 'Advanced techniques for understanding customer touchpoints.', 'https://example.com/video6', '40 minutes', 1, FALSE, '2025-08-28T12:11:23.041Z', 'Advanced Service Fundamentals', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (7, 2, 'CX Metrics and Analytics', 'Master customer experience measurement and data-driven improvements.', 'Key performance indicators for customer experience.', 'https://example.com/video7', '35 minutes', 2, FALSE, '2025-08-28T12:11:23.041Z', 'Advanced Service Fundamentals', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (8, 2, 'Service Recovery Excellence', 'Turn service failures into opportunities to strengthen customer relationships.', 'Advanced service recovery methodologies.', 'https://example.com/video8', '30 minutes', 3, FALSE, '2025-08-28T12:11:23.041Z', 'Customer Experience Design', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (9, 2, 'Cross-Channel Experience Design', 'Create seamless experiences across all customer touchpoints.', 'Omnichannel customer experience strategies.', 'https://example.com/video9', '45 minutes', 4, FALSE, '2025-08-28T12:11:23.041Z', 'Customer Experience Design', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (10, 3, 'Market Analysis and Opportunity Identification', 'Learn how to identify and evaluate business opportunities in your market.', 'Comprehensive market research and analysis techniques.', 'https://example.com/video10', '38 minutes', 1, FALSE, '2025-08-28T12:11:23.041Z', 'Business Development Basics', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (11, 3, 'Customer Acquisition Strategies', 'Master proven techniques for acquiring new customers cost-effectively.', 'Lead generation and customer acquisition methodologies.', 'https://example.com/video11', '42 minutes', 2, FALSE, '2025-08-28T12:11:23.041Z', 'Business Development Basics', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (12, 3, 'Partnership Development', 'Build strategic partnerships that drive mutual business growth.', 'Partnership strategy and relationship building.', 'https://example.com/video12', '33 minutes', 3, FALSE, '2025-08-28T12:11:23.041Z', 'Strategic Growth Planning', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (13, 3, 'Revenue Growth Planning', 'Develop sustainable revenue growth strategies for your business.', 'Financial planning and revenue optimization.', 'https://example.com/video13', '29 minutes', 4, FALSE, '2025-08-28T12:11:23.041Z', 'Strategic Growth Planning', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (14, 4, 'Leading Customer Service Teams', 'Learn how to effectively lead and motivate customer service teams.', 'Leadership principles for customer service environments.', 'https://example.com/video14', '32 minutes', 1, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (15, 4, 'Creating Service Standards', 'Develop and implement service standards that ensure consistent quality.', 'Service standard development and implementation.', 'https://example.com/video15', '28 minutes', 2, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (16, 4, 'Performance Management', 'Master performance management techniques for service teams.', 'Coaching and performance improvement strategies.', 'https://example.com/video16', '25 minutes', 3, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (17, 5, 'Professional Communication Fundamentals', 'Master the basics of professional communication in customer service.', 'Core communication principles and techniques.', 'https://example.com/video17', '24 minutes', 1, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (18, 5, 'Cross-Cultural Communication', 'Navigate communication challenges in diverse cultural environments.', 'Cultural sensitivity and adaptation in communication.', 'https://example.com/video18', '31 minutes', 2, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (19, 5, 'Conflict Resolution', 'Learn to resolve conflicts professionally and constructively.', 'Conflict resolution techniques and mediation skills.', 'https://example.com/video19', '27 minutes', 3, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (20, 5, 'Written Communication Excellence', 'Master professional written communication for emails and documentation.', 'Email etiquette and professional writing skills.', 'https://example.com/video20', '22 minutes', 4, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (21, 6, 'Understanding Customer Churn', 'Identify why customers leave and how to prevent it.', 'Customer churn analysis and prevention strategies.', 'https://example.com/video21', '35 minutes', 1, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (22, 6, 'Loyalty Program Design', 'Create effective loyalty programs that keep customers engaged.', 'Loyalty program development and management.', 'https://example.com/video22', '29 minutes', 2, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 1, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (23, 6, 'Relationship Building Techniques', 'Build strong, lasting relationships with your customers.', 'Relationship building and maintenance strategies.', 'https://example.com/video23', '26 minutes', 3, FALSE, '2025-08-28T12:11:39.142Z', 'Course Content', 2, NULL, FALSE, TRUE, TRUE, '2025-08-30T11:58:36.266Z', 'video', NULL, NULL),
  (33, 1, 'What is Customer Service Excellence?', 'Understand the foundational principles of customer service and why it matters for business success', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '12', 0, FALSE, '2025-09-04T14:14:03.602Z', 'Introduction', 1, 4, TRUE, TRUE, FALSE, '2025-09-04T14:14:03.602Z', 'video', NULL, NULL),
  (34, 1, 'Customer Service vs Customer Experience', 'Learn the key differences between customer service and customer experience', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '15', 1, FALSE, '2025-09-04T14:14:03.602Z', 'Introduction', 1, 4, FALSE, TRUE, FALSE, '2025-09-04T14:14:03.602Z', 'video', NULL, NULL),
  (35, 1, 'The EACCC Service Model', 'Introduction to the East African Customer Care Center service excellence framework', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 2, FALSE, '2025-09-04T14:14:03.602Z', 'Introduction', 1, 4, FALSE, TRUE, FALSE, '2025-09-04T14:14:03.602Z', 'video', NULL, NULL),
  (36, 1, 'Active Listening Techniques', 'Master the art of truly hearing your customers needs and concerns', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 0, FALSE, '2025-09-04T14:14:03.602Z', 'Introduction', 1, 5, FALSE, TRUE, FALSE, '2025-09-04T14:14:03.602Z', 'video', NULL, NULL),
  (37, 1, 'Verbal Communication Skills', 'Develop clear, professional, and empathetic verbal communication', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '16', 1, FALSE, '2025-09-04T14:14:03.602Z', 'Introduction', 1, 5, FALSE, TRUE, FALSE, '2025-09-04T14:14:03.602Z', 'video', NULL, NULL),
  (38, 1, 'Non-Verbal Communication', 'Understanding body language and tone in customer interactions', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '14', 2, FALSE, '2025-09-04T14:14:03.602Z', 'Introduction', 1, 5, FALSE, FALSE, FALSE, '2025-09-04T14:14:03.602Z', 'video', NULL, NULL),
  (39, 1, 'Identifying Customer Problems', 'Learn systematic approaches to understanding customer issues', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 0, FALSE, '2025-09-04T14:14:03.602Z', 'Introduction', 1, 6, FALSE, TRUE, FALSE, '2025-09-04T14:14:03.602Z', 'video', NULL, NULL),
  (40, 1, 'Creative Solution Techniques', 'Develop innovative problem-solving strategies for complex situations', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 1, FALSE, '2025-09-04T14:14:03.602Z', 'Introduction', 1, 6, FALSE, TRUE, FALSE, '2025-09-04T14:14:03.602Z', 'video', NULL, NULL),
  (41, 1, 'Follow-up and Resolution', 'Ensure customer satisfaction through proper follow-up procedures', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 2, FALSE, '2025-09-04T14:14:03.602Z', 'Introduction', 1, 6, FALSE, TRUE, FALSE, '2025-09-04T14:14:03.602Z', 'video', NULL, NULL),
  (42, 2, 'Understanding Customer Experience Strategy', 'Learn how to develop comprehensive CX strategies for your organization', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 0, FALSE, '2025-09-04T14:14:22.745Z', 'Introduction', 1, 7, TRUE, TRUE, FALSE, '2025-09-04T14:14:22.745Z', 'video', NULL, NULL),
  (43, 2, 'CX vs Traditional Service Models', 'Compare customer experience management to traditional service approaches', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 1, FALSE, '2025-09-04T14:14:22.745Z', 'Introduction', 1, 7, FALSE, TRUE, FALSE, '2025-09-04T14:14:22.745Z', 'video', NULL, NULL),
  (44, 2, 'Building CX Culture', 'Create an organization-wide customer experience mindset', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 2, FALSE, '2025-09-04T14:14:22.745Z', 'Introduction', 1, 7, FALSE, TRUE, FALSE, '2025-09-04T14:14:22.745Z', 'video', NULL, NULL),
  (45, 2, 'Customer Journey Fundamentals', 'Master the basics of mapping customer touchpoints and interactions', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 0, FALSE, '2025-09-04T14:14:22.745Z', 'Introduction', 1, 8, FALSE, TRUE, FALSE, '2025-09-04T14:14:22.745Z', 'video', NULL, NULL),
  (46, 2, 'Advanced Journey Mapping Techniques', 'Learn advanced methods for complex customer journey analysis', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '32', 1, FALSE, '2025-09-04T14:14:22.745Z', 'Introduction', 1, 8, FALSE, TRUE, FALSE, '2025-09-04T14:14:22.745Z', 'video', NULL, NULL),
  (47, 2, 'CX Metrics and Analytics', 'Track and measure customer experience success with KPIs', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '24', 2, FALSE, '2025-09-04T14:14:22.745Z', 'Introduction', 1, 8, FALSE, FALSE, FALSE, '2025-09-04T14:14:22.745Z', 'video', NULL, NULL),
  (48, 2, 'Service Design Principles', 'Learn systematic approaches to designing customer-centered services', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '30', 0, FALSE, '2025-09-04T14:14:22.745Z', 'Introduction', 1, 9, FALSE, TRUE, FALSE, '2025-09-04T14:14:22.745Z', 'video', NULL, NULL),
  (49, 2, 'Implementation Strategies', 'Develop practical implementation plans for CX improvements', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '26', 1, FALSE, '2025-09-04T14:14:22.745Z', 'Introduction', 1, 9, FALSE, TRUE, FALSE, '2025-09-04T14:14:22.745Z', 'video', NULL, NULL),
  (50, 2, 'Change Management for CX', 'Navigate organizational change when implementing new CX programs', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 2, FALSE, '2025-09-04T14:14:22.745Z', 'Introduction', 1, 9, FALSE, TRUE, FALSE, '2025-09-04T14:14:22.745Z', 'video', NULL, NULL),
  (51, 3, 'East African Market Landscape', 'Understanding business opportunities in East African markets', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '35', 0, FALSE, '2025-09-04T14:14:37.918Z', 'Introduction', 1, 10, TRUE, TRUE, FALSE, '2025-09-04T14:14:37.918Z', 'video', NULL, NULL),
  (52, 3, 'Competitive Analysis Techniques', 'Learn systematic approaches to analyzing competition and market gaps', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 1, FALSE, '2025-09-04T14:14:37.918Z', 'Introduction', 1, 10, FALSE, TRUE, FALSE, '2025-09-04T14:14:37.918Z', 'video', NULL, NULL),
  (53, 3, 'Market Research Methods', 'Practical market research techniques for business development', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '30', 2, FALSE, '2025-09-04T14:14:37.918Z', 'Introduction', 1, 10, FALSE, TRUE, FALSE, '2025-09-04T14:14:37.918Z', 'video', NULL, NULL),
  (54, 3, 'Customer Acquisition Fundamentals', 'Build effective strategies for acquiring new customers', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 0, FALSE, '2025-09-04T14:14:37.918Z', 'Introduction', 1, 11, FALSE, TRUE, FALSE, '2025-09-04T14:14:37.918Z', 'video', NULL, NULL),
  (55, 3, 'Digital Marketing for Customer Acquisition', 'Leverage digital channels for customer growth', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '32', 1, FALSE, '2025-09-04T14:14:37.918Z', 'Introduction', 1, 11, FALSE, TRUE, FALSE, '2025-09-04T14:14:37.918Z', 'video', NULL, NULL),
  (56, 3, 'Partnership & Referral Programs', 'Build strategic partnerships and referral systems', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 2, FALSE, '2025-09-04T14:14:37.918Z', 'Introduction', 1, 11, FALSE, FALSE, FALSE, '2025-09-04T14:14:37.918Z', 'video', NULL, NULL),
  (57, 3, 'Revenue Model Design', 'Create sustainable and scalable revenue models', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 0, FALSE, '2025-09-04T14:14:37.918Z', 'Introduction', 1, 12, FALSE, TRUE, FALSE, '2025-09-04T14:14:37.918Z', 'video', NULL, NULL),
  (58, 3, 'Financial Planning for Growth', 'Develop financial strategies that support business expansion', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '26', 1, FALSE, '2025-09-04T14:14:37.918Z', 'Introduction', 1, 12, FALSE, TRUE, FALSE, '2025-09-04T14:14:37.918Z', 'video', NULL, NULL),
  (59, 3, 'Scale and Sustainability', 'Build systems that support long-term business growth', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '24', 2, FALSE, '2025-09-04T14:14:37.918Z', 'Introduction', 1, 12, FALSE, TRUE, FALSE, '2025-09-04T14:14:37.918Z', 'video', NULL, NULL),
  (60, 4, 'What Makes a Customer-Centric Leader?', 'Essential qualities and mindset of customer-focused leaders', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 0, FALSE, '2025-09-04T14:14:51.790Z', 'Introduction', 1, 13, TRUE, TRUE, FALSE, '2025-09-04T14:14:51.790Z', 'video', NULL, NULL),
  (61, 4, 'Leadership vs Management in Customer Service', 'Understanding the distinction between leading and managing service teams', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 1, FALSE, '2025-09-04T14:14:51.790Z', 'Introduction', 1, 13, FALSE, TRUE, FALSE, '2025-09-04T14:14:51.790Z', 'video', NULL, NULL),
  (62, 4, 'Building Customer Empathy in Leadership', 'Develop authentic customer empathy as a leadership skill', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 2, FALSE, '2025-09-04T14:14:51.790Z', 'Introduction', 1, 13, FALSE, TRUE, FALSE, '2025-09-04T14:14:51.790Z', 'video', NULL, NULL),
  (63, 4, 'Building High-Performance Service Teams', 'Strategies for developing exceptional customer service teams', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 0, FALSE, '2025-09-04T14:14:51.790Z', 'Introduction', 1, 14, FALSE, TRUE, FALSE, '2025-09-04T14:14:51.790Z', 'video', NULL, NULL),
  (64, 4, 'Motivating Customer Service Staff', 'Effective motivation techniques for service professionals', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '24', 1, FALSE, '2025-09-04T14:14:51.790Z', 'Introduction', 1, 14, FALSE, TRUE, FALSE, '2025-09-04T14:14:51.790Z', 'video', NULL, NULL),
  (65, 4, 'Performance Management for Service Excellence', 'Create performance systems that drive customer satisfaction', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '26', 2, FALSE, '2025-09-04T14:14:51.790Z', 'Introduction', 1, 14, FALSE, FALSE, FALSE, '2025-09-04T14:14:51.790Z', 'video', NULL, NULL),
  (66, 4, 'Creating a Service-First Culture', 'Build organizational culture centered on customer service', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '30', 0, FALSE, '2025-09-04T14:14:51.790Z', 'Introduction', 1, 15, FALSE, TRUE, FALSE, '2025-09-04T14:14:51.790Z', 'video', NULL, NULL),
  (67, 4, 'Change Management for Service Transformation', 'Lead organizational change toward customer-centricity', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 1, FALSE, '2025-09-04T14:14:51.790Z', 'Introduction', 1, 15, FALSE, TRUE, FALSE, '2025-09-04T14:14:51.790Z', 'video', NULL, NULL),
  (68, 4, 'Sustaining Service Excellence', 'Maintain high service standards over time', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 2, FALSE, '2025-09-04T14:14:51.790Z', 'Introduction', 1, 15, FALSE, TRUE, FALSE, '2025-09-04T14:14:51.790Z', 'video', NULL, NULL),
  (69, 5, 'Foundations of Professional Communication', 'Core principles of effective workplace communication', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 0, FALSE, '2025-09-04T14:15:10.878Z', 'Introduction', 1, 16, TRUE, TRUE, FALSE, '2025-09-04T14:15:10.878Z', 'video', NULL, NULL),
  (70, 5, 'Written vs Verbal Communication', 'Understanding different communication channels and their effectiveness', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '15', 1, FALSE, '2025-09-04T14:15:10.878Z', 'Introduction', 1, 16, FALSE, TRUE, FALSE, '2025-09-04T14:15:10.878Z', 'video', NULL, NULL),
  (71, 5, 'Professional Email and Documentation', 'Master professional written communication standards', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 2, FALSE, '2025-09-04T14:15:10.878Z', 'Introduction', 1, 16, FALSE, TRUE, FALSE, '2025-09-04T14:15:10.878Z', 'video', NULL, NULL),
  (72, 5, 'Understanding Cultural Differences', 'Navigate cultural nuances in East African business environments', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 0, FALSE, '2025-09-04T14:15:10.878Z', 'Introduction', 1, 17, FALSE, TRUE, FALSE, '2025-09-04T14:15:10.878Z', 'video', NULL, NULL),
  (73, 5, 'Language and Communication Barriers', 'Overcome language challenges in multicultural settings', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 1, FALSE, '2025-09-04T14:15:10.878Z', 'Introduction', 1, 17, FALSE, TRUE, FALSE, '2025-09-04T14:15:10.878Z', 'video', NULL, NULL),
  (74, 5, 'Inclusive Communication Practices', 'Build inclusive communication that works across cultures', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 2, FALSE, '2025-09-04T14:15:10.878Z', 'Introduction', 1, 17, FALSE, FALSE, FALSE, '2025-09-04T14:15:10.878Z', 'video', NULL, NULL),
  (75, 5, 'Understanding Conflict in Customer Service', 'Identify types and sources of customer conflicts', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '24', 0, FALSE, '2025-09-04T14:15:10.878Z', 'Introduction', 1, 18, FALSE, TRUE, FALSE, '2025-09-04T14:15:10.878Z', 'video', NULL, NULL),
  (76, 5, 'De-escalation Techniques', 'Master practical techniques for calming difficult situations', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 1, FALSE, '2025-09-04T14:15:10.878Z', 'Introduction', 1, 18, FALSE, TRUE, FALSE, '2025-09-04T14:15:10.878Z', 'video', NULL, NULL),
  (77, 5, 'Resolution and Follow-up', 'Ensure lasting resolution and prevent repeat conflicts', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '16', 2, FALSE, '2025-09-04T14:15:10.878Z', 'Introduction', 1, 18, FALSE, TRUE, FALSE, '2025-09-04T14:15:10.878Z', 'video', NULL, NULL),
  (78, 6, 'Psychology of Customer Loyalty', 'Understand what drives customer loyalty and retention', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '26', 0, FALSE, '2025-09-04T14:15:23.833Z', 'Introduction', 1, 19, TRUE, TRUE, FALSE, '2025-09-04T14:15:23.833Z', 'video', NULL, NULL),
  (79, 6, 'Customer Lifetime Value', 'Calculate and optimize customer lifetime value', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 1, FALSE, '2025-09-04T14:15:23.833Z', 'Introduction', 1, 19, FALSE, TRUE, FALSE, '2025-09-04T14:15:23.833Z', 'video', NULL, NULL),
  (80, 6, 'Identifying At-Risk Customers', 'Recognize early warning signs of customer churn', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 2, FALSE, '2025-09-04T14:15:23.833Z', 'Introduction', 1, 19, FALSE, TRUE, FALSE, '2025-09-04T14:15:23.833Z', 'video', NULL, NULL),
  (81, 6, 'Designing Effective Retention Programs', 'Create comprehensive customer retention strategies', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '30', 0, FALSE, '2025-09-04T14:15:23.833Z', 'Introduction', 1, 20, FALSE, TRUE, FALSE, '2025-09-04T14:15:23.833Z', 'video', NULL, NULL),
  (82, 6, 'Loyalty Programs and Rewards', 'Develop reward systems that encourage repeat business', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '24', 1, FALSE, '2025-09-04T14:15:23.833Z', 'Introduction', 1, 20, FALSE, TRUE, FALSE, '2025-09-04T14:15:23.833Z', 'video', NULL, NULL),
  (83, 6, 'Personalization Strategies', 'Use personalization to increase customer retention', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 2, FALSE, '2025-09-04T14:15:23.833Z', 'Introduction', 1, 20, FALSE, FALSE, FALSE, '2025-09-04T14:15:23.833Z', 'video', NULL, NULL),
  (84, 6, 'Building Emotional Connections', 'Create deep emotional bonds with customers', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 0, FALSE, '2025-09-04T14:15:23.833Z', 'Introduction', 1, 21, FALSE, TRUE, FALSE, '2025-09-04T14:15:23.833Z', 'video', NULL, NULL),
  (85, 6, 'Regular Customer Check-ins', 'Maintain ongoing relationships through systematic follow-up', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '16', 1, FALSE, '2025-09-04T14:15:23.833Z', 'Introduction', 1, 21, FALSE, TRUE, FALSE, '2025-09-04T14:15:23.833Z', 'video', NULL, NULL),
  (86, 6, 'Value Creation for Long-term Success', 'Continuously deliver value to retain customers', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 2, FALSE, '2025-09-04T14:15:23.833Z', 'Introduction', 1, 21, FALSE, TRUE, FALSE, '2025-09-04T14:15:23.833Z', 'video', NULL, NULL),
  (87, 7, 'Modern Digital Support Landscape', 'Overview of digital customer support channels and trends', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 0, FALSE, '2025-09-04T14:15:32.566Z', 'Introduction', 1, 22, TRUE, TRUE, FALSE, '2025-09-04T14:15:32.566Z', 'video', NULL, NULL),
  (88, 7, 'Social Media Customer Support', 'Provide excellent customer service through social media platforms', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '24', 1, FALSE, '2025-09-04T14:15:32.566Z', 'Introduction', 1, 22, FALSE, TRUE, FALSE, '2025-09-04T14:15:32.566Z', 'video', NULL, NULL),
  (89, 7, 'Live Chat and Messaging Support', 'Master real-time chat support and messaging platforms', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 2, FALSE, '2025-09-04T14:15:32.566Z', 'Introduction', 1, 22, FALSE, TRUE, FALSE, '2025-09-04T14:15:32.566Z', 'video', NULL, NULL),
  (90, 7, 'Understanding Omnichannel Support', 'Create seamless experiences across all customer touchpoints', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 0, FALSE, '2025-09-04T14:15:32.566Z', 'Introduction', 1, 23, FALSE, TRUE, FALSE, '2025-09-04T14:15:32.566Z', 'video', NULL, NULL),
  (91, 7, 'Channel Integration Strategies', 'Connect different support channels for unified experience', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '26', 1, FALSE, '2025-09-04T14:15:32.566Z', 'Introduction', 1, 23, FALSE, TRUE, FALSE, '2025-09-04T14:15:32.566Z', 'video', NULL, NULL),
  (92, 7, 'Customer Data and Context Sharing', 'Maintain customer context across all support interactions', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 2, FALSE, '2025-09-04T14:15:32.566Z', 'Introduction', 1, 23, FALSE, FALSE, FALSE, '2025-09-04T14:15:32.566Z', 'video', NULL, NULL),
  (93, 7, 'Chatbots and AI in Customer Support', 'Implement and manage automated support solutions', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '32', 0, FALSE, '2025-09-04T14:15:32.566Z', 'Introduction', 1, 24, FALSE, TRUE, FALSE, '2025-09-04T14:15:32.566Z', 'video', NULL, NULL),
  (94, 7, 'Help Desk and Ticketing Systems', 'Optimize support workflows with modern ticketing systems', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 1, FALSE, '2025-09-04T14:15:32.566Z', 'Introduction', 1, 24, FALSE, TRUE, FALSE, '2025-09-04T14:15:32.566Z', 'video', NULL, NULL),
  (95, 7, 'Support Analytics and Reporting', 'Use data analytics to improve digital support performance', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 2, FALSE, '2025-09-04T14:15:32.566Z', 'Introduction', 1, 24, FALSE, TRUE, FALSE, '2025-09-04T14:15:32.566Z', 'video', NULL, NULL),
  (96, 8, 'Introduction to Customer Service', 'Essential concepts for customer service newcomers', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '15', 0, FALSE, '2025-09-04T14:15:50.469Z', 'Introduction', 1, 25, TRUE, TRUE, FALSE, '2025-09-04T14:15:50.469Z', 'video', NULL, NULL),
  (97, 8, 'The Customer Service Mindset', 'Develop the right attitude and approach for serving customers', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '12', 1, FALSE, '2025-09-04T14:15:50.469Z', 'Introduction', 1, 25, FALSE, TRUE, FALSE, '2025-09-04T14:15:50.469Z', 'video', NULL, NULL),
  (98, 8, 'First Impressions Matter', 'Create positive first impressions in every customer interaction', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '14', 2, FALSE, '2025-09-04T14:15:50.469Z', 'Introduction', 1, 25, FALSE, TRUE, FALSE, '2025-09-04T14:15:50.469Z', 'video', NULL, NULL),
  (99, 8, 'Empathy and Understanding', 'Develop genuine empathy for customer needs and concerns', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 0, FALSE, '2025-09-04T14:15:50.469Z', 'Introduction', 1, 26, FALSE, TRUE, FALSE, '2025-09-04T14:15:50.469Z', 'video', NULL, NULL),
  (100, 8, 'Patience and Emotional Control', 'Maintain composure and patience in challenging situations', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '16', 1, FALSE, '2025-09-04T14:15:50.469Z', 'Introduction', 1, 26, FALSE, TRUE, FALSE, '2025-09-04T14:15:50.469Z', 'video', NULL, NULL),
  (101, 8, 'Basic Problem-Solving Skills', 'Learn fundamental approaches to solving customer problems', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 2, FALSE, '2025-09-04T14:15:50.469Z', 'Introduction', 1, 26, FALSE, FALSE, FALSE, '2025-09-04T14:15:50.469Z', 'video', NULL, NULL),
  (102, 8, 'Professional Appearance and Behavior', 'Maintain professional standards in customer-facing roles', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '13', 0, FALSE, '2025-09-04T14:15:50.469Z', 'Introduction', 1, 27, FALSE, TRUE, FALSE, '2025-09-04T14:15:50.469Z', 'video', NULL, NULL),
  (103, 8, 'Time Management in Customer Service', 'Balance efficiency with quality in customer interactions', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '17', 1, FALSE, '2025-09-04T14:15:50.469Z', 'Introduction', 1, 27, FALSE, TRUE, FALSE, '2025-09-04T14:15:50.469Z', 'video', NULL, NULL),
  (104, 8, 'Continuous Learning and Growth', 'Commit to ongoing improvement in customer service skills', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '15', 2, FALSE, '2025-09-04T14:15:50.469Z', 'Introduction', 1, 27, FALSE, TRUE, FALSE, '2025-09-04T14:15:50.469Z', 'video', NULL, NULL),
  (105, 9, 'Customer Experience Design Principles', 'Learn the core principles of designing exceptional customer experiences', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 0, FALSE, '2025-09-04T14:16:06.488Z', 'Introduction', 1, 28, TRUE, TRUE, FALSE, '2025-09-04T14:16:06.488Z', 'video', NULL, NULL),
  (106, 9, 'From Service to Experience', 'Transform traditional service delivery into memorable experiences', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 1, FALSE, '2025-09-04T14:16:06.488Z', 'Introduction', 1, 28, FALSE, TRUE, FALSE, '2025-09-04T14:16:06.488Z', 'video', NULL, NULL),
  (107, 9, 'Design Thinking for Customer Experience', 'Apply design thinking methodologies to customer experience challenges', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 2, FALSE, '2025-09-04T14:16:06.488Z', 'Introduction', 1, 28, FALSE, TRUE, FALSE, '2025-09-04T14:16:06.488Z', 'video', NULL, NULL),
  (108, 9, 'Understanding Customer Needs', 'Research methods to deeply understand your customers', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '24', 0, FALSE, '2025-09-04T14:16:06.488Z', 'Introduction', 1, 29, FALSE, TRUE, FALSE, '2025-09-04T14:16:06.488Z', 'video', NULL, NULL),
  (109, 9, 'Customer Persona Development', 'Create detailed customer personas for targeted experience design', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 1, FALSE, '2025-09-04T14:16:06.488Z', 'Introduction', 1, 29, FALSE, TRUE, FALSE, '2025-09-04T14:16:06.488Z', 'video', NULL, NULL);

INSERT INTO "lessons" ("id", "course_id", "title", "description", "content", "video_url", "duration", "order_index", "is_locked", "created_at", "section_title", "section_order", "topic_id", "is_preview", "is_required", "complete_on_video_end", "updated_at", "content_type", "file_url", "total_pages") VALUES
  (110, 9, 'Feedback Systems and Analysis', 'Build systems to collect and analyze customer feedback effectively', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 2, FALSE, '2025-09-04T14:16:06.488Z', 'Introduction', 1, 29, FALSE, FALSE, FALSE, '2025-09-04T14:16:06.488Z', 'video', NULL, NULL),
  (111, 9, 'Service Blueprint Creation', 'Design comprehensive service blueprints for consistent delivery', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 0, FALSE, '2025-09-04T14:16:06.488Z', 'Introduction', 1, 30, FALSE, TRUE, FALSE, '2025-09-04T14:16:06.488Z', 'video', NULL, NULL),
  (112, 9, 'Touchpoint Optimization', 'Optimize each customer touchpoint for maximum impact', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 1, FALSE, '2025-09-04T14:16:06.488Z', 'Introduction', 1, 30, FALSE, TRUE, FALSE, '2025-09-04T14:16:06.488Z', 'video', NULL, NULL),
  (113, 9, 'Testing and Iteration', 'Test experience designs and iterate for continuous improvement', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 2, FALSE, '2025-09-04T14:16:06.488Z', 'Introduction', 1, 30, FALSE, TRUE, FALSE, '2025-09-04T14:16:06.488Z', 'video', NULL, NULL),
  (114, 10, 'SME Business Strategy Fundamentals', 'Strategic thinking specifically tailored for small and medium enterprises', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '30', 0, FALSE, '2025-09-04T14:16:14.247Z', 'Introduction', 1, 31, TRUE, TRUE, FALSE, '2025-09-04T14:16:14.247Z', 'video', NULL, NULL),
  (115, 10, 'Competitive Advantage for SMEs', 'Identify and leverage competitive advantages in crowded markets', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '26', 1, FALSE, '2025-09-04T14:16:14.247Z', 'Introduction', 1, 31, FALSE, TRUE, FALSE, '2025-09-04T14:16:14.247Z', 'video', NULL, NULL),
  (116, 10, 'Resource Optimization Strategies', 'Maximize limited resources for maximum business impact', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 2, FALSE, '2025-09-04T14:16:14.247Z', 'Introduction', 1, 31, FALSE, TRUE, FALSE, '2025-09-04T14:16:14.247Z', 'video', NULL, NULL),
  (117, 10, 'Strategic Partnership Development', 'Build strategic partnerships that accelerate business growth', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 0, FALSE, '2025-09-04T14:16:14.247Z', 'Introduction', 1, 32, FALSE, TRUE, FALSE, '2025-09-04T14:16:14.247Z', 'video', NULL, NULL),
  (118, 10, 'Network Building for Business Growth', 'Create powerful business networks in East African markets', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '24', 1, FALSE, '2025-09-04T14:16:14.247Z', 'Introduction', 1, 32, FALSE, TRUE, FALSE, '2025-09-04T14:16:14.247Z', 'video', NULL, NULL),
  (119, 10, 'Supplier and Vendor Relations', 'Optimize supplier relationships for competitive advantage', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 2, FALSE, '2025-09-04T14:16:14.247Z', 'Introduction', 1, 32, FALSE, FALSE, FALSE, '2025-09-04T14:16:14.247Z', 'video', NULL, NULL),
  (120, 10, 'Scaling Operations Effectively', 'Scale business operations without losing quality or culture', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '32', 0, FALSE, '2025-09-04T14:16:14.247Z', 'Introduction', 1, 33, FALSE, TRUE, FALSE, '2025-09-04T14:16:14.247Z', 'video', NULL, NULL),
  (121, 10, 'Financial Management for Growth', 'Manage finances during periods of rapid business growth', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 1, FALSE, '2025-09-04T14:16:14.247Z', 'Introduction', 1, 33, FALSE, TRUE, FALSE, '2025-09-04T14:16:14.247Z', 'video', NULL, NULL),
  (122, 10, 'Leadership During Scale', 'Lead effectively as your business grows and evolves', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 2, FALSE, '2025-09-04T14:16:14.247Z', 'Introduction', 1, 33, FALSE, TRUE, FALSE, '2025-09-04T14:16:14.247Z', 'video', NULL, NULL),
  (123, 11, 'What is n8n and Why Use It?', 'Introduction to n8n automation platform and its business applications', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '15', 0, FALSE, '2025-09-04T14:16:27.359Z', 'Introduction', 1, 34, TRUE, TRUE, FALSE, '2025-09-04T14:16:27.359Z', 'video', NULL, NULL),
  (124, 11, 'n8n Interface and Navigation', 'Navigate the n8n platform interface and understand key components', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18', 1, FALSE, '2025-09-04T14:16:27.359Z', 'Introduction', 1, 34, FALSE, TRUE, FALSE, '2025-09-04T14:16:27.359Z', 'video', NULL, NULL),
  (125, 11, 'Setting Up Your First n8n Environment', 'Install and configure n8n for your business automation needs', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '22', 2, FALSE, '2025-09-04T14:16:27.359Z', 'Introduction', 1, 34, FALSE, TRUE, FALSE, '2025-09-04T14:16:27.359Z', 'video', NULL, NULL),
  (126, 11, 'Creating Your First Workflow', 'Build a simple automation workflow from start to finish', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '25', 0, FALSE, '2025-09-04T14:16:27.359Z', 'Introduction', 1, 35, FALSE, TRUE, FALSE, '2025-09-04T14:16:27.359Z', 'video', NULL, NULL),
  (127, 11, 'Working with Nodes and Connections', 'Understand nodes, connections, and data flow in n8n workflows', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '20', 1, FALSE, '2025-09-04T14:16:27.359Z', 'Introduction', 1, 35, FALSE, TRUE, FALSE, '2025-09-04T14:16:27.359Z', 'video', NULL, NULL),
  (128, 11, 'Testing and Debugging Workflows', 'Debug and troubleshoot workflow issues effectively', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '16', 2, FALSE, '2025-09-04T14:16:27.359Z', 'Introduction', 1, 35, FALSE, FALSE, FALSE, '2025-09-04T14:16:27.359Z', 'video', NULL, NULL),
  (129, 11, 'Complex Workflow Design', 'Design sophisticated workflows for complex business processes', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '30', 0, FALSE, '2025-09-04T14:16:27.359Z', 'Introduction', 1, 36, FALSE, TRUE, FALSE, '2025-09-04T14:16:27.359Z', 'video', NULL, NULL),
  (130, 11, 'Integration with Business Tools', 'Connect n8n with popular business applications and services', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '28', 1, FALSE, '2025-09-04T14:16:27.359Z', 'Introduction', 1, 36, FALSE, TRUE, FALSE, '2025-09-04T14:16:27.359Z', 'video', NULL, NULL),
  (131, 11, 'Workflow Optimization and Best Practices', 'Optimize workflows for performance and maintainability', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', '24', 2, FALSE, '2025-09-04T14:16:27.359Z', 'Introduction', 1, 36, FALSE, TRUE, FALSE, '2025-09-04T14:16:27.359Z', 'video', NULL, NULL),
  (132, 12, 'Introduction to Prompt Engineering', 'Understand the fundamentals of prompt engineering and its applications', NULL, 'https://www.youtube.com/embed/_ZvnD73m40o', '20', 0, FALSE, '2025-09-04T14:16:39.324Z', 'Introduction', 1, 2, TRUE, TRUE, FALSE, '2025-09-04T15:51:21.754Z', 'video', NULL, NULL),
  (133, 12, 'Anatomy of an Effective Prompt', 'Learn the key components that make prompts clear, specific, and effective', NULL, 'https://www.youtube.com/embed/_ZvnD73m40o', '18', 1, FALSE, '2025-09-04T14:16:39.324Z', 'Introduction', 1, 2, FALSE, TRUE, FALSE, '2025-09-04T15:51:21.754Z', 'video', NULL, NULL),
  (134, 12, 'Prompt Templates and Patterns', 'Discover reusable prompt templates for common use cases', NULL, 'https://www.youtube.com/embed/_ZvnD73m40o', '22', 2, FALSE, '2025-09-04T14:16:39.324Z', 'Introduction', 1, 2, FALSE, TRUE, FALSE, '2025-09-04T15:51:21.754Z', 'video', NULL, NULL),
  (135, 12, 'Context and Role-Based Prompting', 'Master techniques for providing context and defining roles in prompts', NULL, 'https://www.youtube.com/embed/_ZvnD73m40o', '25', 3, FALSE, '2025-09-04T14:16:39.324Z', 'Introduction', 1, 2, FALSE, TRUE, FALSE, '2025-09-04T15:51:21.754Z', 'video', NULL, NULL),
  (136, 12, 'Chain-of-Thought Prompting', 'Learn advanced techniques for getting step-by-step reasoning from AI', NULL, 'https://www.youtube.com/embed/_ZvnD73m40o', '24', 4, FALSE, '2025-09-04T14:16:39.324Z', 'Introduction', 1, 2, FALSE, TRUE, FALSE, '2025-09-04T15:51:21.754Z', 'video', NULL, NULL),
  (137, 12, 'Prompt Optimization and Testing', 'Test, refine, and optimize prompts for better results', NULL, 'https://www.youtube.com/embed/_ZvnD73m40o', '20', 5, FALSE, '2025-09-04T14:16:39.324Z', 'Introduction', 1, 2, FALSE, FALSE, FALSE, '2025-09-04T15:51:21.754Z', 'video', NULL, NULL),
  (141, 14, 'What we''ll learn', 'What we''ll learn in this course', NULL, '', '20', 0, FALSE, '2025-09-07T15:11:10.859Z', 'Introduction', 1, 39, FALSE, FALSE, FALSE, '2025-09-07T15:11:10.859Z', 'pdf', 'https://storage.googleapis.com/replit-objstore-b5f6086f-b972-44ca-9788-29ac5d35868e/uploads/1757257845291-9iaexu', 1);

ALTER TABLE "lessons" ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");


-- Table: orders (24 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "orders" (
  "id" INTEGER NOT NULL DEFAULT nextval('orders_id_seq'::regclass),
  "user_id" CHARACTER VARYING,
  "course_id" INTEGER,
  "amount" NUMERIC(10,2) NOT NULL,
  "currency" CHARACTER VARYING(3) DEFAULT 'USD'::character varying,
  "status" CHARACTER VARYING(20) DEFAULT 'pending'::character varying,
  "paystack_reference" CHARACTER VARYING,
  "paystack_access_code" CHARACTER VARYING,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

INSERT INTO "orders" ("id", "user_id", "course_id", "amount", "currency", "status", "paystack_reference", "paystack_access_code", "created_at", "updated_at") VALUES
  (1, '46204420', 2, '89.99', 'USD', 'pending', 'eaccc_1756391918407_2_46204420', NULL, '2025-08-28T14:38:38.460Z', '2025-08-28T14:38:38.460Z'),
  (2, '46204420', 2, '89.99', 'USD', 'pending', 'eaccc_1756392067855_2_46204420', NULL, '2025-08-28T14:41:07.907Z', '2025-08-28T14:41:07.907Z'),
  (3, '46204420', 2, '89.99', 'USD', 'failed', 'eaccc_1756392575227_2_46204420', NULL, '2025-08-28T14:49:35.279Z', '2025-08-28T14:49:35.962Z'),
  (4, '46204420', 2, '89.99', 'USD', 'failed', 'eaccc_1756392592625_2_46204420', NULL, '2025-08-28T14:49:52.678Z', '2025-08-28T14:49:53.367Z'),
  (5, '46204420', 2, '89.99', 'USD', 'pending', '1wo5rewb4lt0227', NULL, '2025-08-28T14:54:02.813Z', '2025-08-28T14:54:03.656Z'),
  (6, '46204420', 2, '89.99', 'USD', 'pending', 'qtmc7rdfxie0wm4', NULL, '2025-08-28T14:56:47.419Z', '2025-08-28T14:56:48.172Z'),
  (7, '46204420', 2, '89.99', 'USD', 'pending', '1kzhwf43e8zul8g', NULL, '2025-08-28T14:58:59.483Z', '2025-08-28T14:59:00.373Z'),
  (8, '46204420', 9, '69.99', 'USD', 'failed', 'eaccc_1756473284953_9_46204420', NULL, '2025-08-29T13:14:45.005Z', '2025-08-29T13:14:47.091Z'),
  (9, '46204420', 9, '69.99', 'USD', 'pending', 'b8pb4bh8hyilw9r', NULL, '2025-08-29T13:16:31.487Z', '2025-08-29T13:16:32.229Z'),
  (10, '46204420', 9, '69.99', 'USD', 'pending', '4s16rnfhrt4ctu5', NULL, '2025-08-29T13:18:28.782Z', '2025-08-29T13:18:29.467Z'),
  (11, '45058292', 9, '69.99', 'USD', 'pending', 'epl6nbzgqp2x69n', NULL, '2025-08-29T13:32:41.106Z', '2025-08-29T13:32:41.937Z'),
  (12, '45058292', 7, '109.99', 'USD', 'pending', 'g78k6w24i53fw2b', NULL, '2025-08-29T15:42:11.210Z', '2025-08-29T15:42:11.975Z'),
  (13, '45058292', 7, '109.99', 'USD', 'pending', '5slhwz8w72ehvlt', NULL, '2025-08-29T15:45:09.974Z', '2025-08-29T15:45:10.742Z'),
  (14, '45058292', 7, '109.99', 'USD', 'pending', 'jwr257rnpx40cjh', NULL, '2025-08-29T15:49:40.582Z', '2025-08-29T15:49:41.045Z'),
  (15, '45058292', 7, '109.99', 'USD', 'pending', 'oiyf6oi314xdpqw', NULL, '2025-08-29T15:54:07.980Z', '2025-08-29T15:54:08.724Z'),
  (16, '45058292', 7, '109.99', 'USD', 'pending', '5vlsx6q2ge73zg5', NULL, '2025-08-29T15:55:47.045Z', '2025-08-29T15:55:47.733Z'),
  (17, '45058292', 9, '69.99', 'USD', 'pending', '2vjdo7fhmtwz6u2', NULL, '2025-08-29T15:59:23.593Z', '2025-08-29T15:59:24.299Z'),
  (18, '45058292', 7, '109.99', 'USD', 'pending', 'qzcgjtw5mqeaj4f', NULL, '2025-08-29T16:01:37.259Z', '2025-08-29T16:01:38.006Z'),
  (19, '45058292', 7, '109.99', 'USD', 'pending', '3zlzot9ab3z8mlt', NULL, '2025-08-29T16:07:39.405Z', '2025-08-29T16:07:39.974Z'),
  (20, '45058292', 7, '109.99', 'USD', 'completed', 'eaccc_1756483978365_7_45058292', 'kxfkxusicnv6vqs', '2025-08-29T16:12:58.419Z', '2025-08-29T16:15:00.090Z'),
  (21, '46204420', 9, '69.99', 'USD', 'completed', 'eaccc_1756484397780_9_46204420', 't3i1tq7byjyiotl', '2025-08-29T16:19:57.831Z', '2025-08-29T16:20:21.308Z'),
  (22, '46204420', 7, '109.99', 'USD', 'completed', 'eaccc_1756537094293_7_46204420', '341r0mmnqsth7yw', '2025-08-30T06:58:14.336Z', '2025-08-30T06:58:45.302Z'),
  (23, '46204420', 3, '129.99', 'USD', 'completed', 'eaccc_1756537242859_3_46204420', '96kojr6vm13db3c', '2025-08-30T07:00:42.905Z', '2025-08-30T07:01:02.930Z'),
  (24, '45058292', 12, '19.81', 'USD', 'completed', 'eaccc_1756994883464_12_45058292', '5c3alg9b8dugxaa', '2025-09-04T14:08:03.518Z', '2025-09-04T14:08:30.425Z');

ALTER TABLE "orders" ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");


-- Table: reviews (7 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "reviews" (
  "id" INTEGER NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
  "user_id" CHARACTER VARYING,
  "course_id" INTEGER,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

INSERT INTO "reviews" ("id", "user_id", "course_id", "rating", "comment", "created_at") VALUES
  (1, 'user_demo_001', 1, 5, 'Excellent course! The instructor explains concepts clearly and provides practical examples that I can apply in my daily work. Highly recommended for anyone in customer service.', '2025-08-27T12:12:26.026Z'),
  (2, 'user_demo_002', 1, 5, 'This course transformed how I approach customer interactions. The section on handling difficult customers was particularly valuable.', '2025-08-24T12:12:26.026Z'),
  (3, 'user_demo_003', 5, 4, 'Great content on communication skills. The cross-cultural communication module was very insightful. Would love to see more real-world case studies.', '2025-08-26T12:12:26.026Z'),
  (4, 'user_demo_004', 1, 5, 'Perfect introduction to customer service excellence. The course structure is logical and easy to follow. Learned so much!', '2025-08-19T12:12:26.026Z'),
  (5, 'user_demo_005', 2, 4, 'Advanced techniques that really work. The CX metrics section helped me implement better measurement systems at my company.', '2025-08-22T12:12:26.026Z'),
  (6, 'user_demo_007', 1, 5, 'Outstanding quality content. The instructor''s experience really shows. This course should be mandatory for all customer service professionals.', '2025-08-14T12:12:26.026Z'),
  (7, 'user_demo_008', 5, 4, 'Solid communication skills training. The conflict resolution techniques have already helped me in several situations.', '2025-08-28T00:12:26.026Z');

ALTER TABLE "reviews" ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");


-- Table: sessions (2 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" CHARACTER VARYING NOT NULL,
  "sess" JSONB NOT NULL,
  "expire" TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

INSERT INTO "sessions" ("sid", "sess", "expire") VALUES
  ('SFi-pqcpiWKebMvaQ_4GCi2TMZANqbAM', '{"cookie":{"path":"/","secure":true,"expires":"2025-09-11T14:13:17.242Z","httpOnly":true,"originalMaxAge":604800000},"adminAuth":{"role":"admin","isAdmin":true,"username":"admin@eaccc.com","loginTime":"2025-09-04T14:13:17.241Z"}}', '2025-09-11T14:13:18.000Z'),
  ('BgJD5-Mh6N0LthljEhz9tubQVhgCvV3T', '{"cookie":{"path":"/","secure":true,"expires":"2025-09-17T05:40:05.663Z","httpOnly":true,"originalMaxAge":604800000},"passport":{"user":{"claims":{"aud":"da313616-898a-4afb-912c-2f3514e21671","exp":1757486405,"iat":1757482805,"iss":"https://replit.com/oidc","sub":"45058292","email":"modernmindsgroup@gmail.com","at_hash":"yzDwjoVcZ4Iohr64T3O7Vg","username":"modernmindsgrou","auth_time":1757243852,"last_name":"Minds","first_name":"Modern"},"expires_at":1757486405,"access_token":"ApU4Nr9ltqKXJaOunKgrcaAK6FoZKKY3UVbiyhgGFy-","refresh_token":"q4HFudaYaVXk7Y_bSwrnI2SQzJRAph6kBHBFB86uOOh"}},"adminAuth":{"role":"admin","isAdmin":true,"username":"admin@eaccc.com","loginTime":"2025-09-07T11:41:41.830Z"}}', '2025-09-17T05:40:07.000Z');

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid");


-- Table: topics (35 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "topics" (
  "id" INTEGER NOT NULL DEFAULT nextval('topics_id_seq'::regclass),
  "course_id" INTEGER,
  "title" CHARACTER VARYING(255) NOT NULL,
  "order_index" INTEGER NOT NULL,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

INSERT INTO "topics" ("id", "course_id", "title", "order_index", "created_at", "updated_at") VALUES
  (2, 12, 'Generating relevant prompts', 0, '2025-08-30T12:43:20.996Z', '2025-08-30T12:43:20.996Z'),
  (4, 1, 'Fundamentals of Customer Service', 0, '2025-09-04T14:13:43.322Z', '2025-09-04T14:13:43.322Z'),
  (5, 1, 'Communication Excellence', 1, '2025-09-04T14:13:43.322Z', '2025-09-04T14:13:43.322Z'),
  (6, 1, 'Problem Solving Strategies', 2, '2025-09-04T14:13:43.322Z', '2025-09-04T14:13:43.322Z'),
  (7, 2, 'Customer Experience Strategy', 0, '2025-09-04T14:14:15.392Z', '2025-09-04T14:14:15.392Z'),
  (8, 2, 'Journey Mapping & Analytics', 1, '2025-09-04T14:14:15.392Z', '2025-09-04T14:14:15.392Z'),
  (9, 2, 'Service Design & Implementation', 2, '2025-09-04T14:14:15.392Z', '2025-09-04T14:14:15.392Z'),
  (10, 3, 'Market Analysis & Opportunity Identification', 0, '2025-09-04T14:14:30.749Z', '2025-09-04T14:14:30.749Z'),
  (11, 3, 'Customer Acquisition Strategies', 1, '2025-09-04T14:14:30.749Z', '2025-09-04T14:14:30.749Z'),
  (12, 3, 'Revenue Growth & Sustainability', 2, '2025-09-04T14:14:30.749Z', '2025-09-04T14:14:30.749Z'),
  (13, 4, 'Customer-Centric Leadership Principles', 0, '2025-09-04T14:14:30.749Z', '2025-09-04T14:14:30.749Z'),
  (14, 4, 'Team Development & Motivation', 1, '2025-09-04T14:14:30.749Z', '2025-09-04T14:14:30.749Z'),
  (15, 4, 'Service Culture Implementation', 2, '2025-09-04T14:14:30.749Z', '2025-09-04T14:14:30.749Z'),
  (16, 5, 'Professional Communication Fundamentals', 0, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (17, 5, 'Multicultural Communication', 1, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (18, 5, 'Conflict Resolution & De-escalation', 2, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (19, 6, 'Understanding Customer Loyalty', 0, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (20, 6, 'Retention Program Design', 1, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (21, 6, 'Relationship Building Techniques', 2, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (22, 7, 'Digital Support Channels', 0, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (23, 7, 'Omnichannel Customer Experience', 1, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (24, 7, 'Technology & Automation', 2, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (25, 8, 'Customer Service Foundations', 0, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (26, 8, 'Essential Soft Skills', 1, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (27, 8, 'Professional Practices', 2, '2025-09-04T14:15:03.393Z', '2025-09-04T14:15:03.393Z'),
  (28, 9, 'Experience Design Fundamentals', 0, '2025-09-04T14:15:53.588Z', '2025-09-04T14:15:53.588Z'),
  (29, 9, 'Customer Research & Insights', 1, '2025-09-04T14:15:53.588Z', '2025-09-04T14:15:53.588Z'),
  (30, 9, 'Service Design Implementation', 2, '2025-09-04T14:15:53.588Z', '2025-09-04T14:15:53.588Z'),
  (31, 10, 'SME Business Strategy', 0, '2025-09-04T14:15:53.588Z', '2025-09-04T14:15:53.588Z'),
  (32, 10, 'Partnership & Network Development', 1, '2025-09-04T14:15:53.588Z', '2025-09-04T14:15:53.588Z'),
  (33, 10, 'Growth & Scale Management', 2, '2025-09-04T14:15:53.588Z', '2025-09-04T14:15:53.588Z'),
  (34, 11, 'n8n Platform Overview', 0, '2025-09-04T14:15:53.588Z', '2025-09-04T14:15:53.588Z'),
  (35, 11, 'Building Basic Workflows', 1, '2025-09-04T14:15:53.588Z', '2025-09-04T14:15:53.588Z'),
  (36, 11, 'Advanced Automation Techniques', 2, '2025-09-04T14:15:53.588Z', '2025-09-04T14:15:53.588Z'),
  (39, 14, 'Introduction', 0, '2025-09-07T15:08:05.900Z', '2025-09-07T15:08:05.900Z');

ALTER TABLE "topics" ADD CONSTRAINT "topics_pkey" PRIMARY KEY ("id");


-- Table: users (15 rows)
-- ----------------------------------------

CREATE TABLE IF NOT EXISTS "users" (
  "id" CHARACTER VARYING NOT NULL DEFAULT gen_random_uuid(),
  "email" CHARACTER VARYING,
  "first_name" CHARACTER VARYING,
  "last_name" CHARACTER VARYING,
  "profile_image_url" CHARACTER VARYING,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  "role" CHARACTER VARYING DEFAULT 'student'::character varying
);

INSERT INTO "users" ("id", "email", "first_name", "last_name", "profile_image_url", "created_at", "updated_at", "role") VALUES
  ('user_demo_001', 'alice.johnson@example.com', 'Alice', 'Johnson', '/api/placeholder/100/100', '2025-08-28T12:11:50.601Z', '2025-08-28T12:11:50.601Z', 'student'),
  ('user_demo_002', 'david.smith@example.com', 'David', 'Smith', '/api/placeholder/100/100', '2025-08-28T12:11:50.601Z', '2025-08-28T12:11:50.601Z', 'student'),
  ('user_demo_003', 'emma.wilson@example.com', 'Emma', 'Wilson', '/api/placeholder/100/100', '2025-08-28T12:11:50.601Z', '2025-08-28T12:11:50.601Z', 'student'),
  ('user_demo_004', 'john.doe@example.com', 'John', 'Doe', '/api/placeholder/100/100', '2025-08-28T12:11:50.601Z', '2025-08-28T12:11:50.601Z', 'student'),
  ('user_demo_005', 'sarah.brown@example.com', 'Sarah', 'Brown', '/api/placeholder/100/100', '2025-08-28T12:11:50.601Z', '2025-08-28T12:11:50.601Z', 'student'),
  ('user_demo_006', 'michael.davis@example.com', 'Michael', 'Davis', '/api/placeholder/100/100', '2025-08-28T12:11:50.601Z', '2025-08-28T12:11:50.601Z', 'student'),
  ('user_demo_007', 'lisa.miller@example.com', 'Lisa', 'Miller', '/api/placeholder/100/100', '2025-08-28T12:11:50.601Z', '2025-08-28T12:11:50.601Z', 'student'),
  ('user_demo_008', 'robert.garcia@example.com', 'Robert', 'Garcia', '/api/placeholder/100/100', '2025-08-28T12:11:50.601Z', '2025-08-28T12:11:50.601Z', 'student'),
  ('instructor_1', 'sarah.johnson@eaccc.com', 'Sarah', 'Johnson', NULL, '2025-08-29T12:24:09.533Z', '2025-08-29T12:24:09.533Z', 'instructor'),
  ('instructor_2', 'michael.thompson@eaccc.com', 'Michael', 'Thompson', NULL, '2025-08-29T12:24:09.533Z', '2025-08-29T12:24:09.533Z', 'instructor'),
  ('instructor_3', 'priya.patel@eaccc.com', 'Priya', 'Patel', NULL, '2025-08-29T12:24:09.533Z', '2025-08-29T12:24:09.533Z', 'instructor'),
  ('instructor_4', 'james.wilson@eaccc.com', 'James', 'Wilson', NULL, '2025-08-29T12:24:09.533Z', '2025-08-29T12:24:09.533Z', 'instructor'),
  ('admin_1', 'admin@eaccc.com', 'Admin', 'User', NULL, '2025-08-29T12:24:09.533Z', '2025-08-29T12:24:09.533Z', 'admin'),
  ('46204420', 'joemaina180@gmail.com', 'Joe', 'Maina', NULL, '2025-08-28T12:20:43.593Z', '2025-08-30T06:55:05.768Z', 'admin'),
  ('45058292', 'modernmindsgroup@gmail.com', 'Modern', 'Minds', NULL, '2025-08-29T13:13:13.860Z', '2025-09-07T11:17:33.244Z', 'student');

ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


SET session_replication_role = DEFAULT;

-- Export completed

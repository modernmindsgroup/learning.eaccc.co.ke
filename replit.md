# EACCC Learning Platform

## Overview

EACCC Learning is a comprehensive e-learning platform designed specifically for the East African Customer Care Center community. The platform provides professional development courses focused on customer service excellence, business development, and leadership skills tailored for the East African market context. The application supports both free and paid course offerings, with features including video lessons, quizzes, certificates, progress tracking, and a complete learning management system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a modern component-based architecture:

- **Framework**: React with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom EACCC brand colors (#0097D7 blue, #F7941D orange, #34A853 green)
- **Build Tool**: Vite for fast development and optimized production builds

The application uses a page-based routing structure with protected routes for authenticated users. Key pages include landing, courses, course details, learning interface, and user dashboard.

### Backend Architecture
The backend follows a Node.js/Express architecture with PostgreSQL database:

- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **File Storage**: Google Cloud Storage for course assets and user uploads

The API follows RESTful conventions with clear separation between public routes (courses, stats) and protected routes (enrollments, progress tracking).

### Data Storage Solutions
The application uses PostgreSQL as the primary database with the following key entities:

- **Users**: Authentication and profile management
- **Instructors**: Course creator profiles with expertise areas
- **Courses**: Core course content with pricing, categories, and metadata
- **Lessons**: Individual video/content lessons within courses
- **Enrollments**: User course registrations with progress tracking
- **Certificates**: Course completion credentials
- **Reviews**: User feedback and ratings system
- **Blog Posts**: Content marketing and educational articles

The database schema supports course hierarchies, progress tracking, and certification workflows.

### Authentication and Authorization
The system uses Replit's OpenID Connect authentication:

- **Provider**: Replit OIDC for secure user authentication
- **Session Management**: Server-side sessions with PostgreSQL persistence
- **Authorization**: Route-level protection with user context propagation
- **User Management**: Automatic user creation/update on authentication

### Course Management System
The platform implements a comprehensive learning management system:

- **Course Structure**: Hierarchical organization with courses containing multiple lessons
- **Progress Tracking**: Lesson completion status and overall course progress
- **Enrollment System**: Free and paid course access control
- **Certification**: Automatic certificate generation upon course completion
- **Content Delivery**: Video streaming and downloadable resources

### User Interface Design
The UI follows EACCC brand guidelines with:

- **Design System**: Consistent component library with brand colors
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Skeleton components and loading indicators
- **Error Handling**: User-friendly error messages and fallback states

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Google Cloud Storage**: File storage for course assets and user uploads
- **Replit Infrastructure**: Hosting and development environment

### Authentication Services
- **Replit Auth**: OpenID Connect provider for user authentication
- **Express Session**: Session management with PostgreSQL store

### UI and Development Libraries
- **Radix UI**: Accessible component primitives
- **Shadcn/ui**: Pre-built component library
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight React router
- **Tailwind CSS**: Utility-first CSS framework

### File Upload and Media
- **Uppy**: File upload interface with drag-and-drop support
- **Google Cloud Storage**: Cloud storage for media files
- **Image optimization**: Automatic image processing and CDN delivery

### Database and ORM
- **Drizzle ORM**: Type-safe database operations
- **Zod**: Runtime type validation for API requests
- **PostgreSQL**: Primary database with full-text search capabilities

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS**: CSS processing with Tailwind integration
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import About from "@/pages/about";
import Courses from "@/pages/courses";
import CourseDetails from "@/pages/course-details";
import Learning from "@/pages/learning";
import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLogin from "@/pages/admin-login";
import InstructorDashboard from "@/pages/instructor-dashboard";
import InstructorLogin from "@/pages/instructor-login";
import Demo from "@/pages/demo";
import Instructors from "@/pages/instructors";
import Store from "@/pages/store";
import Forums from "@/pages/forums";
import Contact from "@/pages/contact";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-eaccc-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-eaccc-blue rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - accessible to everyone */}
      <Route path="/about" component={About} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetails} />
      <Route path="/demo/:id" component={Demo} />
      <Route path="/instructors" component={Instructors} />
      <Route path="/store" component={Store} />
      <Route path="/forums" component={Forums} />
      <Route path="/contact" component={Contact} />
      
      {/* Admin and Instructor Portal Login Pages */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/instructor/login" component={InstructorLogin} />
      
      {/* Admin Dashboard - requires admin role */}
      <Route path="/admin" component={AdminDashboard} />
      
      {/* Instructor Dashboard - requires instructor or admin role */}
      <Route path="/instructor" component={InstructorDashboard} />
      
      {/* Authentication-specific routes */}
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/learn/:courseId/:lessonId?" component={Learning} />
          <Route path="/dashboard" component={Dashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

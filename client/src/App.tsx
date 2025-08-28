import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import CourseDetails from "@/pages/course-details";
import Learning from "@/pages/learning";
import Dashboard from "@/pages/dashboard";
import Instructors from "@/pages/instructors";
import Store from "@/pages/store";
import Forums from "@/pages/forums";
import Contact from "@/pages/contact";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public routes - accessible to everyone */}
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetails} />
      <Route path="/instructors" component={Instructors} />
      <Route path="/store" component={Store} />
      <Route path="/forums" component={Forums} />
      <Route path="/contact" component={Contact} />
      
      {/* Authentication-specific routes */}
      {isLoading || !isAuthenticated ? (
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

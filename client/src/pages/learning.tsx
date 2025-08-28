import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Play, 
  FileText,
  Download,
  Menu,
  X 
} from "lucide-react";
import type { CourseWithProgress, Lesson } from "@shared/schema";

export default function Learning() {
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const courseId = parseInt(params.courseId!);
  const lessonId = params.lessonId ? parseInt(params.lessonId) : null;

  const { data: course } = useQuery<CourseWithProgress>({
    queryKey: ["/api/courses", courseId],
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["/api/courses", courseId, "lessons"],
  });

  // Get current lesson or default to first lesson
  const currentLesson = lessons?.find(l => l.id === lessonId) || lessons?.[0];
  const currentLessonIndex = lessons?.findIndex(l => l.id === currentLesson?.id) ?? -1;
  const hasNext = currentLessonIndex < (lessons?.length ?? 0) - 1;
  const hasPrev = currentLessonIndex > 0;

  const markCompleteMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      await apiRequest("POST", `/api/lessons/${lessonId}/complete`);
    },
    onSuccess: () => {
      toast({
        title: "Lesson Completed!",
        description: "Great job! You've completed this lesson.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses", courseId] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-enrollments"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete.",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  // Check if user is enrolled
  useEffect(() => {
    if (course && !course.enrollment) {
      toast({
        title: "Not Enrolled",
        description: "You need to enroll in this course first.",
        variant: "destructive",
      });
      window.location.href = `/courses/${courseId}`;
    }
  }, [course, courseId, toast]);

  const goToLesson = (lesson: Lesson) => {
    window.location.href = `/learn/${courseId}/${lesson.id}`;
  };

  const goToNextLesson = () => {
    if (hasNext && lessons) {
      const nextLesson = lessons[currentLessonIndex + 1];
      goToLesson(nextLesson);
    }
  };

  const goToPrevLesson = () => {
    if (hasPrev && lessons) {
      const prevLesson = lessons[currentLessonIndex - 1];
      goToLesson(prevLesson);
    }
  };

  if (authLoading || !course || !lessons || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      
      {/* Lesson Navigation Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800 overflow-hidden`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold truncate">{course.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Progress</span>
            <span>{course.userProgress}%</span>
          </div>
          <Progress value={course.userProgress} className="h-2 mt-1" />
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="space-y-2">
            {lessons.map((lesson, index) => {
              const isActive = lesson.id === currentLesson.id;
              const isCompleted = false; // TODO: Check user progress
              
              return (
                <div
                  key={lesson.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-eaccc-blue text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                  onClick={() => goToLesson(lesson)}
                >
                  <div className="flex items-center space-x-3">
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-eaccc-green flex-shrink-0" />
                    ) : lesson.videoUrl ? (
                      <Play className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <FileText className="h-5 w-5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{lesson.title}</p>
                      <p className="text-xs opacity-75">{lesson.duration}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-lg font-semibold">{currentLesson.title}</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = `/courses/${courseId}`}
              className="text-gray-400 hover:text-white"
            >
              Exit Course
            </Button>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Video or Content Display */}
            {currentLesson.videoUrl ? (
              <div className="bg-black rounded-lg mb-6 aspect-video">
                <iframe
                  src={currentLesson.videoUrl}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                  title={currentLesson.title}
                />
              </div>
            ) : (
              <Card className="mb-6 bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed">
                      {currentLesson.content || currentLesson.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Description */}
            {currentLesson.description && (
              <Card className="mb-6 bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">About This Lesson</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{currentLesson.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Downloadable Materials */}
            <Card className="mb-6 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Downloadable Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Download className="h-4 w-4" />
                  <span>No downloadable materials for this lesson</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={goToPrevLesson}
                disabled={!hasPrev}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Lesson
              </Button>

              <Button
                onClick={() => markCompleteMutation.mutate(currentLesson.id)}
                disabled={markCompleteMutation.isPending}
                className="bg-eaccc-green hover:bg-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {markCompleteMutation.isPending ? "Marking Complete..." : "Mark Lesson Complete"}
              </Button>

              <Button
                variant="outline"
                onClick={goToNextLesson}
                disabled={!hasNext}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                Next Lesson
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

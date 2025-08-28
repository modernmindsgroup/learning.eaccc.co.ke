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
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Play, 
  FileText,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Share,
  Settings,
  MoreHorizontal
} from "lucide-react";
import type { CourseWithProgress, Lesson } from "@shared/schema";

interface LessonWithProgress extends Lesson {
  completed?: boolean;
}

interface CourseSection {
  title: string;
  order: number;
  lessons: LessonWithProgress[];
  completedCount: number;
  totalDuration: string;
}

export default function Learning() {
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([1]));
  
  const courseId = parseInt(params.courseId!);
  const lessonId = params.lessonId ? parseInt(params.lessonId) : null;

  const { data: course } = useQuery<CourseWithProgress>({
    queryKey: ["/api/courses", courseId],
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["/api/courses", courseId, "lessons"],
  });

  const { data: lessonProgress } = useQuery<any[]>({
    queryKey: ["/api/lesson-progress", courseId],
    enabled: !!courseId && isAuthenticated,
  });

  // Process lessons into sections
  const sections: CourseSection[] = lessons ? lessons.reduce((acc: CourseSection[], lesson: Lesson) => {
    const sectionTitle = lesson.sectionTitle || "Introduction";
    const sectionOrder = lesson.sectionOrder || 1;
    
    let section = acc.find(s => s.title === sectionTitle);
    if (!section) {
      section = {
        title: sectionTitle,
        order: sectionOrder,
        lessons: [],
        completedCount: 0,
        totalDuration: "0min"
      };
      acc.push(section);
    }

    const lessonWithProgress: LessonWithProgress = {
      ...lesson,
      completed: lessonProgress?.some(p => p.lessonId === lesson.id && p.completed) || false
    };

    section.lessons.push(lessonWithProgress);
    if (lessonWithProgress.completed) {
      section.completedCount++;
    }

    // Calculate total duration for section
    const totalMinutes = section.lessons.reduce((sum, l) => {
      const duration = l.duration || "0min";
      const minutes = parseInt(duration.replace(/\D/g, '')) || 0;
      return sum + minutes;
    }, 0);
    section.totalDuration = totalMinutes >= 60 ? 
      `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min` : 
      `${totalMinutes}min`;

    return acc;
  }, []).sort((a, b) => a.order - b.order) : [];

  // Get current lesson
  const allLessons = sections.flatMap(s => s.lessons);
  const currentLesson = allLessons.find(l => l.id === lessonId) || allLessons[0];
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLesson?.id) ?? -1;
  const hasNext = currentLessonIndex < allLessons.length - 1;
  const hasPrev = currentLessonIndex > 0;

  // Calculate overall progress
  const completedLessons = allLessons.filter(l => l.completed).length;
  const totalLessons = allLessons.length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

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
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-progress", courseId] });
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
    if (hasNext && allLessons) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      goToLesson(nextLesson);
    }
  };

  const goToPrevLesson = () => {
    if (hasPrev && allLessons) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      goToLesson(prevLesson);
    }
  };

  const toggleSection = (sectionOrder: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionOrder)) {
      newExpanded.delete(sectionOrder);
    } else {
      newExpanded.add(sectionOrder);
    }
    setExpandedSections(newExpanded);
  };

  if (authLoading || !course || !currentLesson) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eaccc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Udemy-style Top Progress Bar */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = `/courses/${courseId}`}
            className="text-white hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Exit
          </Button>
          
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium truncate">{course.title}</span>
              <span className="text-gray-400 whitespace-nowrap">{overallProgress}% complete</span>
            </div>
            <Progress 
              value={overallProgress} 
              className="h-1 bg-gray-700" 
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Course Content Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden flex flex-col`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Course content</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {sections.map((section) => (
              <div key={section.order} className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection(section.order)}
                  className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                    <p className="text-sm text-gray-600">
                      {section.completedCount} / {section.lessons.length} | {section.totalDuration}
                    </p>
                  </div>
                  {expandedSections.has(section.order) ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.has(section.order) && (
                  <div className="bg-gray-50">
                    {section.lessons.map((lesson) => {
                      const isActive = lesson.id === currentLesson.id;
                      const isCompleted = lesson.completed;
                      
                      return (
                        <div
                          key={lesson.id}
                          className={`p-3 cursor-pointer border-l-4 ${
                            isActive 
                              ? 'bg-purple-50 border-purple-500' 
                              : 'border-transparent hover:bg-gray-100'
                          }`}
                          onClick={() => goToLesson(lesson)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : lesson.videoUrl ? (
                                <Play className="h-4 w-4 text-gray-600" />
                              ) : (
                                <FileText className="h-4 w-4 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${
                                isActive ? 'text-purple-700' : 'text-gray-900'
                              }`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500">{lesson.duration}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-purple-600 hover:text-purple-700 h-6 px-2"
                                >
                                  Resources
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          
          {/* Lesson Header */}
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!sidebarOpen && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                )}
                <h1 className="text-xl font-semibold text-gray-900">{currentLesson.title}</h1>
              </div>
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
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Lesson Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {currentLesson.content || currentLesson.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lesson Description */}
              {currentLesson.description && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>About This Lesson</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{currentLesson.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={goToPrevLesson}
                  disabled={!hasPrev}
                  className="border-gray-300"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <Button
                  onClick={() => markCompleteMutation.mutate(currentLesson.id)}
                  disabled={markCompleteMutation.isPending || currentLesson.completed}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {currentLesson.completed ? "Completed" : 
                   markCompleteMutation.isPending ? "Marking Complete..." : "Mark Complete"}
                </Button>

                <Button
                  variant="outline"
                  onClick={goToNextLesson}
                  disabled={!hasNext}
                  className="border-gray-300"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
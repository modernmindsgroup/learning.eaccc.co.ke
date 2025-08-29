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

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
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
      const response = await apiRequest("POST", `/api/lessons/${lessonId}/complete`);
      return await response.json();
    },
    onSuccess: (data: any) => {
      if (data.courseCompleted) {
        if (data.certificateIssued) {
          toast({
            title: "🎉 Course Completed!",
            description: "Congratulations! You've completed the entire course and earned your certificate!",
          });
        } else {
          toast({
            title: "🎉 Course Completed!",
            description: "Congratulations! You've completed the entire course!",
          });
        }
        // Refresh certificates if one was issued
        queryClient.invalidateQueries({ queryKey: ["/api/my-certificates"] });
      } else {
        toast({
          title: "Lesson Completed!",
          description: `Great job! You've completed this lesson. Progress: ${data.progress || 0}%`,
        });
      }
      
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
      // Use direct navigation to avoid 404 flash
      const nextUrl = `/learn/${courseId}/${nextLesson.id}`;
      window.history.pushState(null, '', nextUrl);
      window.location.reload();
    }
  };

  const goToPrevLesson = () => {
    if (hasPrev && allLessons) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      // Use direct navigation to avoid 404 flash
      const prevUrl = `/learn/${courseId}/${prevLesson.id}`;
      window.history.pushState(null, '', prevUrl);
      window.location.reload();
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

  // Loading state - only show spinner if data is actually loading
  if (authLoading || !course || lessonsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eaccc-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  // No lessons available - show proper message instead of infinite loading
  if (!currentLesson && allLessons.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Content Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            You're enrolled in this course, but lessons haven't been added yet. 
            Check back soon for updates!
          </p>
          <Button 
            onClick={() => window.location.href = `/courses/${courseId}`}
            className="bg-[#0097D7] hover:bg-[#0097D7]/90 text-white"
          >
            Back to Course Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eaccc-bg flex flex-col">
      
      {/* EACCC-style Top Progress Bar */}
      <div className="bg-gradient-to-r from-eaccc-blue to-blue-600 text-white px-4 py-4 shadow-sm">
        <div className="w-full flex items-center justify-between">
          {/* Left: Back Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = `/courses/${courseId}`}
              className="text-white hover:bg-white/10 border border-white/20"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </div>
          
          {/* Center: Progress */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold truncate text-blue-100">{course.title}</span>
              <span className="text-blue-200 whitespace-nowrap font-medium">{overallProgress}% complete</span>
            </div>
            <Progress 
              value={overallProgress} 
              className="h-2 bg-blue-800/30" 
            />
          </div>
          
          {/* Right: Utility Icons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Course Content Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 shadow-sm overflow-hidden flex flex-col`}>
          <div className="pl-4 pr-6 py-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-eaccc-blue">Course Content</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-eaccc-blue"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">{totalLessons} lessons • {completedLessons} completed</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {sections.map((section) => (
              <div key={section.order} className="border-b border-gray-100">
                <button
                  onClick={() => toggleSection(section.order)}
                  className="w-full pl-4 pr-6 py-4 text-left hover:bg-blue-50 flex items-center justify-between transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                    <p className="text-sm text-gray-600">
                      {section.completedCount} / {section.lessons.length} lessons • {section.totalDuration}
                    </p>
                  </div>
                  {expandedSections.has(section.order) ? (
                    <ChevronUp className="h-4 w-4 text-eaccc-blue" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-eaccc-blue" />
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
                          className={`pl-4 pr-6 py-3 cursor-pointer border-l-4 transition-colors ${
                            isActive 
                              ? 'bg-blue-50 border-eaccc-blue' 
                              : 'border-transparent hover:bg-gray-50'
                          }`}
                          onClick={() => goToLesson(lesson)}
                        >
                          <div className="flex items-center space-x-4">
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
                                isActive ? 'text-eaccc-blue' : 'text-gray-900'
                              }`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">{lesson.duration}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-eaccc-blue hover:text-blue-700 h-6 px-2"
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
        <div className="flex-1 flex flex-col bg-white">
          
          {/* Lesson Header */}
          <div className="bg-white p-6 border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {!sidebarOpen && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSidebarOpen(true)}
                      className="text-eaccc-blue border-eaccc-blue hover:bg-blue-50"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  )}
                  <h1 className="text-2xl font-semibold text-gray-900">{currentLesson.title}</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="flex-1 px-8 py-8 pb-24">
            <div className="max-w-4xl mx-auto">
              
              {/* Video or Content Display */}
              {currentLesson.videoUrl ? (
                <div className="bg-black rounded-lg mb-8 aspect-video shadow-lg">
                  <iframe
                    src={currentLesson.videoUrl}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                    title={currentLesson.title}
                  />
                </div>
              ) : (
                <Card className="mb-8 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">Lesson Content</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {currentLesson.content || currentLesson.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lesson Description */}
              {currentLesson.description && (
                <Card className="mb-8 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-gray-900">About This Lesson</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed text-base">{currentLesson.description}</p>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-eaccc-orange to-orange-600 text-white shadow-lg border-t border-orange-400">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={goToPrevLesson}
              disabled={!hasPrev}
              className="text-white hover:bg-white/10 border border-white/20 px-6 py-3"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Lesson
            </Button>

            <Button
              onClick={() => markCompleteMutation.mutate(currentLesson.id)}
              disabled={markCompleteMutation.isPending || currentLesson.completed}
              className="bg-white text-eaccc-orange hover:bg-gray-100 px-8 py-3 font-semibold"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {currentLesson.completed ? "Completed ✓" : 
               markCompleteMutation.isPending ? "Marking Complete..." : "Mark Complete"}
            </Button>

            <Button
              variant="ghost"
              onClick={goToNextLesson}
              disabled={!hasNext}
              className="text-white hover:bg-white/10 border border-white/20 px-6 py-3"
            >
              Next Lesson
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
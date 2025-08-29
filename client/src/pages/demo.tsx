import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  CheckCircle, 
  Play, 
  Award,
  Clock,
  Download,
  BookOpen
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface DemoLesson {
  id: string;
  courseId: number;
  title: string;
  description: string;
  content: string;
  duration: string;
  isDemo: boolean;
}

interface DemoCertificate {
  id: string;
  courseId: number;
  courseName: string;
  studentName: string;
  completionDate: string;
  isDemo: boolean;
}

export default function Demo() {
  const params = useParams();
  const { toast } = useToast();
  const [lessonStarted, setLessonStarted] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificate, setCertificate] = useState<DemoCertificate | null>(null);
  
  const courseId = parseInt(params.id!);

  const { data: demoLesson, isLoading } = useQuery<DemoLesson>({
    queryKey: [`/api/courses/${courseId}/demo`],
  });

  const { data: course } = useQuery({
    queryKey: ["/api/courses", courseId],
  });

  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/courses/${courseId}/demo/complete`);
      return await response.json();
    },
    onSuccess: (data) => {
      setLessonCompleted(true);
      setProgress(100);
      setCertificate(data.certificate);
      setShowCertificate(true);
      toast({
        title: "Demo Completed!",
        description: "Congratulations! You've experienced a sample of our training.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete demo lesson.",
        variant: "destructive",
      });
    },
  });

  const startLesson = () => {
    setLessonStarted(true);
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Stop at 90% until manually completed
        }
        return prev + 10;
      });
    }, 800);
  };

  const completeLesson = () => {
    completeLessonMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097D7] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading demo lesson...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!demoLesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Demo Not Available
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sorry, this demo lesson is not available at the moment.
            </p>
            <Button 
              className="mt-4"
              onClick={() => window.location.href = `/course/${courseId}`}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = `/course/${courseId}`}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">Demo Lesson</Badge>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {demoLesson.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {demoLesson.description}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="mr-1 h-4 w-4" />
                {demoLesson.duration}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                {!lessonStarted ? (
                  /* Start Screen */
                  <div className="text-center py-16 px-8">
                    <div className="w-24 h-24 bg-[#0097D7] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">Ready to Start Your Demo?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                      Experience a sample lesson from our comprehensive customer service training program. 
                      This demo will give you a taste of our interactive learning approach.
                    </p>
                    <Button 
                      size="lg"
                      className="bg-[#0097D7] hover:bg-[#0097D7]/90 text-white"
                      onClick={startLesson}
                      data-testid="button-start-demo"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Start Demo Lesson
                    </Button>
                  </div>
                ) : (
                  /* Lesson Content */
                  <div className="p-8">
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: demoLesson.content }}
                    />
                    
                    {progress >= 90 && !lessonCompleted && (
                      <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-center">
                          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                            You've Reached the End!
                          </h3>
                          <p className="text-green-600 dark:text-green-300 mb-4">
                            Congratulations on completing this demo lesson. Click below to finish and see your certificate.
                          </p>
                          <Button 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={completeLesson}
                            disabled={completeLessonMutation.isPending}
                            data-testid="button-complete-demo"
                          >
                            {completeLessonMutation.isPending ? "Generating Certificate..." : "Complete Demo & Get Certificate"}
                            <Award className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Demo Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {lessonCompleted && (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Demo Completed!</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowCertificate(true)}
                      data-testid="button-view-certificate"
                    >
                      <Award className="mr-2 h-4 w-4" />
                      View Certificate
                    </Button>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">What's Next?</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>• Enroll in the full course for complete training</p>
                    <p>• Access all lessons and materials</p>
                    <p>• Earn an official certificate</p>
                    <p>• Join our learning community</p>
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-[#F7941D] hover:bg-[#F7941D]/90 text-white"
                    onClick={() => window.location.href = `/course/${courseId}`}
                    data-testid="button-enroll-full-course"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Enroll in Full Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Demo Certificate</DialogTitle>
          </DialogHeader>
          
          {certificate && (
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-[#0097D7]">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0097D7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#0097D7] mb-2">
                  Certificate of Demo Completion
                </h2>
                
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                  EACCC Learning Platform
                </div>
                
                <div className="my-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    This certifies that
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {certificate.studentName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    has successfully completed the demo lesson for
                  </p>
                  <p className="text-xl font-semibold text-[#F7941D] mb-4">
                    {certificate.courseName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed on {certificate.completionDate}
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Note:</strong> This is a demo certificate. To earn an official certificate, 
                    enroll in the full course and complete all lessons.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#0097D7] hover:bg-[#0097D7]/90 text-white"
                    onClick={() => window.location.href = `/course/${courseId}`}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Enroll in Full Course
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowCertificate(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, redirectToLogin } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Users, 
  Award, 
  Star, 
  Play, 
  FileText, 
  CheckCircle, 
  Lock,
  BookOpen,
  CreditCard 
} from "lucide-react";
import type { CourseWithProgress, Lesson, Review } from "@shared/schema";

export default function CourseDetails() {
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const courseId = parseInt(params.id!);

  // Check for payment success in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      toast({
        title: "Payment Successful!",
        description: "Welcome to your new course! You can now start learning.",
        variant: "default",
      });
      // Clear the URL parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (paymentStatus === 'failed') {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
      // Clear the URL parameter
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [toast]);

  const { data: course, isLoading } = useQuery<CourseWithProgress>({
    queryKey: ["/api/courses", courseId],
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["/api/courses", courseId, "lessons"],
  });

  const { data: reviews } = useQuery<(Review & { user: any })[]>({
    queryKey: ["/api/courses", courseId, "reviews"],
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/courses/${courseId}/enroll`);
    },
    onSuccess: () => {
      toast({
        title: "Enrolled Successfully!",
        description: "You can now start learning this course.",
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
          redirectToLogin();
        }, 500);
        return;
      }
      toast({
        title: "Enrollment Failed",
        description: "There was an error enrolling in this course.",
        variant: "destructive",
      });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/payments/initialize", {
        courseId: courseId.toString(),
      });
      return response;
    },
    onSuccess: (data: any) => {
      if (data.status && data.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        toast({
          title: "Payment Failed",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          redirectToLogin();
        }, 500);
        return;
      }
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive",
      });
    },
  });

  // Course details are public - no need to redirect unauthenticated users
  // Only enrolled users can access lessons

  if (isLoading) {
    return (
      <div className="min-h-screen bg-eaccc-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-eaccc-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist.</p>
            <Button 
              className="mt-4"
              onClick={() => window.location.href = "/courses"}
            >
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isEnrolled = !!course.enrollment;
  const canEnroll = isAuthenticated && !isEnrolled;
  const canStartLearning = isAuthenticated && isEnrolled;

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Course Header */}
      <section className="bg-gradient-to-r from-eaccc-blue to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <Badge className="bg-eaccc-orange text-white">{course.category}</Badge>
                {course.isFeatured && <Badge className="bg-yellow-500 text-black">Featured</Badge>}
                {course.isBestseller && <Badge className="bg-red-500 text-white">Bestseller</Badge>}
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  {course.enrollmentCount} students
                </div>
                <div className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  {course.rating} rating
                </div>
                {course.hasCertificate && (
                  <div className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Certificate
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {course.description || "This comprehensive course will provide you with the essential skills and knowledge needed to excel in customer service and professional development."}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>What You'll Learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-eaccc-green" />
                          Master customer service fundamentals
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-eaccc-green" />
                          Develop effective communication skills
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-eaccc-green" />
                          Handle difficult customer situations
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-eaccc-green" />
                          Apply best practices in African business context
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="space-y-4">
                  {lessons?.map((lesson, index) => {
                    const isCompleted = false; // TODO: Check user progress
                    const isLocked = !isEnrolled && lesson.isLocked;
                    
                    return (
                      <Card key={lesson.id} className={isLocked ? "opacity-60" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {isLocked ? (
                                <Lock className="h-5 w-5 text-gray-400" />
                              ) : lesson.videoUrl ? (
                                <Play className="h-5 w-5 text-eaccc-blue" />
                              ) : (
                                <FileText className="h-5 w-5 text-eaccc-blue" />
                              )}
                              <div>
                                <h4 className="font-medium">{lesson.title}</h4>
                                <p className="text-sm text-gray-600">{lesson.duration}</p>
                              </div>
                            </div>
                            {isCompleted && (
                              <CheckCircle className="h-5 w-5 text-eaccc-green" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>

                <TabsContent value="instructor" className="space-y-6">
                  {course.instructor && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={course.instructor.profileImage} />
                            <AvatarFallback>
                              {course.instructor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{course.instructor.name}</h3>
                            <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                            {course.instructor.expertise && (
                              <div className="flex flex-wrap gap-2">
                                {course.instructor.expertise.map((skill, index) => (
                                  <Badge key={index} variant="outline">{skill}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {reviews?.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.user?.profileImageUrl} />
                            <AvatarFallback>
                              {(review.user?.firstName?.[0] || '') + (review.user?.lastName?.[0] || '')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">
                                {review.user?.firstName} {review.user?.lastName}
                              </h4>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {(!reviews || reviews.length === 0) && (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-gray-600">No reviews yet. Be the first to review this course!</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-[#0097D7] mb-2">
                      {course.price === "0" || course.price === "0.00" ? "FREE" : `$${course.price}`}
                    </div>
                    {(course.price === "0" || course.price === "0.00") && (
                      <p className="text-green-600 font-medium">No cost - Start learning today!</p>
                    )}
                  </div>

                  {/* Progress for enrolled users */}
                  {isEnrolled && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm">{course.userProgress}%</span>
                      </div>
                      <Progress value={course.userProgress} className="h-2" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {canEnroll && (
                      <>
                        {course.price === "0" || course.price === "0.00" ? (
                          <Button 
                            className="w-full bg-[#0097D7] hover:bg-[#0097D7]/90 text-white"
                            onClick={() => enrollMutation.mutate()}
                            disabled={enrollMutation.isPending}
                            data-testid="button-enroll-free"
                          >
                            {enrollMutation.isPending ? "Enrolling..." : (
                              <>
                                <BookOpen className="mr-2 h-4 w-4" />
                                Enroll Free
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button 
                            className="w-full bg-[#F7941D] hover:bg-[#F7941D]/90 text-white"
                            onClick={() => paymentMutation.mutate()}
                            disabled={paymentMutation.isPending}
                            data-testid="button-purchase-course"
                          >
                            {paymentMutation.isPending ? "Processing..." : (
                              <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Purchase Now - ${course.price}
                              </>
                            )}
                          </Button>
                        )}
                      </>
                    )}

                    {canStartLearning && (
                      <Button 
                        className="w-full bg-[#0097D7] hover:bg-[#0097D7]/90 text-white"
                        onClick={() => window.location.href = `/learning/${course.id}`}
                        data-testid="button-continue-learning"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {course.userProgress === 0 ? "Start Learning" : "Continue Learning"}
                      </Button>
                    )}

                    {!isAuthenticated && (
                      <Button 
                        className="w-full bg-[#0097D7] hover:bg-[#0097D7]/90 text-white"
                        onClick={() => redirectToLogin()}
                        data-testid="button-login-to-enroll"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Login to Enroll
                      </Button>
                    )}
                  </div>

                  {/* Course Features */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-3">This course includes:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        {course.duration} of content
                      </li>
                      {course.hasCertificate && (
                        <li className="flex items-center">
                          <Award className="mr-2 h-4 w-4 text-gray-400" />
                          Certificate of completion
                        </li>
                      )}
                      {course.hasQuiz && (
                        <li className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-gray-400" />
                          Practice quizzes
                        </li>
                      )}
                      <li className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-gray-400" />
                        Lifetime access
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

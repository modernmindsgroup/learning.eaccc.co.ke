import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Award, 
  Clock, 
  Download, 
  Star,
  Calendar,
  TrendingUp,
  Users,
  Play
} from "lucide-react";
import type { CourseWithInstructor, Enrollment, Certificate } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery<(Enrollment & { course: CourseWithInstructor })[]>({
    queryKey: ["/api/my-enrollments"],
  });

  const { data: certificates, isLoading: certificatesLoading } = useQuery<Certificate[]>({
    queryKey: ["/api/my-certificates"],
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-eaccc-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedCourses = enrollments?.filter(e => e.progress === 100) || [];
  const inProgressCourses = enrollments?.filter(e => e.progress > 0 && e.progress < 100) || [];
  const totalLearningHours = enrollments?.reduce((acc, enrollment) => {
    const duration = enrollment.course.duration || "0:00 Hours";
    const hours = parseFloat(duration.split(':')[0]) || 0;
    const minutes = parseFloat(duration.split(':')[1]) || 0;
    return acc + hours + (minutes / 60);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Dashboard Header */}
      <section className="bg-gradient-to-r from-eaccc-blue to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || ""} />
              <AvatarFallback className="text-2xl">
                {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName || 'Learner'}!
              </h1>
              <p className="text-xl text-blue-100">
                Continue your journey to excellence in customer service and professional development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-eaccc-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-eaccc-blue">
                  {enrollments?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
                <Award className="h-4 w-4 text-eaccc-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-eaccc-green">
                  {completedCourses.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                <Award className="h-4 w-4 text-eaccc-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-eaccc-orange">
                  {certificates?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {totalLearningHours.toFixed(1)}h
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Enrolled Courses */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>My Courses</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = "/courses"}
                    >
                      Browse More
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {enrollmentsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : enrollments && enrollments.length > 0 ? (
                    <div className="space-y-4">
                      {enrollments.map((enrollment) => (
                        <div key={enrollment.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <img
                            src={enrollment.course.thumbnailUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                            alt={enrollment.course.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {enrollment.course.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              by {enrollment.course.instructor?.name}
                            </p>
                            <div className="flex items-center space-x-4">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-500">Progress</span>
                                  <span className="text-xs font-medium">{enrollment.progress}%</span>
                                </div>
                                <Progress value={enrollment.progress} className="h-2" />
                              </div>
                              <Badge
                                variant={enrollment.progress === 100 ? "default" : "secondary"}
                                className={enrollment.progress === 100 ? "bg-eaccc-green" : ""}
                              >
                                {enrollment.progress === 100 ? "Completed" : "In Progress"}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-eaccc-blue hover:bg-blue-700"
                            onClick={() => window.location.href = `/learn/${enrollment.course.id}`}
                          >
                            <Play className="mr-1 h-4 w-4" />
                            {enrollment.progress === 0 ? "Start" : "Continue"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled yet</h3>
                      <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course.</p>
                      <Button
                        className="bg-eaccc-blue hover:bg-blue-700"
                        onClick={() => window.location.href = "/courses"}
                      >
                        Browse Courses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-eaccc-orange" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {certificatesLoading ? (
                    <div className="space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : certificates && certificates.length > 0 ? (
                    <div className="space-y-3">
                      {certificates.slice(0, 3).map((certificate) => (
                        <div key={certificate.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">Certificate #{certificate.certificateNumber}</h4>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                          <p className="text-xs text-gray-600">
                            Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Award className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">No certificates earned yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Learning Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-eaccc-green" />
                    Learning Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Courses in Progress</span>
                      <span className="font-medium">{inProgressCourses.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg. Progress</span>
                      <span className="font-medium">
                        {enrollments && enrollments.length > 0
                          ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Hours</span>
                      <span className="font-medium">{totalLearningHours.toFixed(1)}h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/courses"}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Courses
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/profile"}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.location.href = "/help"}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Help Center
                  </Button>
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

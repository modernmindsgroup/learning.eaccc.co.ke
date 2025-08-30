import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import CourseCard from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Clock, ArrowRight } from "lucide-react";
import type { CourseWithInstructor, Enrollment } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  
  const { data: newestCourses } = useQuery<CourseWithInstructor[]>({
    queryKey: ["/api/courses/newest"],
  });

  const { data: enrollments } = useQuery<(Enrollment & { course: CourseWithInstructor })[]>({
    queryKey: ["/api/my-enrollments"],
  });

  const { data: certificates } = useQuery<any[]>({
    queryKey: ["/api/my-certificates"],
  });

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Hero Section with learner image background */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: `url('/attached_assets/generated_images/African_learners_studying_together_7d5857c2.png')`
        }}
      >
        {/* Background overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Empowering Africa Through Skills and Service Excellence
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100">
              Join thousands of learners across East Africa in developing world-class customer service and professional skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-eaccc-orange hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold"
                onClick={() => window.location.href = "/courses"}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Courses
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-eaccc-blue px-8 py-4 text-lg font-semibold"
                style={{ backgroundColor: 'transparent' }}
                onClick={() => window.location.href = "/about"}
              >
                Learn More
              </Button>
              <Button 
                className="bg-eaccc-green hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
                onClick={() => window.location.href = "/dashboard"}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Continue Learning Section */}
      {enrollments && enrollments.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Continue Learning</h2>
              <a href="/dashboard" className="text-eaccc-blue hover:text-blue-700 font-semibold">
                View All <ArrowRight className="inline w-4 h-4 ml-1" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.slice(0, 3).map((enrollment) => (
                <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <img 
                      src={enrollment.course.thumbnailUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
                      alt={enrollment.course.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold mb-2">{enrollment.course.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      by {enrollment.course.instructor?.name}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                    <Button 
                      className="w-full bg-eaccc-blue hover:bg-blue-700"
                      onClick={() => window.location.href = `/learn/${enrollment.course.id}`}
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="bg-eaccc-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Your Learning Progress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <BookOpen className="mr-2 h-6 w-6 text-eaccc-blue" />
                  Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-eaccc-blue">{enrollments?.length || 0}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Award className="mr-2 h-6 w-6 text-eaccc-green" />
                  Certificates Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-eaccc-green">{certificates?.length || 0}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Clock className="mr-2 h-6 w-6 text-eaccc-orange" />
                  Completed Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-eaccc-orange">
                  {enrollments?.filter(e => e.progress === 100).length || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newest Courses Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Explore New Courses</h2>
            <a href="/courses" className="text-eaccc-blue hover:text-blue-700 font-semibold">
              View All <ArrowRight className="inline w-4 h-4 ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newestCourses?.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

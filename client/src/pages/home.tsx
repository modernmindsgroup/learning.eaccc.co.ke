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
import { BookOpen, Award, Clock, ArrowRight, MessageSquare, Trophy, FileCheck, Calendar } from "lucide-react";
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
        className="relative bg-cover bg-center bg-no-repeat text-white overflow-hidden"
        style={{
          backgroundImage: `url('/attached_assets/generated_images/African_learners_studying_together_7d5857c2.png')`
        }}
      >
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-blue-900/70"></div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="max-w-4xl">
            <h1 className="font-heading text-5xl lg:text-7xl font-extrabold leading-tight mb-8 tracking-tight">
              <span className="block">Empowering Africa</span>
              <span className="block text-gradient bg-gradient-to-r from-white to-blue-100">Through Excellence</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-10 text-white/90 font-medium leading-relaxed max-w-3xl">
              Join thousands of learners across East Africa in developing world-class customer service and professional skills with our cutting-edge learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-5 text-lg font-bold rounded-2xl shadow-hover transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onClick={() => window.location.href = "/courses"}
              >
                <BookOpen className="mr-3 h-6 w-6" />
                Browse Courses
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white/60 text-white bg-white/10 hover:bg-white hover:text-gray-900 px-10 py-5 text-lg font-bold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onClick={() => window.location.href = "/about"}
              >
                Learn More
              </Button>
              <Button 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-5 text-lg font-bold rounded-2xl shadow-hover transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                onClick={() => window.location.href = "/dashboard"}
              >
                <BookOpen className="mr-3 h-6 w-6" />
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Continue Learning Section */}
      {enrollments && enrollments.length > 0 && (
        <section className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-heading text-4xl font-black text-gray-900 tracking-tight">Continue Learning</h2>
              <a href="/dashboard" className="group flex items-center text-eaccc-blue hover:text-blue-700 font-bold text-lg transition-all duration-300">
                View All 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enrollments.slice(0, 3).map((enrollment) => (
                <Card key={enrollment.id} className="group cursor-pointer transition-all duration-500 hover:shadow-hover hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 rounded-3xl overflow-hidden shadow-soft">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img 
                        src={enrollment.course.thumbnailUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
                        alt={enrollment.course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-bold mb-2 text-gray-900 group-hover:text-eaccc-blue transition-colors duration-300">{enrollment.course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 font-medium">
                        by {enrollment.course.instructor?.name}
                      </p>
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700">Progress</span>
                          <span className="text-sm font-bold text-eaccc-blue">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-3 bg-gray-100 rounded-full" />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        onClick={() => window.location.href = `/learn/${enrollment.course.id}`}
                      >
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl font-black text-gray-900 mb-12 text-center tracking-tight">Your Learning Progress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group text-center bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <span className="font-heading font-bold text-lg text-gray-800">Enrolled Courses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl font-black text-blue-600 group-hover:text-gradient transition-all duration-300">{enrollments?.length || 0}</p>
              </CardContent>
            </Card>

            <Card className="group text-center bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <span className="font-heading font-bold text-lg text-gray-800">Certificates Earned</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl font-black text-green-600 group-hover:text-gradient transition-all duration-300">{certificates?.length || 0}</p>
              </CardContent>
            </Card>

            <Card className="group text-center bg-white/80 backdrop-blur-sm border-0 rounded-3xl shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <span className="font-heading font-bold text-lg text-gray-800">Completed Courses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-4xl font-black text-orange-600 group-hover:text-gradient transition-all duration-300">
                  {enrollments?.filter(e => e.progress === 100).length || 0}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newest Courses Section */}
      <section className="bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-heading text-4xl font-black text-gray-900 tracking-tight">Explore New Courses</h2>
            <a href="/courses" className="group flex items-center text-eaccc-blue hover:text-blue-700 font-bold text-lg transition-all duration-300">
              View All 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newestCourses?.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Forum Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
                  alt="Professional working on laptop"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                Have a Question? <br />
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ask it in forum and get answer
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Our forums helps you to create your questions on different subjects and communicate with other forum users. Our users will help you to get the best answer!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-hover transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  onClick={() => window.location.href = "/forum/create"}
                >
                  <MessageSquare className="mr-3 h-5 w-5" />
                  Create a new topic
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-cyan-200 text-cyan-600 hover:bg-cyan-50 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:shadow-md"
                  onClick={() => window.location.href = "/forum"}
                >
                  Browse forums
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Club Points Section */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50/30 to-red-50/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="font-heading text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                <span className="text-gradient bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Win Club Points
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Use our platform and win club points according to different activities. You will be able to use your club points to get free prizes and courses. Start using the system now and collect points!
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">You earned 50 points!</p>
                    <p className="text-sm text-gray-600">For completing this course</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-hover transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  onClick={() => window.location.href = "/rewards"}
                >
                  <Trophy className="mr-3 h-5 w-5" />
                  Rewards
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 hover:shadow-md"
                  onClick={() => window.location.href = "/points"}
                >
                  Points Club
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -top-8 -right-8 w-80 h-80 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-20"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8">
                <div className="w-full h-64 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-red-400/20"></div>
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                      <Trophy className="h-12 w-12 text-white" />
                    </div>
                    {/* Floating confetti elements */}
                    <div className="absolute -top-4 -left-8 w-6 h-6 bg-pink-400 rounded transform rotate-45"></div>
                    <div className="absolute -top-8 right-4 w-4 h-4 bg-blue-400 rounded-full"></div>
                    <div className="absolute -bottom-6 -right-4 w-5 h-5 bg-green-400 rounded transform rotate-12"></div>
                    <div className="absolute -bottom-8 left-8 w-3 h-3 bg-purple-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates and Live Meeting Section */}
      <section className="bg-gradient-to-br from-purple-50/30 via-white to-blue-50/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Validate Certificates */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-2 p-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FileCheck className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <h3 className="font-heading text-2xl font-black text-gray-900">
                    <span className="text-orange-600">Validate</span><br />
                    <span className="text-gray-500">Certificates</span>
                  </h3>
                  
                  <p className="text-gray-600 font-medium leading-relaxed">
                    Verify the authenticity of certificates issued by our platform.
                  </p>
                  
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-lg"
                    onClick={() => window.location.href = "/validate-certificate"}
                  >
                    Validate Now
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Reserve Live Meeting */}
            <div className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-2 p-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <h3 className="font-heading text-2xl font-black text-gray-900">
                    <span className="text-purple-600">Reserve a</span><br />
                    <span className="text-gray-500">Live meeting</span>
                  </h3>
                  
                  <p className="text-gray-600 font-medium leading-relaxed">
                    Schedule one-on-one sessions with our expert instructors.
                  </p>
                  
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-lg"
                    onClick={() => window.location.href = "/book-meeting"}
                  >
                    Reserve Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

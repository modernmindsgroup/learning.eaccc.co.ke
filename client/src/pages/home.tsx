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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Award, Clock, ArrowRight, MessageSquare, Trophy, FileCheck, Calendar } from "lucide-react";
import type { CourseWithInstructor, Enrollment } from "@shared/schema";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  
  const { data: newestCourses } = useQuery<CourseWithInstructor[]>({
    queryKey: ["/api/courses/newest"],
  });

  const { data: enrollments } = useQuery<(Enrollment & { course: CourseWithInstructor })[]>({
    queryKey: ["/api/my-enrollments"],
    enabled: isAuthenticated,
  });

  const { data: certificates } = useQuery<any[]>({
    queryKey: ["/api/my-certificates"],
    enabled: isAuthenticated,
  });

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Hero Section with professional learner image background */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat text-white overflow-hidden"
        style={{
          backgroundImage: `url('/attached_assets/generated_images/Professional_African_learners_training_60ebf2af.png')`
        }}
      >
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-blue-900/35"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-6xl font-bold leading-tight mb-6 tracking-normal">
              Empowering Learning Through Excellence
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-white/80 font-normal leading-relaxed max-w-3xl mx-auto">
              We are dedicated to transforming the way individuals and organizations learn. Our e-learning platform offers dynamic training programs and resources designed to enhance skills, foster growth, and drive success. Join us in redefining the learning experience with our engaging content and expert-led courses that cater to all levels.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search courses, instructors and organizations..."
                  className="w-full px-6 py-4 text-gray-700 bg-white/95 backdrop-blur-sm rounded-full border-0 shadow-soft focus:outline-none focus:ring-4 focus:ring-white/30 text-base font-medium"
                />
                <Button 
                  className="absolute right-2 top-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-2 rounded-full font-semibold transition-all duration-300"
                >
                  Search
                </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-soft transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
                onClick={() => window.location.href = "/courses"}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Courses
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white/60 text-white bg-white/10 hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onClick={() => window.location.href = "/about"}
              >
                Learn More
              </Button>
              {user && (
                <Button 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-soft transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
                  onClick={() => window.location.href = "/dashboard"}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      {/* Newest Courses Section */}
      <section className="bg-gradient-to-br from-white via-purple-50/20 to-blue-50/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900 tracking-normal">Explore New Courses</h2>
            <a href="/courses" className="group flex items-center text-eaccc-blue hover:text-blue-700 font-semibold text-base transition-all duration-300">
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
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 tracking-normal leading-tight">
                Have a Question? Ask it in<br />
                forum and get answer
              </h2>
              
              <p className="text-base text-gray-500 leading-relaxed font-normal">
                Our forums helps you to create your questions on different subjects and communicate with other forum users. Our users will help you to get the best answer!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 text-base font-semibold rounded-xl shadow-soft transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  onClick={() => window.location.href = "/forum/create"}
                >
                  Create a new topic
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-cyan-200 text-cyan-600 hover:bg-cyan-50 px-6 py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-md"
                  onClick={() => window.location.href = "/forum"}
                >
                  Browse forums
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 tracking-normal leading-tight">
                Join Us Today
              </h2>
              
              <p className="text-base text-gray-500 leading-relaxed font-normal">
                Stay updated with the latest courses, learning resources, and exclusive offers from EACCC Learning. Get expert insights delivered directly to your inbox and never miss an opportunity to advance your skills.
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft">
                <div className="space-y-4">
                  <Label htmlFor="newsletter-email" className="text-gray-700 font-semibold">Email Address</Label>
                  <div className="flex space-x-3">
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-xl border-gray-200 focus:border-[#0097D7] focus:ring-[#0097D7]"
                      data-testid="input-newsletter-email"
                    />
                    <Button 
                      className="bg-[#0097D7] hover:bg-[#0085C3] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                      data-testid="button-subscribe-newsletter"
                    >
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -top-8 -right-8 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-20"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=400"
                  alt="Professional learning environment"
                  className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
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
                  <h3 className="font-heading text-xl font-bold text-gray-900">
                    <span className="text-orange-600">Validate</span><br />
                    <span className="text-gray-500">Certificates</span>
                  </h3>
                  
                  <p className="text-gray-500 font-normal leading-relaxed text-sm">
                    Verify the authenticity of certificates issued by our platform.
                  </p>
                  
                  <Button 
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg"
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
                  <h3 className="font-heading text-xl font-bold text-gray-900">
                    <span className="text-purple-600">Reserve a</span><br />
                    <span className="text-gray-500">Live meeting</span>
                  </h3>
                  
                  <p className="text-gray-500 font-normal leading-relaxed text-sm">
                    Schedule one-on-one sessions with our expert instructors.
                  </p>
                  
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg"
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

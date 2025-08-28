import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import CourseCard from "@/components/course-card";
import Testimonials from "@/components/testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight } from "lucide-react";
import type { CourseWithInstructor, BlogPost } from "@shared/schema";

export default function Landing() {
  const { data: newestCourses, isLoading: loadingNewest } = useQuery<CourseWithInstructor[]>({
    queryKey: ["/api/courses/newest"],
  });

  const { data: freeCourses, isLoading: loadingFree } = useQuery<CourseWithInstructor[]>({
    queryKey: ["/api/courses/free"],
  });

  const { data: blogPosts, isLoading: loadingBlog } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      <HeroSection />
      <StatsSection />

      {/* Newest Courses Section */}
      <section className="bg-eaccc-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Newest Courses</h2>
            <a href="/courses" className="text-eaccc-blue hover:text-blue-700 font-semibold">
              View All <ArrowRight className="inline w-4 h-4 ml-1" />
            </a>
          </div>
          
          {loadingNewest ? (
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg p-6">
                  <div className="animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {newestCourses?.map((course) => (
                <div key={course.id} className="flex-shrink-0 w-80">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Free Courses Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start your learning journey with our comprehensive free courses designed specifically for African professionals.
            </p>
          </div>
          
          {loadingFree ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="animate-pulse">
                    <div className="flex">
                      <div className="w-48 h-40 bg-gray-200 rounded-l-xl"></div>
                      <div className="flex-1 ml-6">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {freeCourses?.map((course) => (
                <Card key={course.id} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex">
                      <img 
                        src={course.thumbnailUrl || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=160"} 
                        alt={course.title}
                        className="w-48 h-40 object-cover rounded-l-xl"
                      />
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-2">
                          {course.isBestseller && (
                            <Badge className="bg-eaccc-orange text-white">BESTSELLER</Badge>
                          )}
                          {course.isFree && (
                            <Badge className="bg-eaccc-green text-white">FREE</Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">
                          by {course.instructor?.name} • {course.duration}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 text-sm">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                            <span className="text-gray-600 text-sm ml-2">({course.rating})</span>
                          </div>
                          <Button 
                            className="bg-eaccc-blue hover:bg-blue-700 text-white"
                            onClick={() => window.location.href = `/courses/${course.id}`}
                          >
                            Start Learning
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />

      {/* Blog Preview Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Insights</h2>
            <a href="#" className="text-eaccc-blue hover:text-blue-700 font-semibold">
              View All Articles <ArrowRight className="inline w-4 h-4 ml-1" />
            </a>
          </div>
          
          {loadingBlog ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <div className="animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts?.map((post) => (
                <article key={post.id} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <img 
                    src={post.thumbnailUrl || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Badge className="bg-eaccc-blue text-white">{post.category}</Badge>
                      <span className="text-gray-500 text-sm ml-3">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <a href="#" className="text-eaccc-blue hover:text-blue-700 font-semibold">
                      Read More <ArrowRight className="inline w-4 h-4 ml-1" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-eaccc-blue to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join the growing community of African professionals mastering customer service excellence. Start your learning journey today with our expert-designed courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-eaccc-orange hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = "/api/login"}
            >
              Start Learning Today
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-eaccc-blue px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = "/courses"}
            >
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

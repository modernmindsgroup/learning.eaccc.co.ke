import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Globe, BookOpen, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eaccc-blue to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About EACCC Learning Platform
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Empowering East African professionals with world-class customer service and business development skills through innovative online learning.
            </p>
            <Button 
              className="bg-eaccc-orange hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = "/courses"}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Explore Our Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-2 border-eaccc-blue/20 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-eaccc-blue mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To transform the customer service landscape across East Africa by providing accessible, 
                  high-quality training that empowers professionals to deliver exceptional customer experiences 
                  and drive business growth.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-eaccc-orange/20 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Globe className="h-8 w-8 text-eaccc-orange mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To be the leading digital learning platform in East Africa, recognized for developing 
                  world-class customer service professionals who drive economic growth and business 
                  excellence across the continent.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-eaccc-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at EACCC Learning Platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-eaccc-blue/10 rounded-full mb-6">
                  <Award className="h-8 w-8 text-eaccc-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Excellence</h3>
                <p className="text-gray-600">
                  We strive for the highest standards in everything we do, from course content 
                  to learning experiences and student support.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-eaccc-orange/10 rounded-full mb-6">
                  <Users className="h-8 w-8 text-eaccc-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-gray-600">
                  We believe in building strong, supportive learning communities that foster 
                  collaboration and shared growth across East Africa.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-eaccc-green/10 rounded-full mb-6">
                  <Heart className="h-8 w-8 text-eaccc-green" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Impact</h3>
                <p className="text-gray-600">
                  We measure our success by the positive impact our learners create in their 
                  organizations and communities across the region.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover why thousands of East African professionals choose EACCC Learning Platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <Badge className="bg-eaccc-blue text-white mr-4 mt-1">01</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">African Context & Culture</h3>
                    <p className="text-gray-600">
                      Our courses are specifically designed for the East African market, incorporating 
                      local business practices, cultural nuances, and real-world scenarios.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Badge className="bg-eaccc-orange text-white mr-4 mt-1">02</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expert African Instructors</h3>
                    <p className="text-gray-600">
                      Learn from seasoned professionals who understand the unique challenges and 
                      opportunities in East African business environments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Badge className="bg-eaccc-green text-white mr-4 mt-1">03</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Practical, Job-Ready Skills</h3>
                    <p className="text-gray-600">
                      Every course focuses on immediately applicable skills that you can use 
                      in your current role to drive results and advance your career.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Badge className="bg-eaccc-blue text-white mr-4 mt-1">04</Badge>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Affordable & Accessible</h3>
                    <p className="text-gray-600">
                      High-quality professional development shouldn't be a luxury. We offer 
                      competitive pricing and free courses to make learning accessible to all.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:text-center">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Team collaboration" 
                className="rounded-xl shadow-lg w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-eaccc-blue to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-blue-100">
              Growing stronger together across East Africa
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Industry Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who are transforming their careers and organizations 
            through our comprehensive learning platform.
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
              className="border-2 border-eaccc-blue text-eaccc-blue hover:bg-eaccc-blue hover:text-white px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = "/contact"}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
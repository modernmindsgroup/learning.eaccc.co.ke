import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Star, Users } from "lucide-react";
import type { Instructor } from "@shared/schema";

export default function Instructors() {
  const { data: instructors, isLoading } = useQuery<Instructor[]>({
    queryKey: ["/api/instructors"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-eaccc-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eaccc-blue to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Meet Our Expert Instructors</h1>
          <p className="text-xl text-blue-100">
            Learn from industry professionals with years of experience in customer service, 
            business development, and leadership in the East African market.
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {instructors && instructors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((instructor) => (
                <Card key={instructor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={instructor.profileImage} alt={instructor.name} />
                        <AvatarFallback className="text-lg">
                          {instructor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-xl mb-2">{instructor.name}</CardTitle>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{instructor.email}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {instructor.bio}
                    </p>
                    
                    {instructor.expertise && instructor.expertise.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {instructor.expertise.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <Button 
                        className="w-full bg-eaccc-blue hover:bg-blue-700"
                        onClick={() => window.location.href = `/courses?instructor=${instructor.id}`}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        View Courses
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="mx-auto h-24 w-24 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Instructors Found</h3>
              <p className="text-gray-500">Check back later for our expert instructors.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users } from "lucide-react";
import type { CourseWithInstructor } from "@shared/schema";

interface CourseCardProps {
  course: CourseWithInstructor;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative">
        <img
          src={course.thumbnailUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          {course.isFree && (
            <Badge className="bg-eaccc-green text-white font-semibold">FREE</Badge>
          )}
          {course.isBestseller && (
            <Badge className="bg-eaccc-orange text-white font-semibold">BESTSELLER</Badge>
          )}
          {course.isFeatured && (
            <Badge className="bg-blue-600 text-white font-semibold">FEATURED</Badge>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {course.duration}
          </span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm">
            by {course.instructor?.name || "Unknown Instructor"}
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(parseFloat(course.rating) || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">
              ({parseFloat(course.rating).toFixed(1)})
            </span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="w-4 h-4 mr-1" />
            {course.enrollmentCount}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-eaccc-blue">
            {course.isFree ? "FREE" : `$${course.price}`}
          </div>
          <Button
            className="bg-eaccc-blue hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            onClick={() => window.location.href = `/courses/${course.id}`}
          >
            {course.isFree ? "Enroll Now" : "View Course"}
          </Button>
        </div>

        {/* Course features */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {course.duration}
            </div>
            {course.hasCertificate && (
              <span className="text-eaccc-green font-medium">Certificate included</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

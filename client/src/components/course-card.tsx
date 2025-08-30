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
    <Card className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-3 overflow-hidden border-0">
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnailUrl || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
          alt={course.title}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 left-4 flex space-x-2">
          {course.isFree && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">FREE</Badge>
          )}
          {course.isBestseller && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">BESTSELLER</Badge>
          )}
          {course.isFeatured && (
            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">FEATURED</Badge>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-semibold">
            {course.duration}
          </span>
        </div>
      </div>
      
      <CardContent className="p-7">
        <div className="mb-4">
          <h3 className="font-heading text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-eaccc-blue transition-colors duration-300">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm font-medium">
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
                    i < Math.floor(parseFloat(course.rating || "0") || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">
              ({parseFloat(course.rating || "0").toFixed(1)})
            </span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Users className="w-4 h-4 mr-1" />
            {course.enrollmentCount}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="font-heading text-3xl font-black text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
            {course.isFree ? "FREE" : `$${course.price}`}
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            onClick={() => window.location.href = `/courses/${course.id}`}
          >
            {course.isFree ? "Enroll Now" : "View Course"}
          </Button>
        </div>

        {/* Course features */}
        <div className="mt-6 pt-4 border-t border-gray-100/60">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 font-medium">
              <Clock className="w-4 h-4 mr-2" />
              {course.duration}
            </div>
            {course.hasCertificate && (
              <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">Certificate included</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

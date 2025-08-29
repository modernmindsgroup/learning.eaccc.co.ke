import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BookOpen, 
  Users, 
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Award,
  GraduationCap
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { Course, User } from "@shared/schema";

interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  avgRating: number;
}

interface CourseAnalytics {
  courseId: number;
  title: string;
  enrollments: number;
  completions: number;
  revenue: number;
  rating: number;
}

interface StudentProgress {
  userId: string;
  studentName: string;
  courseTitle: string;
  progress: number;
  enrolledAt: string;
  lastActive: string;
}

export default function InstructorDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is instructor or admin
  if (!isAuthenticated || !["instructor", "admin"].includes(user?.role || "")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <GraduationCap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">
              You don't have permission to access the instructor dashboard.
            </p>
            <Button 
              className="mt-4"
              onClick={() => window.location.href = "/"}
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch instructor data
  const { data: stats } = useQuery<InstructorStats>({
    queryKey: ["/api/instructor/stats"],
  });

  const { data: myCourses } = useQuery<Course[]>({
    queryKey: ["/api/instructor/courses"],
  });

  const { data: analytics } = useQuery<CourseAnalytics[]>({
    queryKey: ["/api/instructor/analytics"],
  });

  const { data: studentProgress } = useQuery<StudentProgress[]>({
    queryKey: ["/api/instructor/students"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">My Courses</p>
                      <p className="text-3xl font-bold text-[#0097D7]">{stats?.totalCourses || 0}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-[#0097D7]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-3xl font-bold text-[#F7941D]">{stats?.totalStudents || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-[#F7941D]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-3xl font-bold text-[#34A853]">${stats?.totalRevenue || 0}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[#34A853]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {stats?.avgRating ? stats.avgRating.toFixed(1) : "0.0"}
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Student Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentProgress?.slice(0, 5).map((progress, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{progress.studentName}</p>
                        <p className="text-sm text-gray-600">{progress.courseTitle}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-24">
                          <Progress value={progress.progress} className="h-2" />
                        </div>
                        <span className="text-sm font-medium">{progress.progress}%</span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No student progress data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">My Courses</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses?.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant={course.isFree ? "secondary" : "default"}>
                        {course.isFree ? "Free" : `$${course.price}`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{course.enrollmentCount} students</span>
                      <span>★ {course.rating}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start creating your first course to share your knowledge with students.
                    </p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Course
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentProgress?.map((progress, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{progress.studentName}</TableCell>
                        <TableCell>{progress.courseTitle}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={progress.progress} className="w-16 h-2" />
                            <span className="text-sm">{progress.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(progress.enrolledAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(progress.lastActive).toLocaleDateString()}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No student data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Completions</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics?.map((course) => (
                      <TableRow key={course.courseId}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.enrollments}</TableCell>
                        <TableCell>{course.completions}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={course.enrollments > 0 ? (course.completions / course.enrollments) * 100 : 0} 
                              className="w-16 h-2" 
                            />
                            <span className="text-sm">
                              {course.enrollments > 0 ? Math.round((course.completions / course.enrollments) * 100) : 0}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>${course.revenue}</TableCell>
                        <TableCell>★ {course.rating.toFixed(1)}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No analytics data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Crown,
  GraduationCap
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { User, Course, Instructor } from "@shared/schema";

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalInstructors: number;
  totalRevenue: number;
  recentEnrollments: number;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateInstructorOpen, setIsCreateInstructorOpen] = useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);

  // Redirect to admin login if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, user?.role, isLoading, setLocation]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authorized (will redirect)
  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  // Fetch dashboard data
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/admin/courses"],
  });

  const { data: instructors } = useQuery<Instructor[]>({
    queryKey: ["/api/admin/instructors"],
  });

  // Create instructor mutation
  const createInstructorMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/admin/instructors", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Instructor created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/instructors"] });
      setIsCreateInstructorOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create instructor",
        variant: "destructive",
      });
    },
  });

  // Role update mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await apiRequest("PUT", `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your learning platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-[#0097D7]">{stats?.totalUsers || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-[#0097D7]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Courses</p>
                      <p className="text-3xl font-bold text-[#F7941D]">{stats?.totalCourses || 0}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-[#F7941D]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Instructors</p>
                      <p className="text-3xl font-bold text-[#34A853]">{stats?.totalInstructors || 0}</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-[#34A853]" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-3xl font-bold text-green-600">${stats?.totalRevenue || 0}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin" 
                                ? "destructive" 
                                : user.role === "instructor" 
                                ? "default" 
                                : "secondary"
                            }
                          >
                            {user.role || "student"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role || "student"}
                            onValueChange={(role) => updateUserRoleMutation.mutate({ userId: user.id, role })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="instructor">Instructor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Course Management</h2>
              <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="course-title">Course Title</Label>
                      <Input id="course-title" placeholder="Enter course title" />
                    </div>
                    <div>
                      <Label htmlFor="course-description">Description</Label>
                      <Textarea id="course-description" placeholder="Enter course description" />
                    </div>
                    <div>
                      <Label htmlFor="course-instructor">Instructor</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select instructor" />
                        </SelectTrigger>
                        <SelectContent>
                          {instructors?.map((instructor) => (
                            <SelectItem key={instructor.id} value={instructor.id.toString()}>
                              {instructor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Create Course</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses?.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>Instructor {course.instructorId}</TableCell>
                        <TableCell>${course.price}</TableCell>
                        <TableCell>{course.enrollmentCount}</TableCell>
                        <TableCell>
                          <Badge variant={course.isFree ? "secondary" : "default"}>
                            {course.isFree ? "Free" : "Paid"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instructors Tab */}
          <TabsContent value="instructors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Instructor Management</h2>
              <Dialog open={isCreateInstructorOpen} onOpenChange={setIsCreateInstructorOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Instructor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Instructor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="instructor-name">Name</Label>
                      <Input id="instructor-name" placeholder="Enter instructor name" />
                    </div>
                    <div>
                      <Label htmlFor="instructor-email">Email</Label>
                      <Input id="instructor-email" type="email" placeholder="Enter instructor email" />
                    </div>
                    <div>
                      <Label htmlFor="instructor-bio">Bio</Label>
                      <Textarea id="instructor-bio" placeholder="Enter instructor bio" />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        // This would be implemented with form handling
                        toast({
                          title: "Feature Coming Soon",
                          description: "Instructor creation form will be implemented",
                        });
                      }}
                    >
                      Create Instructor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {instructors?.map((instructor) => (
                      <TableRow key={instructor.id}>
                        <TableCell className="font-medium">{instructor.name}</TableCell>
                        <TableCell>{instructor.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {courses?.filter(c => c.instructorId === instructor.id).length || 0} courses
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {instructor.createdAt ? new Date(instructor.createdAt).toLocaleDateString() : "Unknown"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
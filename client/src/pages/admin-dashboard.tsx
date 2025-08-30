import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAdminAuth } from "@/hooks/useAdminAuth";
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
  GraduationCap,
  Settings
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
  // ALL HOOKS MUST BE CALLED FIRST - before any conditional logic
  const { isAuthenticated, isLoading, username } = useAdminAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateInstructorOpen, setIsCreateInstructorOpen] = useState(false);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    instructorId: "",
    price: "",
    category: "",
    duration: "",
    level: "Beginner",
    thumbnailUrl: "",
    hasQuiz: false,
    hasCertificate: true,
    isFeatured: false,
    isBestseller: false
  });
  const [instructorForm, setInstructorForm] = useState({
    name: "",
    email: "",
    bio: "",
    expertise: ""
  });

  // Fetch dashboard data (call hooks before any conditional returns)
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated,
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/admin/courses"],
    enabled: isAuthenticated,
  });

  const { data: instructors } = useQuery<Instructor[]>({
    queryKey: ["/api/admin/instructors"],
    enabled: isAuthenticated,
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/courses", data);
      return await response.json();
    },
    onSuccess: (course: Course) => {
      toast({
        title: "Success",
        description: "Course created successfully! Opening Course Builder...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      resetCourseForm();
      setIsCreateCourseOpen(false);
      // Navigate to Course Builder for the newly created course
      setLocation(`/admin/course-builder/${course.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      await apiRequest("PUT", `/api/admin/courses/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Course updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      resetCourseForm();
      setIsEditCourseOpen(false);
      setEditingCourse(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive",
      });
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      await apiRequest("DELETE", `/api/admin/courses/${courseId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Course deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      });
    },
  });

  const resetCourseForm = () => {
    setCourseForm({
      title: "",
      description: "",
      instructorId: "",
      price: "",
      category: "",
      duration: "",
      level: "Beginner",
      thumbnailUrl: "",
      hasQuiz: false,
      hasCertificate: true,
      isFeatured: false,
      isBestseller: false
    });
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description || "",
      instructorId: course.instructorId?.toString() || "",
      price: course.price || "0",
      category: course.category || "",
      duration: course.duration || "",
      level: course.level || "Beginner",
      thumbnailUrl: course.thumbnailUrl || "",
      hasQuiz: course.hasQuiz || false,
      hasCertificate: course.hasCertificate || true,
      isFeatured: course.isFeatured || false,
      isBestseller: course.isBestseller || false
    });
    setIsEditCourseOpen(true);
  };

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
      setInstructorForm({ name: "", email: "", bio: "", expertise: "" });
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

  // Admin logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "Successfully logged out of admin portal",
      });
      setLocation("/admin/login");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to logout",
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

  // Redirect to admin login if not authenticated (AFTER all hooks are called)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

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
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your learning platform - Welcome {username}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="course-title">Course Title *</Label>
                        <Input 
                          id="course-title" 
                          placeholder="Enter course title"
                          value={courseForm.title}
                          onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-duration">Duration</Label>
                        <Input 
                          id="course-duration" 
                          placeholder="e.g., 2:30 Hours"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="course-description">Description *</Label>
                      <Textarea 
                        id="course-description" 
                        placeholder="Enter course description"
                        value={courseForm.description}
                        rows={3}
                        onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="course-category">Category *</Label>
                        <Select 
                          value={courseForm.category}
                          onValueChange={(value) => setCourseForm({...courseForm, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer-service">Customer Service</SelectItem>
                            <SelectItem value="leadership">Leadership</SelectItem>
                            <SelectItem value="business-development">Business Development</SelectItem>
                            <SelectItem value="communication">Communication</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="course-level">Level</Label>
                        <Select 
                          value={courseForm.level}
                          onValueChange={(value) => setCourseForm({...courseForm, level: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="course-price">Price (USD)</Label>
                        <Input 
                          id="course-price" 
                          type="number"
                          step="0.01"
                          placeholder="0 for free course"
                          value={courseForm.price}
                          onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="course-instructor">Instructor *</Label>
                        <Select 
                          value={courseForm.instructorId}
                          onValueChange={(value) => setCourseForm({...courseForm, instructorId: value})}
                        >
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
                    </div>
                    
                    <div>
                      <Label htmlFor="course-thumbnail">Thumbnail URL</Label>
                      <Input 
                        id="course-thumbnail" 
                        placeholder="https://example.com/image.jpg"
                        value={courseForm.thumbnailUrl}
                        onChange={(e) => setCourseForm({...courseForm, thumbnailUrl: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Course Features</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            id="has-quiz"
                            checked={courseForm.hasQuiz}
                            onChange={(e) => setCourseForm({...courseForm, hasQuiz: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="has-quiz">Has Quiz</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            id="has-certificate"
                            checked={courseForm.hasCertificate}
                            onChange={(e) => setCourseForm({...courseForm, hasCertificate: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="has-certificate">Has Certificate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            id="is-featured"
                            checked={courseForm.isFeatured}
                            onChange={(e) => setCourseForm({...courseForm, isFeatured: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="is-featured">Featured Course</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            id="is-bestseller"
                            checked={courseForm.isBestseller}
                            onChange={(e) => setCourseForm({...courseForm, isBestseller: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="is-bestseller">Bestseller</Label>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (!courseForm.title || !courseForm.description || !courseForm.instructorId || !courseForm.category) {
                          toast({
                            title: "Missing Information",
                            description: "Please fill in all required fields",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        const priceValue = parseFloat(courseForm.price) || 0;
                        createCourseMutation.mutate({
                          title: courseForm.title,
                          description: courseForm.description,
                          instructorId: parseInt(courseForm.instructorId),
                          price: priceValue.toFixed(2),
                          category: courseForm.category,
                          duration: courseForm.duration,
                          level: courseForm.level,
                          thumbnailUrl: courseForm.thumbnailUrl,
                          isFree: priceValue === 0,
                          hasQuiz: courseForm.hasQuiz,
                          hasCertificate: courseForm.hasCertificate,
                          isFeatured: courseForm.isFeatured,
                          isBestseller: courseForm.isBestseller
                        });
                      }}
                      disabled={createCourseMutation.isPending}
                    >
                      {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Edit Course Dialog */}
              <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-course-title">Course Title *</Label>
                        <Input 
                          id="edit-course-title" 
                          placeholder="Enter course title"
                          value={courseForm.title}
                          onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-course-duration">Duration</Label>
                        <Input 
                          id="edit-course-duration" 
                          placeholder="e.g., 2:30 Hours"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-course-description">Description *</Label>
                      <Textarea 
                        id="edit-course-description" 
                        placeholder="Enter course description"
                        value={courseForm.description}
                        rows={3}
                        onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-course-category">Category *</Label>
                        <Select 
                          value={courseForm.category}
                          onValueChange={(value) => setCourseForm({...courseForm, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer-service">Customer Service</SelectItem>
                            <SelectItem value="leadership">Leadership</SelectItem>
                            <SelectItem value="business-development">Business Development</SelectItem>
                            <SelectItem value="communication">Communication</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-course-level">Level</Label>
                        <Select 
                          value={courseForm.level}
                          onValueChange={(value) => setCourseForm({...courseForm, level: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-course-price">Price (USD)</Label>
                        <Input 
                          id="edit-course-price" 
                          type="number"
                          step="0.01"
                          placeholder="0 for free course"
                          value={courseForm.price}
                          onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-course-instructor">Instructor *</Label>
                        <Select 
                          value={courseForm.instructorId}
                          onValueChange={(value) => setCourseForm({...courseForm, instructorId: value})}
                        >
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
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-course-thumbnail">Thumbnail URL</Label>
                      <Input 
                        id="edit-course-thumbnail" 
                        placeholder="https://example.com/image.jpg"
                        value={courseForm.thumbnailUrl}
                        onChange={(e) => setCourseForm({...courseForm, thumbnailUrl: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Course Features</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            id="edit-has-quiz"
                            checked={courseForm.hasQuiz}
                            onChange={(e) => setCourseForm({...courseForm, hasQuiz: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="edit-has-quiz">Has Quiz</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            id="edit-has-certificate"
                            checked={courseForm.hasCertificate}
                            onChange={(e) => setCourseForm({...courseForm, hasCertificate: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="edit-has-certificate">Has Certificate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            id="edit-is-featured"
                            checked={courseForm.isFeatured}
                            onChange={(e) => setCourseForm({...courseForm, isFeatured: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="edit-is-featured">Featured Course</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox"
                            id="edit-is-bestseller"
                            checked={courseForm.isBestseller}
                            onChange={(e) => setCourseForm({...courseForm, isBestseller: e.target.checked})}
                            className="rounded"
                          />
                          <Label htmlFor="edit-is-bestseller">Bestseller</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (!courseForm.title || !courseForm.description || !courseForm.instructorId || !courseForm.category) {
                          toast({
                            title: "Missing Information",
                            description: "Please fill in all required fields",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        const priceValue = parseFloat(courseForm.price) || 0;
                        if (editingCourse) {
                          updateCourseMutation.mutate({
                            id: editingCourse.id,
                            data: {
                              title: courseForm.title,
                              description: courseForm.description,
                              instructorId: parseInt(courseForm.instructorId),
                              price: priceValue.toFixed(2),
                              category: courseForm.category,
                              duration: courseForm.duration,
                              level: courseForm.level,
                              thumbnailUrl: courseForm.thumbnailUrl,
                              isFree: priceValue === 0,
                              hasQuiz: courseForm.hasQuiz,
                              hasCertificate: courseForm.hasCertificate,
                              isFeatured: courseForm.isFeatured,
                              isBestseller: courseForm.isBestseller
                            }
                          });
                        }
                      }}
                      disabled={updateCourseMutation.isPending}
                    >
                      {updateCourseMutation.isPending ? "Updating..." : "Update Course"}
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setLocation(`/admin/course-builder/${course.id}`)}
                              data-testid={`button-course-builder-${course.id}`}
                              title="Course Builder"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditCourse(course)}
                              data-testid={`button-edit-course-${course.id}`}
                              title="Edit Course"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteCourseMutation.mutate(course.id)}
                              data-testid={`button-delete-course-${course.id}`}
                              title="Delete Course"
                            >
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
                      <Input 
                        id="instructor-name" 
                        placeholder="Enter instructor name"
                        value={instructorForm.name}
                        onChange={(e) => setInstructorForm({...instructorForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor-email">Email</Label>
                      <Input 
                        id="instructor-email" 
                        type="email" 
                        placeholder="Enter instructor email"
                        value={instructorForm.email}
                        onChange={(e) => setInstructorForm({...instructorForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor-expertise">Expertise</Label>
                      <Input 
                        id="instructor-expertise" 
                        placeholder="e.g., Customer Service, Leadership (comma-separated)"
                        value={instructorForm.expertise}
                        onChange={(e) => setInstructorForm({...instructorForm, expertise: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructor-bio">Bio</Label>
                      <Textarea 
                        id="instructor-bio" 
                        placeholder="Enter instructor bio"
                        value={instructorForm.bio}
                        onChange={(e) => setInstructorForm({...instructorForm, bio: e.target.value})}
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (!instructorForm.name || !instructorForm.email || !instructorForm.expertise) {
                          toast({
                            title: "Missing Information",
                            description: "Please fill in all required fields",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        createInstructorMutation.mutate({
                          name: instructorForm.name,
                          email: instructorForm.email,
                          expertise: instructorForm.expertise.split(",").map(s => s.trim()).filter(s => s.length > 0),
                          bio: instructorForm.bio
                        });
                      }}
                      disabled={createInstructorMutation.isPending}
                    >
                      {createInstructorMutation.isPending ? "Creating..." : "Create Instructor"}
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
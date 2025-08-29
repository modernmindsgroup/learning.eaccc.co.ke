import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function InstructorLogin() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in as instructor or admin
  if (isAuthenticated && (user?.role === "instructor" || user?.role === "admin")) {
    setLocation("/instructor");
    return null;
  }

  // Demo instructor credentials
  const INSTRUCTOR_CREDENTIALS = [
    { username: "sarah.johnson@eaccc.com", password: "instructor123" },
    { username: "michael.thompson@eaccc.com", password: "instructor123" },
    { username: "priya.patel@eaccc.com", password: "instructor123" },
    { username: "james.wilson@eaccc.com", password: "instructor123" }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check credentials
      const validCredentials = INSTRUCTOR_CREDENTIALS.find(
        cred => cred.username === credentials.username && cred.password === credentials.password
      );

      if (validCredentials) {
        toast({
          title: "Instructor Access Verified",
          description: "Redirecting to secure login...",
        });
        
        // Use the main Replit auth system but redirect to instructor after
        sessionStorage.setItem('instructor_login_redirect', 'true');
        window.location.href = "/api/login";
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Please check your username and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Instructor Portal
          </CardTitle>
          <p className="text-gray-600 mt-2">
            EACCC Learning Platform for Instructors
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Instructor Email</Label>
              <Input
                id="username"
                type="email"
                placeholder="instructor@eaccc.com"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                data-testid="input-instructor-username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  data-testid="input-instructor-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700" 
              disabled={isLoading}
              data-testid="button-instructor-login"
            >
              {isLoading ? "Verifying..." : "Access Instructor Portal"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Demo Access:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Sarah Johnson:</strong> sarah.johnson@eaccc.com</p>
              <p><strong>Michael Thompson:</strong> michael.thompson@eaccc.com</p>
              <p><strong>Password for all:</strong> instructor123</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/")}
              data-testid="button-back-home"
            >
              ← Back to Main Site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
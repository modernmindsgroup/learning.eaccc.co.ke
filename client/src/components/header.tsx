import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Menu, X, GraduationCap, User, LogOut } from "lucide-react";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchValue)}`;
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    ...(isAuthenticated ? [{ name: "Dashboard", href: "/dashboard" }] : []),
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center">
              <img 
                src="/attached_assets/East Africa_1756481469423.png" 
                alt="EACCC - East Africa Customer Care Center Ltd" 
                className="h-24 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = window.location.pathname === item.href || 
                (item.href === "/" && window.location.pathname === "/");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`pb-4 transition-colors ${
                    isActive
                      ? "text-eaccc-blue font-medium border-b-2 border-eaccc-blue"
                      : "text-gray-600 hover:text-eaccc-blue"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eaccc-blue focus:border-transparent"
                />
              </div>
            </form>

            {/* Currency Selector */}
            <Select defaultValue="KES">
              <SelectTrigger className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-eaccc-blue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KES">KES</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>

            {/* Auth Section */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || ""} />
                      <AvatarFallback>
                        {(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => window.location.href = "/admin"}>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  {(user?.role === "instructor" || user?.role === "admin") && (
                    <DropdownMenuItem onClick={() => window.location.href = "/instructor"}>
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Instructor Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => window.location.href = "/api/logout"}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="hidden md:block text-eaccc-blue hover:bg-eaccc-blue hover:text-white border-eaccc-blue"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Login
                </Button>
                <Button
                  className="bg-eaccc-orange hover:bg-orange-600 text-white"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Register
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-2"
                />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-600 hover:text-eaccc-blue hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Mobile Auth */}
              {!isAuthenticated && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full text-eaccc-blue border-eaccc-blue"
                    onClick={() => window.location.href = "/api/login"}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full bg-eaccc-orange hover:bg-orange-600 text-white"
                    onClick={() => window.location.href = "/api/login"}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

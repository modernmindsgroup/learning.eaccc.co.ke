import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, X, GraduationCap, User, LogOut, Phone, Mail } from "lucide-react";

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to hide/show top bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className="sticky top-0 z-50">
      {/* Top Bar - Disappears on scroll */}
      <div className={`bg-gradient-to-r from-[#0097D7]/5 via-white/95 to-[#F7941D]/5 glass-effect border-b border-[#0097D7]/10 transition-all duration-300 ${
        isScrolled ? 'transform -translate-y-full opacity-0 h-0' : 'h-auto'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm font-medium">
            {/* Contact Info */}
            <div className="hidden md:flex items-center space-x-6 text-gray-700">
              <div className="flex items-center space-x-2 hover:text-[#0097D7] transition-colors duration-200">
                <Phone className="h-3.5 w-3.5 text-[#0097D7]" />
                <span className="font-inter font-medium">(254) 540-999</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-[#0097D7] transition-colors duration-200">
                <Mail className="h-3.5 w-3.5 text-[#0097D7]" />
                <span className="font-inter font-medium">learning@eaccc.co.ke</span>
              </div>
            </div>

            {/* Top Right - Search and Currency */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex relative">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3 w-3 text-[#0097D7]/60" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-48 h-8 pl-8 pr-4 py-1 text-xs font-inter bg-white/80 backdrop-blur-sm border border-[#0097D7]/20 rounded-lg focus:ring-2 focus:ring-[#0097D7]/30 focus:border-[#0097D7] transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                </div>
              </form>

              {/* Currency Selector */}
              <Select defaultValue="KES">
                <SelectTrigger className="w-16 h-8 bg-white/80 backdrop-blur-sm border border-[#0097D7]/20 rounded-lg px-2 py-1 text-xs font-inter font-medium focus:ring-2 focus:ring-[#0097D7]/30 hover:shadow-md transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border border-[#0097D7]/20">
                  <SelectItem value="KES" className="font-inter">KES</SelectItem>
                  <SelectItem value="USD" className="font-inter">USD</SelectItem>
                </SelectContent>
              </Select>

              {/* Top Auth Buttons */}
              {!isAuthenticated && (
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs font-inter font-medium text-gray-700 hover:text-[#0097D7] hover:bg-[#0097D7]/5 transition-all duration-200"
                    onClick={() => (window.location.href = "/api/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs font-inter font-medium text-gray-700 hover:text-[#F7941D] hover:bg-[#F7941D]/5 transition-all duration-200"
                    onClick={() => (window.location.href = "/api/login")}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Always visible */}
      <div className="bg-white/95 backdrop-blur-lg shadow-soft border-b border-[#0097D7]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center hover:opacity-90 transition-opacity duration-200">
                <img
                  src="/attached_assets/East Africa_1756481469423.png"
                  alt="EACCC - East Africa Customer Care Center Ltd"
                  className="h-40 w-auto"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive =
                  window.location.pathname === item.href ||
                  (item.href === "/" && window.location.pathname === "/");
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`pb-4 font-poppins font-medium transition-all duration-200 relative group ${
                      isActive
                        ? "text-[#0097D7] border-b-2 border-[#0097D7] shadow-sm"
                        : "text-gray-700 hover:text-[#0097D7]"
                    }`}
                  >
                    {item.name}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0097D7] to-[#F7941D] transition-all duration-300 group-hover:w-full"></span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Start Learning Button or User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:bg-[#0097D7]/5 transition-all duration-200 hover:shadow-md"
                    >
                      <Avatar className="h-9 w-9 ring-2 ring-[#0097D7]/20 ring-offset-2">
                        <AvatarImage
                          src={user?.profileImageUrl || undefined}
                          alt={user?.firstName || ""}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-[#0097D7] to-blue-600 text-white font-poppins font-semibold">
                          {(user?.firstName?.[0] || "") +
                            (user?.lastName?.[0] || "")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white/95 backdrop-blur-md border border-[#0097D7]/20 shadow-lg" align="end" forceMount>
                    <DropdownMenuItem
                      onClick={() => (window.location.href = "/dashboard")}
                      className="font-inter hover:bg-[#0097D7]/5 focus:bg-[#0097D7]/5"
                    >
                      <User className="mr-2 h-4 w-4 text-[#0097D7]" />
                      Dashboard
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem
                        onClick={() => (window.location.href = "/admin")}
                        className="font-inter hover:bg-[#0097D7]/5 focus:bg-[#0097D7]/5"
                      >
                        <GraduationCap className="mr-2 h-4 w-4 text-[#0097D7]" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    {(user?.role === "instructor" || user?.role === "admin") && (
                      <DropdownMenuItem
                        onClick={() => (window.location.href = "/instructor")}
                        className="font-inter hover:bg-[#0097D7]/5 focus:bg-[#0097D7]/5"
                      >
                        <GraduationCap className="mr-2 h-4 w-4 text-[#0097D7]" />
                        Instructor Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => (window.location.href = "/api/logout")}
                      className="font-inter hover:bg-red-50 focus:bg-red-50 text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  className="bg-gradient-to-r from-[#0097D7] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-poppins font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 shadow-md"
                  onClick={() => (window.location.href = "/api/login")}
                >
                  Start Learning
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                className="md:hidden p-2 text-gray-600 hover:text-[#0097D7] hover:bg-[#0097D7]/5 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-[#0097D7]/10 py-4 bg-white/95 backdrop-blur-md">
              <div className="space-y-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[#0097D7]/60" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 font-inter bg-white/80 border border-[#0097D7]/20 rounded-lg focus:ring-2 focus:ring-[#0097D7]/30 focus:border-[#0097D7]"
                  />
                </form>

                {/* Mobile Navigation */}
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const isActive =
                      window.location.pathname === item.href ||
                      (item.href === "/" && window.location.pathname === "/");
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`block px-4 py-3 rounded-lg font-poppins font-medium transition-all duration-200 ${
                          isActive
                            ? "text-[#0097D7] bg-[#0097D7]/5 border-l-4 border-[#0097D7]"
                            : "text-gray-700 hover:text-[#0097D7] hover:bg-[#0097D7]/5"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    );
                  })}
                </nav>

                {/* Mobile Auth */}
                {!isAuthenticated && (
                  <div className="space-y-3 pt-4 border-t border-[#0097D7]/10">
                    <Button
                      variant="outline"
                      className="w-full text-[#0097D7] border-[#0097D7]/30 hover:bg-[#0097D7]/5 font-poppins font-medium rounded-lg transition-all duration-200"
                      onClick={() => (window.location.href = "/api/login")}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-[#F7941D] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-poppins font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                      onClick={() => (window.location.href = "/api/login")}
                    >
                      Start Learning
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

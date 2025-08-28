import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { CourseWithInstructor } from "@shared/schema";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>();
  const [isFree, setIsFree] = useState<boolean>();
  const [hasQuiz, setHasQuiz] = useState<boolean>();
  const [hasCertificate, setHasCertificate] = useState<boolean>();
  const [isFeatured, setIsFeatured] = useState<boolean>();
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: courses, isLoading } = useQuery<CourseWithInstructor[]>({
    queryKey: ["/api/courses", { search, category, isFree, hasQuiz, hasCertificate, isFeatured, sortBy }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category && category !== "all") params.append("category", category);
      if (isFree !== undefined) params.append("isFree", isFree.toString());
      if (hasQuiz !== undefined) params.append("hasQuiz", hasQuiz.toString());
      if (hasCertificate !== undefined) params.append("hasCertificate", hasCertificate.toString());
      if (isFeatured !== undefined) params.append("isFeatured", isFeatured.toString());
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(`/api/courses?${params}`);
      return response.json();
    },
  });

  const categories = ["Customer Service", "Business Development", "Professional Skills", "Leadership"];

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-eaccc-blue to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">All Courses</h1>
          <p className="text-xl text-blue-100">
            Discover our comprehensive collection of professional development courses
          </p>
        </div>
      </section>

      {/* Course Browser */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <Card>
                <CardHeader>
                  <CardTitle>Filter Courses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="free"
                          checked={isFree === true}
                          onCheckedChange={(checked) => setIsFree(checked ? true : undefined)}
                        />
                        <label htmlFor="free" className="text-sm">Free</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="paid"
                          checked={isFree === false}
                          onCheckedChange={(checked) => setIsFree(checked ? false : undefined)}
                        />
                        <label htmlFor="paid" className="text-sm">Paid</label>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Features</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="certificate"
                          checked={hasCertificate === true}
                          onCheckedChange={(checked) => setHasCertificate(checked ? true : undefined)}
                        />
                        <label htmlFor="certificate" className="text-sm">Certificate Included</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="quiz"
                          checked={hasQuiz === true}
                          onCheckedChange={(checked) => setHasQuiz(checked ? true : undefined)}
                        />
                        <label htmlFor="quiz" className="text-sm">Has Quiz</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={isFeatured === true}
                          onCheckedChange={(checked) => setIsFeatured(checked ? true : undefined)}
                        />
                        <label htmlFor="featured" className="text-sm">Featured</label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course Grid */}
            <div className="lg:w-3/4">
              
              {/* Sorting */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {courses ? `${courses.length} courses found` : 'Loading...'}
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="priceLowHigh">Price: Low to High</SelectItem>
                    <SelectItem value="priceHighLow">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Course Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                      <div className="animate-pulse">
                        <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses?.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}

              {courses && courses.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No courses found matching your criteria.</p>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

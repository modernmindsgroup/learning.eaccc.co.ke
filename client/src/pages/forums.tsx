import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Users, 
  Star, 
  Search, 
  Plus, 
  Clock,
  Eye,
  MessageSquare,
  TrendingUp,
  Bookmark,
  ThumbsUp
} from "lucide-react";

export default function Forums() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock forum data - in a real app, this would come from an API
  const forumCategories = [
    {
      id: 1,
      title: "Customer Service Excellence",
      description: "Discuss best practices, share experiences, and get advice on delivering exceptional customer service.",
      topics: 145,
      posts: 892,
      lastActivity: "2 minutes ago",
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Business Development",
      description: "Share strategies, discuss market trends, and collaborate on business growth initiatives.",
      topics: 89,
      posts: 567,
      lastActivity: "15 minutes ago",
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Leadership & Management",
      description: "Leadership insights, team management strategies, and professional development discussions.",
      topics: 76,
      posts: 423,
      lastActivity: "1 hour ago",
      color: "bg-orange-500"
    },
    {
      id: 4,
      title: "Course Discussions",
      description: "Ask questions, share insights, and collaborate with fellow learners on course content.",
      topics: 234,
      posts: 1156,
      lastActivity: "5 minutes ago",
      color: "bg-purple-500"
    }
  ];

  const recentTopics = [
    {
      id: 1,
      title: "How to handle difficult customers during peak seasons?",
      author: "Sarah M.",
      authorAvatar: "/api/placeholder/40/40",
      category: "Customer Service Excellence",
      replies: 23,
      views: 156,
      lastReply: "2 hours ago",
      isHot: true
    },
    {
      id: 2,
      title: "Best practices for cross-cultural business development in East Africa",
      author: "James K.",
      authorAvatar: "/api/placeholder/40/40",
      category: "Business Development",
      replies: 15,
      views: 89,
      lastReply: "4 hours ago",
      isHot: false
    },
    {
      id: 3,
      title: "Building remote teams: Lessons learned",
      author: "Amina H.",
      authorAvatar: "/api/placeholder/40/40",
      category: "Leadership & Management",
      replies: 31,
      views: 203,
      lastReply: "6 hours ago",
      isHot: true
    },
    {
      id: 4,
      title: "Module 3 Assignment Discussion - Customer Journey Mapping",
      author: "David L.",
      authorAvatar: "/api/placeholder/40/40",
      category: "Course Discussions",
      replies: 8,
      views: 45,
      lastReply: "1 day ago",
      isHot: false
    }
  ];

  const filteredTopics = recentTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eaccc-green to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Community Forums</h1>
          <p className="text-xl text-green-100 mb-8">
            Connect with fellow learners, share experiences, and grow together in our vibrant community
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-green-200" />
            <Input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border-white/20 text-white placeholder-green-200"
            />
          </div>
        </div>
      </section>

      {/* Forum Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="categories" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="recent">Recent Topics</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="my-posts">My Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Forum Categories</h2>
                <Button className="bg-eaccc-blue hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Topic
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {forumCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{category.title}</CardTitle>
                          <p className="text-gray-600 text-sm">{category.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            {category.topics} topics
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {category.posts} posts
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {category.lastActivity}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Recent Discussions</h2>
                <Button className="bg-eaccc-blue hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Topic
                </Button>
              </div>

              <div className="space-y-4">
                {filteredTopics.map((topic) => (
                  <Card key={topic.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={topic.authorAvatar} />
                          <AvatarFallback>{topic.author[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 hover:text-eaccc-blue">
                              {topic.title}
                            </h3>
                            {topic.isHot && (
                              <Badge variant="secondary" className="bg-red-100 text-red-600">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                Hot
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <span>by {topic.author}</span>
                            <Badge variant="outline" className="text-xs">
                              {topic.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              {topic.replies} replies
                            </div>
                            <div className="flex items-center">
                              <Eye className="mr-1 h-4 w-4" />
                              {topic.views} views
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              {topic.lastReply}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular" className="space-y-6">
              <div className="text-center py-16">
                <Star className="mx-auto h-24 w-24 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Popular Topics</h3>
                <p className="text-gray-500">Popular discussions will appear here based on engagement.</p>
              </div>
            </TabsContent>

            <TabsContent value="my-posts" className="space-y-6">
              <div className="text-center py-16">
                <MessageCircle className="mx-auto h-24 w-24 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Your Posts</h3>
                <p className="text-gray-500 mb-4">You haven't posted anything yet. Start a discussion!</p>
                <Button className="bg-eaccc-blue hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Post
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, GripVertical, ChevronDown, ChevronRight, Edit2, Trash2, Copy, Eye, Lock, Play, CheckCircle, Upload, Link, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { Course, Topic, Lesson, Instructor } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

interface TopicWithLessons extends Topic {
  lessons: Lesson[];
}

export default function CourseBuilderPage() {
  const [match, params] = useRoute("/admin/course-builder/:courseId");
  const courseId = match && params ? parseInt(params.courseId) : null;
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<"video" | "pdf" | "pptx" | "docx">("video");
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());
  const [contentType, setContentType] = useState<"video" | "pdf" | "pptx" | "docx">("video");
  const [videoInputMethod, setVideoInputMethod] = useState<"youtube" | "url" | "upload">("youtube");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset lesson dialog state
  const resetLessonDialog = () => {
    setContentType("video");
    setVideoInputMethod("youtube");
    setUploadedVideoUrl("");
    setUploadedFileUrl("");
    setTotalPages(1);
  };

  // Helper function to convert YouTube URL to embed format
  const convertYouTubeToEmbed = (url: string): string => {
    if (!url) return "";
    
    // YouTube URL patterns to match
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    return url; // Return original URL if no pattern matches
  };

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ["/api/admin/course", courseId],
    enabled: !!courseId,
  });

  // Fetch instructor data
  const { data: instructor, isLoading: instructorLoading } = useQuery<Instructor>({
    queryKey: ["/api/admin/instructor", course?.instructorId],
    enabled: !!course?.instructorId,
  });

  // Fetch topics with lessons
  const { data: topics = [], isLoading: topicsLoading } = useQuery<TopicWithLessons[]>({
    queryKey: ["/api/admin/courses", courseId, "topics-with-lessons"],
    enabled: !!courseId,
    queryFn: async () => {
      // First fetch topics
      const topicsResponse = await fetch(`/api/admin/courses/${courseId}/topics`);
      const topicsData: Topic[] = await topicsResponse.json();
      
      // Then fetch lessons for each topic
      const topicsWithLessons: TopicWithLessons[] = await Promise.all(
        topicsData.map(async (topic) => {
          const lessonsResponse = await fetch(`/api/admin/topics/${topic.id}/lessons`);
          const lessons: Lesson[] = await lessonsResponse.json();
          return { ...topic, lessons };
        })
      );
      
      return topicsWithLessons;
    },
  });

  // Topic operations
  const createTopicMutation = useMutation({
    mutationFn: async (topicData: { title: string; orderIndex: number }) => {
      const response = await apiRequest("POST", `/api/admin/courses/${courseId}/topics`, topicData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses", courseId, "topics-with-lessons"] });
      setTopicDialogOpen(false);
      toast({ title: "Success", description: "Topic created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create topic", variant: "destructive" });
    },
  });

  const updateTopicMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Topic> }) => {
      const response = await apiRequest("PUT", `/api/admin/topics/${data.id}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses", courseId, "topics-with-lessons"] });
      toast({ title: "Success", description: "Topic updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update topic", variant: "destructive" });
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (topicId: number) => {
      await apiRequest("DELETE", `/api/admin/topics/${topicId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses", courseId, "topics-with-lessons"] });
      toast({ title: "Success", description: "Topic deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete topic", variant: "destructive" });
    },
  });

  const duplicateTopicMutation = useMutation({
    mutationFn: async (topicId: number) => {
      const response = await apiRequest("POST", `/api/admin/topics/${topicId}/duplicate`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses", courseId, "topics-with-lessons"] });
      toast({ title: "Success", description: "Topic duplicated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to duplicate topic", variant: "destructive" });
    },
  });

  // Lesson operations
  const createLessonMutation = useMutation({
    mutationFn: async (data: { topicId: number; lessonData: Partial<Lesson> }) => {
      const response = await apiRequest("POST", `/api/admin/topics/${data.topicId}/lessons`, {
        ...data.lessonData,
        courseId: courseId!,
        orderIndex: (topics.find(t => t.id === selectedTopic?.id)?.lessons?.length || 0),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses", courseId, "topics-with-lessons"] });
      setLessonDialogOpen(false);
      resetLessonDialog();
      toast({ title: "Success", description: "Lesson created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create lesson", variant: "destructive" });
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Lesson> }) => {
      const response = await apiRequest("PUT", `/api/admin/lessons/${data.id}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses", courseId, "topics-with-lessons"] });
      toast({ title: "Success", description: "Lesson updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update lesson", variant: "destructive" });
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (lessonId: number) => {
      await apiRequest("DELETE", `/api/admin/lessons/${lessonId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses", courseId, "topics-with-lessons"] });
      toast({ title: "Success", description: "Lesson deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete lesson", variant: "destructive" });
    },
  });

  // Publish course mutation
  const publishCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await apiRequest("POST", `/api/admin/courses/${courseId}/publish`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/course", courseId] });
      toast({
        title: "Course published successfully! \ud83c\udf89",
        description: "Your course is now live and available to students.",
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to publish course",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  // Topic form handlers
  const handleCreateTopic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    createTopicMutation.mutate({
      title: title.trim(),
      orderIndex: topics.length,
    });
  };

  // Lesson form handlers
  const handleCreateLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTopic) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const youtubeInput = formData.get("youtubeUrl") as string;
    const urlInput = formData.get("videoUrl") as string;
    const duration = parseInt(formData.get("duration") as string) || 0;
    const pages = parseInt(formData.get("totalPages") as string) || 1;
    
    if (!title.trim()) return;

    // Determine content URLs based on content type
    let videoUrl = "";
    let fileUrl = "";
    
    if (contentType === "video") {
      switch (videoInputMethod) {
        case "youtube":
          videoUrl = convertYouTubeToEmbed(youtubeInput?.trim() || "");
          break;
        case "url":
          videoUrl = urlInput?.trim() || "";
          break;
        case "upload":
          videoUrl = uploadedVideoUrl;
          break;
      }
    } else {
      // For documents (pdf, pptx, docx)
      fileUrl = uploadedFileUrl;
    }

    createLessonMutation.mutate({
      topicId: selectedTopic.id,
      lessonData: {
        title: title.trim(),
        description: description?.trim(),
        contentType: contentType,
        videoUrl: videoUrl || "",
        fileUrl: fileUrl || "",
        totalPages: contentType === "video" ? null : pages,
        duration: duration.toString(),
        isPreview: formData.get("isPreview") === "on",
        isRequired: formData.get("isRequired") === "on",
        completeOnVideoEnd: formData.get("completeOnVideoEnd") === "on",
        orderIndex: topics.find(t => t.id === selectedTopic.id)?.lessons?.length || 0,
      },
    });
  };

  // Toggle topic expansion
  const toggleTopicExpansion = (topicId: number) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  // Inline editing
  const handleTopicTitleEdit = (topic: Topic, newTitle: string) => {
    if (newTitle.trim() && newTitle !== topic.title) {
      updateTopicMutation.mutate({
        id: topic.id,
        updates: { title: newTitle.trim() },
      });
    }
  };

  const handleLessonUpdate = (lesson: Lesson, updates: Partial<Lesson>) => {
    updateLessonMutation.mutate({
      id: lesson.id,
      updates,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (!courseId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <Card className="p-8">
          <CardHeader>
            <CardTitle className="text-red-600">Invalid Course</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Course ID not found in URL. Please navigate from the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (courseLoading || topicsLoading || instructorLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#0097D7]" />
          <span>Loading course builder...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Course Builder
              </h1>
              <p className="text-gray-600 text-lg">
                Build and organize your course content
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="border-[#0097D7] text-[#0097D7] hover:bg-[#0097D7] hover:text-white"
                data-testid="button-preview-toggle"
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Edit Mode" : "Preview Mode"}
              </Button>
              <Button 
                className="bg-[#0097D7] hover:bg-[#0097D7]/90" 
                onClick={() => courseId && publishCourseMutation.mutate(courseId)}
                disabled={publishCourseMutation.isPending || course?.published}
                data-testid="button-publish-course"
              >
                {publishCourseMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : course?.published ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Published
                  </>
                ) : (
                  "Publish Course"
                )}
              </Button>
            </div>
          </div>
          
          {/* Course Information Card */}
          {course && (
            <Card className="mb-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0097D7] font-bold">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Instructor</Label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {instructor ? instructor.name : `Instructor ${course.instructorId}`}
                    </p>
                    {instructor?.expertise && (
                      <p className="text-sm text-gray-600 mt-1">{instructor.expertise}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Price</Label>
                    <div className="mt-1">
                      {course.isFree ? (
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          FREE
                        </Badge>
                      ) : (
                        <p className="text-lg font-bold text-[#F7941D]">
                          ${course.price}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {course.category || "General"}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Difficulty</Label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {course.level || "Beginner"}
                    </p>
                  </div>
                </div>
                
                {course.description && (
                  <div className="mt-6">
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <p className="text-gray-800 mt-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-4 mt-6">
                  {course.hasQuiz && (
                    <Badge variant="outline" className="border-[#34A853] text-[#34A853]">
                      Has Quiz
                    </Badge>
                  )}
                  {course.hasCertificate && (
                    <Badge variant="outline" className="border-[#F7941D] text-[#F7941D]">
                      Has Certificate
                    </Badge>
                  )}
                  {course.isFeatured && (
                    <Badge variant="outline" className="border-[#0097D7] text-[#0097D7]">
                      Featured
                    </Badge>
                  )}
                  {course.isBestseller && (
                    <Badge variant="outline" className="border-purple-600 text-purple-600">
                      Bestseller
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Course stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Topics</div>
                <div className="text-2xl font-bold text-[#0097D7]">{topics.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Total Lessons</div>
                <div className="text-2xl font-bold text-[#0097D7]">
                  {topics.reduce((sum, topic) => sum + topic.lessons.length, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Total Duration</div>
                <div className="text-2xl font-bold text-[#0097D7]">
                  {formatDuration(topics.reduce((sum, topic) => 
                    sum + topic.lessons.reduce((lessonSum, lesson) => lessonSum + (Number(lesson.duration) || 0), 0), 0
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600">Preview Lessons</div>
                <div className="text-2xl font-bold text-[#0097D7]">
                  {topics.reduce((sum, topic) => 
                    sum + topic.lessons.filter(lesson => lesson.isPreview).length, 0
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <div className={`grid gap-8 ${previewMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Topics and Lessons Panel */}
          <div className={previewMode ? "col-span-1" : "lg:col-span-2"}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {previewMode ? "Course Overview" : "Course Content"}
                  </CardTitle>
                  {!previewMode && (
                    <Dialog open={topicDialogOpen} onOpenChange={setTopicDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-[#0097D7] hover:bg-[#0097D7]/90" data-testid="button-add-topic">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Topic
                        </Button>
                      </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Topic</DialogTitle>
                        <DialogDescription>
                          Create a new topic to organize your lessons
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateTopic} className="space-y-4">
                        <div>
                          <Label htmlFor="title">Topic Title</Label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="Enter topic title"
                            required
                            data-testid="input-topic-title"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setTopicDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-[#0097D7] hover:bg-[#0097D7]/90" data-testid="button-create-topic">
                            Create Topic
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {topics.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Play className="h-12 w-12 mx-auto mb-2" />
                      <p>No topics created yet</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Start by creating your first topic to organize your course content
                    </p>
                    {!previewMode && (
                      <Button 
                        onClick={() => setTopicDialogOpen(true)} 
                        className="bg-[#0097D7] hover:bg-[#0097D7]/90"
                        data-testid="button-create-first-topic"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Topic
                      </Button>
                    )}
                  </div>
                ) : previewMode ? (
                  /* PREVIEW MODE - Clean student view */
                  <div className="space-y-6">
                    {topics.map((topic, topicIndex) => (
                      <div key={topic.id} className="border border-gray-200 rounded-lg bg-white">
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTopicExpansion(topic.id)}
                                className="p-0 h-auto hover:bg-transparent"
                                data-testid={`button-preview-toggle-topic-${topic.id}`}
                              >
                                {expandedTopics.has(topic.id) ? (
                                  <ChevronDown className="h-5 w-5 text-[#0097D7]" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-[#0097D7]" />
                                )}
                              </Button>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {topic.lessons.filter(lesson => lesson.isPreview || !lesson.isLocked).length} lesson{topic.lessons.filter(lesson => lesson.isPreview || !lesson.isLocked).length !== 1 ? 's' : ''} •{' '}
                                  {formatDuration(topic.lessons.reduce((sum, lesson) => sum + (Number(lesson.duration) || 0), 0))}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {expandedTopics.has(topic.id) && (
                          <div className="p-4">
                            <div className="space-y-2">
                              {topic.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="flex-shrink-0">
                                    {lesson.videoUrl ? (
                                      <Play className="h-4 w-4 text-[#0097D7]" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 truncate">{lesson.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-sm text-gray-600">{formatDuration(Number(lesson.duration) || 0)}</span>
                                      {lesson.isPreview && (
                                        <Badge variant="outline" className="text-xs border-[#0097D7] text-[#0097D7]">
                                          Preview
                                        </Badge>
                                      )}
                                      {lesson.isRequired && (
                                        <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                                          Required
                                        </Badge>
                                      )}
                                      {lesson.isLocked && !lesson.isPreview && (
                                        <Lock className="h-3 w-3 text-gray-400" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  /* EDIT MODE - Full editor view */
                  <div className="space-y-4">
                    {topics.map((topic, topicIndex) => (
                      <Card key={topic.id} className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTopicExpansion(topic.id)}
                                className="p-0 h-auto"
                                data-testid={`button-toggle-topic-${topic.id}`}
                              >
                                {expandedTopics.has(topic.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              <div className="flex-1">
                                <Input
                                  defaultValue={topic.title}
                                  onBlur={(e) => handleTopicTitleEdit(topic, e.target.value)}
                                  className="border-none bg-transparent p-0 text-lg font-semibold focus:bg-white focus:border-gray-300"
                                  data-testid={`input-topic-title-${topic.id}`}
                                />
                                <p className="text-sm text-gray-600 mt-1">
                                  {topic.lessons.length} lesson{topic.lessons.length !== 1 ? 's' : ''} •{' '}
                                  {formatDuration(topic.lessons.reduce((sum, lesson) => sum + (Number(lesson.duration) || 0), 0))}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTopic(topic);
                                  setLessonDialogOpen(true);
                                }}
                                data-testid={`button-add-lesson-${topic.id}`}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Lesson
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => duplicateTopicMutation.mutate(topic.id)}
                                data-testid={`button-duplicate-topic-${topic.id}`}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTopicMutation.mutate(topic.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                data-testid={`button-delete-topic-${topic.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {expandedTopics.has(topic.id) && (
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              {topic.lessons.map((lesson, lessonIndex) => (
                                <Card key={lesson.id} className="border border-gray-100 bg-gray-50/50">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 flex-1">
                                        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <Input
                                              defaultValue={lesson.title}
                                              onBlur={(e) => handleLessonUpdate(lesson, { title: e.target.value })}
                                              className="border-none bg-transparent p-0 font-medium text-gray-900 focus:bg-white focus:border-gray-300"
                                              data-testid={`input-lesson-title-${lesson.id}`}
                                            />
                                            <div className="flex items-center gap-1">
                                              {lesson.isPreview && (
                                                <Badge variant="secondary" className="text-xs">
                                                  <Eye className="h-3 w-3 mr-1" />
                                                  Preview
                                                </Badge>
                                              )}
                                              {lesson.isRequired && (
                                                <Badge variant="secondary" className="text-xs">
                                                  <CheckCircle className="h-3 w-3 mr-1" />
                                                  Required
                                                </Badge>
                                              )}
                                              {lesson.isLocked && (
                                                <Badge variant="secondary" className="text-xs">
                                                  <Lock className="h-3 w-3 mr-1" />
                                                  Locked
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>{formatDuration(Number(lesson.duration) || 0)}</span>
                                            {lesson.videoUrl && (
                                              <span className="flex items-center gap-1">
                                                <Play className="h-3 w-3" />
                                                Video
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedLesson(lesson);
                                            setSelectedContentType((lesson.contentType as "video" | "pdf" | "pptx" | "docx") || "video");
                                          }}
                                          data-testid={`button-edit-lesson-${lesson.id}`}
                                        >
                                          <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => deleteLessonMutation.mutate(lesson.id)}
                                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                          data-testid={`button-delete-lesson-${lesson.id}`}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                              
                              {topic.lessons.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  <p>No lessons in this topic yet</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedTopic(topic);
                                      setLessonDialogOpen(true);
                                    }}
                                    className="mt-2"
                                    data-testid={`button-add-first-lesson-${topic.id}`}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add First Lesson
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Lesson Details Panel - Only show in edit mode */}
          {!previewMode && (
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {selectedLesson ? "Lesson Details" : "Course Settings"}
                  </CardTitle>
                </CardHeader>
              <CardContent>
                {selectedLesson ? (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="lesson-title">Lesson Title</Label>
                      <Input
                        id="lesson-title"
                        defaultValue={selectedLesson.title}
                        onBlur={(e) => handleLessonUpdate(selectedLesson, { title: e.target.value })}
                        data-testid="input-lesson-detail-title"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lesson-description">Description</Label>
                      <Textarea
                        id="lesson-description"
                        defaultValue={selectedLesson.description || ""}
                        onBlur={(e) => handleLessonUpdate(selectedLesson, { description: e.target.value })}
                        placeholder="Lesson description..."
                        rows={4}
                        data-testid="input-lesson-description"
                      />
                    </div>
                    
                    <div>
                      <Label>Content Type</Label>
                      <Tabs 
                        value={selectedContentType} 
                        onValueChange={(value) => {
                          const newContentType = value as "video" | "pdf" | "pptx" | "docx";
                          setSelectedContentType(newContentType);
                          // Only save to database when content type actually changes
                          if (newContentType !== selectedLesson.contentType) {
                            handleLessonUpdate(selectedLesson, { 
                              contentType: newContentType,
                              // Clear other content fields when switching types
                              ...(newContentType !== "video" && { videoUrl: null }),
                              ...(newContentType === "video" && { fileUrl: null, totalPages: null })
                            });
                          }
                        }} 
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="video" className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Video
                          </TabsTrigger>
                          <TabsTrigger value="pdf" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            PDF
                          </TabsTrigger>
                          <TabsTrigger value="pptx" className="flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            PPT
                          </TabsTrigger>
                          <TabsTrigger value="docx" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Word
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="video" className="mt-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="lesson-video">Video URL</Label>
                              <Input
                                id="lesson-video"
                                defaultValue={selectedLesson.videoUrl || ""}
                                onBlur={(e) => handleLessonUpdate(selectedLesson, { videoUrl: e.target.value })}
                                placeholder="https://..."
                                data-testid="input-lesson-video"
                              />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="pdf" className="mt-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="lesson-total-pages">Total Pages</Label>
                              <Input
                                id="lesson-total-pages"
                                type="number"
                                defaultValue={selectedLesson.totalPages || "1"}
                                onBlur={(e) => handleLessonUpdate(selectedLesson, { totalPages: parseInt(e.target.value) || 1 })}
                                min="1"
                                data-testid="input-lesson-total-pages"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lesson-file-url">File URL</Label>
                              <Input
                                id="lesson-file-url"
                                defaultValue={selectedLesson.fileUrl || ""}
                                onBlur={(e) => handleLessonUpdate(selectedLesson, { fileUrl: e.target.value })}
                                placeholder="PDF file URL..."
                                data-testid="input-lesson-file-url"
                              />
                            </div>
                            <div>
                              <Label>Upload PDF File</Label>
                              <ObjectUploader
                                maxNumberOfFiles={1}
                                maxFileSize={52428800} // 50MB
                                allowedFileTypes={['.pdf']}
                                onGetUploadParameters={async () => {
                                  const response = await apiRequest("POST", "/api/objects/upload");
                                  const data = await response.json();
                                  return {
                                    method: "PUT" as const,
                                    url: data.uploadURL,
                                  };
                                }}
                                onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                                  if (result.successful && result.successful.length > 0) {
                                    const uploadedFile = result.successful[0];
                                    const fileUrl = uploadedFile.uploadURL;
                                    handleLessonUpdate(selectedLesson, { fileUrl: fileUrl || "" });
                                    toast({
                                      title: "PDF uploaded successfully",
                                      description: "Your PDF document is ready to use in the lesson.",
                                    });
                                  }
                                }}
                                buttonClassName="w-full bg-[#0097D7] hover:bg-[#0097D7]/90"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Choose PDF File
                              </ObjectUploader>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="pptx" className="mt-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="lesson-total-slides">Total Slides</Label>
                              <Input
                                id="lesson-total-slides"
                                type="number"
                                defaultValue={selectedLesson.totalPages || "1"}
                                onBlur={(e) => handleLessonUpdate(selectedLesson, { totalPages: parseInt(e.target.value) || 1 })}
                                min="1"
                                data-testid="input-lesson-total-slides"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lesson-file-url-ppt">File URL</Label>
                              <Input
                                id="lesson-file-url-ppt"
                                defaultValue={selectedLesson.fileUrl || ""}
                                onBlur={(e) => handleLessonUpdate(selectedLesson, { fileUrl: e.target.value })}
                                placeholder="PowerPoint file URL..."
                                data-testid="input-lesson-file-url-ppt"
                              />
                            </div>
                            <div>
                              <Label>Upload PowerPoint File</Label>
                              <ObjectUploader
                                maxNumberOfFiles={1}
                                maxFileSize={52428800} // 50MB
                                allowedFileTypes={['.pptx', '.ppt']}
                                onGetUploadParameters={async () => {
                                  const response = await apiRequest("POST", "/api/objects/upload");
                                  const data = await response.json();
                                  return {
                                    method: "PUT" as const,
                                    url: data.uploadURL,
                                  };
                                }}
                                onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                                  if (result.successful && result.successful.length > 0) {
                                    const uploadedFile = result.successful[0];
                                    const fileUrl = uploadedFile.uploadURL;
                                    handleLessonUpdate(selectedLesson, { fileUrl: fileUrl || "" });
                                    toast({
                                      title: "PowerPoint uploaded successfully",
                                      description: "Your presentation is ready to use in the lesson.",
                                    });
                                  }
                                }}
                                buttonClassName="w-full bg-[#0097D7] hover:bg-[#0097D7]/90"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Choose PowerPoint File
                              </ObjectUploader>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="docx" className="mt-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="lesson-total-pages-doc">Total Pages</Label>
                              <Input
                                id="lesson-total-pages-doc"
                                type="number"
                                defaultValue={selectedLesson.totalPages || "1"}
                                onBlur={(e) => handleLessonUpdate(selectedLesson, { totalPages: parseInt(e.target.value) || 1 })}
                                min="1"
                                data-testid="input-lesson-total-pages-doc"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lesson-file-url-doc">File URL</Label>
                              <Input
                                id="lesson-file-url-doc"
                                defaultValue={selectedLesson.fileUrl || ""}
                                onBlur={(e) => handleLessonUpdate(selectedLesson, { fileUrl: e.target.value })}
                                placeholder="Word document file URL..."
                                data-testid="input-lesson-file-url-doc"
                              />
                            </div>
                            <div>
                              <Label>Upload Word Document</Label>
                              <ObjectUploader
                                maxNumberOfFiles={1}
                                maxFileSize={52428800} // 50MB
                                allowedFileTypes={['.docx', '.doc']}
                                onGetUploadParameters={async () => {
                                  const response = await apiRequest("POST", "/api/objects/upload");
                                  const data = await response.json();
                                  return {
                                    method: "PUT" as const,
                                    url: data.uploadURL,
                                  };
                                }}
                                onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                                  if (result.successful && result.successful.length > 0) {
                                    const uploadedFile = result.successful[0];
                                    const fileUrl = uploadedFile.uploadURL;
                                    handleLessonUpdate(selectedLesson, { fileUrl: fileUrl || "" });
                                    toast({
                                      title: "Word document uploaded successfully",
                                      description: "Your document is ready to use in the lesson.",
                                    });
                                  }
                                }}
                                buttonClassName="w-full bg-[#0097D7] hover:bg-[#0097D7]/90"
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Choose Word Document
                              </ObjectUploader>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div>
                      <Label htmlFor="lesson-duration">Duration (minutes)</Label>
                      <Input
                        id="lesson-duration"
                        type="number"
                        defaultValue={selectedLesson.duration || "0"}
                        onBlur={(e) => handleLessonUpdate(selectedLesson, { duration: e.target.value || "0" })}
                        data-testid="input-lesson-duration"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Lesson Settings</h4>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="preview-switch" className="text-sm">
                          Free Preview
                        </Label>
                        <Switch
                          id="preview-switch"
                          checked={selectedLesson.isPreview ?? false}
                          onCheckedChange={(checked) => handleLessonUpdate(selectedLesson, { isPreview: checked })}
                          data-testid="switch-lesson-preview"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="required-switch" className="text-sm">
                          Required Lesson
                        </Label>
                        <Switch
                          id="required-switch"
                          checked={selectedLesson.isRequired ?? false}
                          onCheckedChange={(checked) => handleLessonUpdate(selectedLesson, { isRequired: checked })}
                          data-testid="switch-lesson-required"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-complete-switch" className="text-sm">
                          Auto-complete on video end
                        </Label>
                        <Switch
                          id="auto-complete-switch"
                          checked={selectedLesson.completeOnVideoEnd ?? false}
                          onCheckedChange={(checked) => handleLessonUpdate(selectedLesson, { completeOnVideoEnd: checked })}
                          data-testid="switch-lesson-auto-complete"
                        />
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedLesson(null);
                        setSelectedContentType("video");
                      }}
                      data-testid="button-close-lesson-details"
                    >
                      Close Details
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setTopicDialogOpen(true)}
                          data-testid="button-quick-add-topic"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Topic
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setPreviewMode(!previewMode)}
                          data-testid="button-quick-preview"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {previewMode ? "Exit Preview" : "Preview Course"}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Course Progress</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Topics Created</span>
                          <span className="font-medium">{topics.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Lessons Added</span>
                          <span className="font-medium">
                            {topics.reduce((sum, topic) => sum + topic.lessons.length, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Preview Lessons</span>
                          <span className="font-medium">
                            {topics.reduce((sum, topic) => 
                              sum + topic.lessons.filter(lesson => lesson.isPreview).length, 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          )}
        </div>

        {/* Add Lesson Dialog */}
        <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Lesson</DialogTitle>
              <DialogDescription>
                Add a new lesson to {selectedTopic?.title}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lesson-title">Lesson Title</Label>
                  <Input
                    id="lesson-title"
                    name="title"
                    placeholder="Enter lesson title"
                    required
                    data-testid="input-new-lesson-title"
                  />
                </div>
                <div>
                  <Label htmlFor="lesson-duration">Duration (minutes)</Label>
                  <Input
                    id="lesson-duration"
                    name="duration"
                    type="number"
                    placeholder="0"
                    data-testid="input-new-lesson-duration"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="lesson-description">Description</Label>
                <Textarea
                  id="lesson-description"
                  name="description"
                  placeholder="Lesson description..."
                  rows={3}
                  data-testid="input-new-lesson-description"
                />
              </div>
              
              <div>
                <Label>Content Type</Label>
                <Tabs value={contentType} onValueChange={(value) => setContentType(value as "video" | "pdf" | "pptx" | "docx")} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="video" className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF
                    </TabsTrigger>
                    <TabsTrigger value="pptx" className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      PowerPoint
                    </TabsTrigger>
                    <TabsTrigger value="docx" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Word
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="video" className="mt-4">
                    <Tabs value={videoInputMethod} onValueChange={(value) => setVideoInputMethod(value as "youtube" | "url" | "upload")} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="youtube">YouTube</TabsTrigger>
                        <TabsTrigger value="url">URL</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="youtube" className="mt-4">
                        <Input
                          id="lesson-youtube"
                          name="youtubeUrl"
                          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                          data-testid="input-new-lesson-youtube"
                        />
                      </TabsContent>
                      
                      <TabsContent value="url" className="mt-4">
                        <Input
                          id="lesson-video"
                          name="videoUrl"
                          placeholder="https://vimeo.com/123456789 or https://example.com/video.mp4"
                          data-testid="input-new-lesson-video"
                        />
                      </TabsContent>
                      
                      <TabsContent value="upload" className="mt-4">
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={104857600} // 100MB
                          onGetUploadParameters={async () => {
                            const response = await apiRequest("POST", "/api/objects/upload");
                            const data = await response.json();
                            return {
                              method: "PUT" as const,
                              url: data.uploadURL,
                            };
                          }}
                          onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                            if (result.successful && result.successful.length > 0) {
                              const uploadedFile = result.successful[0];
                              const videoUrl = uploadedFile.uploadURL;
                              setUploadedVideoUrl(videoUrl || "");
                              toast({
                                title: "Video uploaded successfully",
                                description: "Your video is ready to use in the lesson.",
                              });
                            }
                          }}
                          buttonClassName="w-full bg-[#0097D7] hover:bg-[#0097D7]/90"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Video File
                        </ObjectUploader>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                  
                  <TabsContent value="pdf" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="total-pages">Total Pages</Label>
                        <Input
                          id="total-pages"
                          name="totalPages"
                          type="number"
                          placeholder="1"
                          min="1"
                          value={totalPages}
                          onChange={(e) => setTotalPages(parseInt(e.target.value) || 1)}
                          data-testid="input-new-lesson-total-pages"
                        />
                      </div>
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={52428800} // 50MB
                        allowedFileTypes={['.pdf']}
                        onGetUploadParameters={async () => {
                          const response = await apiRequest("POST", "/api/objects/upload");
                          const data = await response.json();
                          return {
                            method: "PUT" as const,
                            url: data.uploadURL,
                          };
                        }}
                        onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                          if (result.successful && result.successful.length > 0) {
                            const uploadedFile = result.successful[0];
                            const fileUrl = uploadedFile.uploadURL;
                            setUploadedFileUrl(fileUrl || "");
                            toast({
                              title: "PDF uploaded successfully",
                              description: "Your PDF document is ready to use in the lesson.",
                            });
                          }
                        }}
                        buttonClassName="w-full bg-[#0097D7] hover:bg-[#0097D7]/90"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Choose PDF File
                      </ObjectUploader>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pptx" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="total-pages">Total Slides</Label>
                        <Input
                          id="total-pages"
                          name="totalPages"
                          type="number"
                          placeholder="1"
                          min="1"
                          value={totalPages}
                          onChange={(e) => setTotalPages(parseInt(e.target.value) || 1)}
                          data-testid="input-new-lesson-total-slides"
                        />
                      </div>
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={52428800} // 50MB
                        allowedFileTypes={['.pptx', '.ppt']}
                        onGetUploadParameters={async () => {
                          const response = await apiRequest("POST", "/api/objects/upload");
                          const data = await response.json();
                          return {
                            method: "PUT" as const,
                            url: data.uploadURL,
                          };
                        }}
                        onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                          if (result.successful && result.successful.length > 0) {
                            const uploadedFile = result.successful[0];
                            const fileUrl = uploadedFile.uploadURL;
                            setUploadedFileUrl(fileUrl || "");
                            toast({
                              title: "PowerPoint uploaded successfully",
                              description: "Your presentation is ready to use in the lesson.",
                            });
                          }
                        }}
                        buttonClassName="w-full bg-[#0097D7] hover:bg-[#0097D7]/90"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Choose PowerPoint File
                      </ObjectUploader>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="docx" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="total-pages">Total Pages</Label>
                        <Input
                          id="total-pages"
                          name="totalPages"
                          type="number"
                          placeholder="1"
                          min="1"
                          value={totalPages}
                          onChange={(e) => setTotalPages(parseInt(e.target.value) || 1)}
                          data-testid="input-new-lesson-total-pages-docx"
                        />
                      </div>
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={52428800} // 50MB
                        allowedFileTypes={['.docx', '.doc']}
                        onGetUploadParameters={async () => {
                          const response = await apiRequest("POST", "/api/objects/upload");
                          const data = await response.json();
                          return {
                            method: "PUT" as const,
                            url: data.uploadURL,
                          };
                        }}
                        onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                          if (result.successful && result.successful.length > 0) {
                            const uploadedFile = result.successful[0];
                            const fileUrl = uploadedFile.uploadURL;
                            setUploadedFileUrl(fileUrl || "");
                            toast({
                              title: "Word document uploaded successfully",
                              description: "Your document is ready to use in the lesson.",
                            });
                          }
                        }}
                        buttonClassName="w-full bg-[#0097D7] hover:bg-[#0097D7]/90"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Choose Word Document
                      </ObjectUploader>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPreview"
                    name="isPreview"
                    className="rounded"
                    data-testid="checkbox-new-lesson-preview"
                  />
                  <Label htmlFor="isPreview" className="text-sm">
                    Free Preview
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRequired"
                    name="isRequired"
                    className="rounded"
                    data-testid="checkbox-new-lesson-required"
                  />
                  <Label htmlFor="isRequired" className="text-sm">
                    Required
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="completeOnVideoEnd"
                    name="completeOnVideoEnd"
                    className="rounded"
                    data-testid="checkbox-new-lesson-auto-complete"
                  />
                  <Label htmlFor="completeOnVideoEnd" className="text-sm">
                    Auto-complete
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  setLessonDialogOpen(false);
                  resetLessonDialog();
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#0097D7] hover:bg-[#0097D7]/90" data-testid="button-create-lesson">
                  Create Lesson
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
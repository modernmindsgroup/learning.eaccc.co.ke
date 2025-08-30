import { useQuery } from "@tanstack/react-query";
import { Presentation, Users, Video, MonitorPlay } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsSection() {
  const { data: stats } = useQuery<{
    instructorCount: number;
    studentCount: number;
    courseCount: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const statsData = [
    {
      title: "Skillful Instructors", 
      description: "Start learning from experienced instructors.",
      value: stats?.instructorCount || 2,
      icon: Presentation,
      bgColor: "bg-blue-500",
    },
    {
      title: "Happy Students",
      description: "Enrolled in our courses and improved their skills.",
      value: stats?.studentCount || 11,
      icon: Users,
      bgColor: "bg-pink-500",
    },
    {
      title: "Live Classes", 
      description: "Improve your skills using live knowledge flow.",
      value: 0,
      icon: MonitorPlay,
      bgColor: "bg-green-500",
    },
    {
      title: "Video Courses",
      description: "Learn without any geographical & time limitations.",
      value: stats?.courseCount || 4,
      icon: Video,
      bgColor: "bg-red-500",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <h4 className="font-semibold text-gray-800 mb-2">
                  {stat.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

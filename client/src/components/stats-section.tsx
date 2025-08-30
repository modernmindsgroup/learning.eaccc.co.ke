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
      bgColor: "bg-gradient-to-br from-sky-400 to-blue-600",
    },
    {
      title: "Happy Students",
      description: "Enrolled in our courses and improved their skills.",
      value: stats?.studentCount || 11,
      icon: Users,
      bgColor: "bg-gradient-to-br from-pink-400 to-rose-600",
    },
    {
      title: "Live Classes", 
      description: "Improve your skills using live knowledge flow.",
      value: 0,
      icon: MonitorPlay,
      bgColor: "bg-gradient-to-br from-emerald-400 to-green-600",
    },
    {
      title: "Video Courses",
      description: "Learn without any geographical & time limitations.",
      value: stats?.courseCount || 4,
      icon: Video,
      bgColor: "bg-gradient-to-br from-orange-400 to-red-600",
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <Card 
              key={index} 
              className="group cursor-pointer transition-all duration-500 hover:shadow-hover hover:-translate-y-3 bg-white/80 backdrop-blur-sm border-0 rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)'
              }}
            >
              <CardContent className="p-8 text-center relative">
                {/* Gradient background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`relative w-20 h-20 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <stat.icon className="h-10 w-10 text-white drop-shadow-sm" />
                </div>
                
                <h3 className="font-heading text-4xl font-bold text-gray-900 mb-2 group-hover:text-gradient transition-all duration-300">
                  {stat.value}
                </h3>
                
                <h4 className="font-heading font-semibold text-base text-gray-800 mb-2">
                  {stat.title}
                </h4>
                
                <p className="text-sm text-gray-500 leading-relaxed font-normal">
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

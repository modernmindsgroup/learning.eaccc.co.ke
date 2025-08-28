import { useQuery } from "@tanstack/react-query";
import { Presentation, Users, Video } from "lucide-react";

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
      value: stats?.instructorCount || 0,
      icon: Presentation,
      color: "eaccc-blue",
    },
    {
      title: "Happy Students",
      value: stats?.studentCount || 0,
      icon: Users,
      color: "eaccc-green",
    },
    {
      title: "Video Courses",
      value: stats?.courseCount || 0,
      icon: Video,
      color: "eaccc-orange",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {statsData.map((stat, index) => (
            <div key={index} className="p-6">
              <div className={`w-16 h-16 bg-${stat.color} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`text-2xl text-${stat.color} h-8 w-8`} />
              </div>
              <h3 className={`text-3xl font-bold text-${stat.color} mb-2`}>
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

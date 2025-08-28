import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-eaccc-blue to-blue-600 text-white">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
            Empowering Africa Through Skills and Service Excellence
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-blue-100">
            Join thousands of learners across East Africa in developing world-class customer service and professional skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-eaccc-orange hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = "/courses"}
            >
              <Play className="mr-2 h-5 w-5" />
              Browse Courses
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-eaccc-blue px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = "/about"}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

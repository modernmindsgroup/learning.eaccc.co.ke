import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mbeki",
      title: "Customer Relations Manager, Nairobi",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      quote: "The customer service course transformed how I interact with clients. The practical approaches are perfect for our African market context.",
      rating: 5,
    },
    {
      id: 2,
      name: "James Kinyua",
      title: "Business Development, Kampala",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      quote: "EACCC's courses are world-class yet tailored for our local business environment. The certificate has opened new career opportunities.",
      rating: 5,
    },
    {
      id: 3,
      name: "Grace Mwangi",
      title: "Operations Manager, Dar es Salaam",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      quote: "The instructors understand our unique challenges in East Africa. Every lesson is practical and immediately applicable to my work.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-eaccc-bg py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Learners Say</h2>
          <p className="text-xl text-gray-600">Join thousands of satisfied professionals across East Africa</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <div className="flex justify-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
              <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
              <p className="text-gray-500 text-sm">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

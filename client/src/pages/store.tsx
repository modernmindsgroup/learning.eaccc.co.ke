import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Gift, CreditCard, Truck } from "lucide-react";

export default function Store() {
  const storeItems = [
    {
      id: 1,
      name: "EACCC Learning Premium Membership",
      description: "Get unlimited access to all courses, exclusive content, and priority support for a full year.",
      price: 299.99,
      category: "Membership",
      image: "/api/placeholder/300/200",
      features: ["Unlimited course access", "Priority support", "Exclusive webinars", "Downloadable resources"]
    },
    {
      id: 2,
      name: "Customer Service Excellence Workbook",
      description: "A comprehensive workbook with exercises, templates, and real-world scenarios to enhance your customer service skills.",
      price: 49.99,
      category: "Study Materials",
      image: "/api/placeholder/300/200",
      features: ["150+ pages", "Interactive exercises", "Templates included", "Digital download"]
    },
    {
      id: 3,
      name: "Business Development Toolkit",
      description: "Professional templates, forms, and guides for business development in East African markets.",
      price: 89.99,
      category: "Toolkits",
      image: "/api/placeholder/300/200",
      features: ["20+ templates", "Market analysis tools", "Partnership agreements", "Growth planning guides"]
    },
    {
      id: 4,
      name: "EACCC Learning Certificate Frame",
      description: "High-quality certificate frame to display your EACCC Learning achievements with pride.",
      price: 24.99,
      category: "Merchandise",
      image: "/api/placeholder/300/200",
      features: ["Premium quality frame", "Perfect fit for certificates", "Professional appearance", "Easy to mount"]
    },
    {
      id: 5,
      name: "Leadership Assessment & Development Kit",
      description: "Comprehensive leadership assessment tools and development resources for customer-centric organizations.",
      price: 129.99,
      category: "Assessments",
      image: "/api/placeholder/300/200",
      features: ["360-degree assessment", "Development plans", "Coaching guides", "Progress tracking tools"]
    },
    {
      id: 6,
      name: "EACCC Learning Branded Notebook Set",
      description: "Professional notebook set perfect for taking notes during courses and workshops.",
      price: 19.99,
      category: "Merchandise",
      image: "/api/placeholder/300/200",
      features: ["Set of 3 notebooks", "High-quality paper", "Professional design", "Perfect for note-taking"]
    }
  ];

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eaccc-orange to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">EACCC Learning Store</h1>
          <p className="text-xl text-orange-100 mb-8">
            Enhance your learning journey with our premium resources, toolkits, and merchandise
          </p>
          <div className="flex items-center space-x-6 text-orange-100">
            <div className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Premium Quality
            </div>
            <div className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Fast Delivery
            </div>
            <div className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Secure Payment
            </div>
          </div>
        </div>
      </section>

      {/* Store Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {storeItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-eaccc-blue text-white">
                    {item.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="line-clamp-2">{item.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-eaccc-blue">
                      ${item.price}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Features:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {item.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-eaccc-green rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full bg-eaccc-orange hover:bg-orange-600"
                    onClick={() => {
                      // In a real app, this would handle purchase
                      alert(`Adding "${item.name}" to cart. Payment integration coming soon!`);
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Store Info */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Shop With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All proceeds from our store support the development of new courses and scholarships 
              for students across East Africa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-eaccc-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">
                All our products are carefully curated and tested by our education team.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-eaccc-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Supporting Education</h3>
              <p className="text-gray-600 text-sm">
                Your purchase helps provide scholarships and new learning opportunities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-eaccc-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Checkout</h3>
              <p className="text-gray-600 text-sm">
                Safe and secure payment processing with multiple payment options.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
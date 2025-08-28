import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Users,
  HelpCircle
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "general"
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-eaccc-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eaccc-blue to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-blue-100">
            Have questions about our courses or need support? We're here to help you succeed.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="type">Inquiry Type</Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eaccc-blue"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="courses">Course Information</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="feedback">Feedback & Suggestions</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Brief description of your inquiry"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-eaccc-blue hover:bg-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-eaccc-blue rounded-full p-3">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">support@eaccc-learning.org</p>
                      <p className="text-gray-600">info@eaccc-learning.org</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-eaccc-green rounded-full p-3">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">+254 700 000 000</p>
                      <p className="text-gray-600">+256 700 000 000</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-eaccc-orange rounded-full p-3">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-600">
                        East African Customer Care Center<br/>
                        Nairobi, Kenya<br/>
                        East Africa
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-500 rounded-full p-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Support Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM EAT</p>
                      <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM EAT</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm flex items-center">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        How do I enroll in a course?
                      </h4>
                      <p className="text-gray-600 text-sm mt-1 ml-6">
                        Simply browse our courses, click on the one you're interested in, and click "Enroll Now" or "Enroll Free" for free courses.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm flex items-center">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Do I get a certificate?
                      </h4>
                      <p className="text-gray-600 text-sm mt-1 ml-6">
                        Yes! Most of our courses offer certificates of completion that you can download and share.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm flex items-center">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Can I access courses offline?
                      </h4>
                      <p className="text-gray-600 text-sm mt-1 ml-6">
                        Currently, our courses are online-only, but we're working on downloadable content for offline access.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => window.location.href = "/forums"}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Visit Community Forums
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
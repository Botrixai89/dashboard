
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (formData.email && formData.password && formData.name) {
        // Store user data
        localStorage.setItem('webbot_user', JSON.stringify({
          id: Date.now().toString(),
          email: formData.email,
          name: formData.name,
          company: formData.company,
          plan: 'free'
        }));
        
        toast({
          title: "Account created successfully!",
          description: "Welcome to WebBot Platform",
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Signup failed",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <Card className="w-full max-w-md bg-slate-900/90 backdrop-blur-sm border-slate-700 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl shadow-lg">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl text-white font-bold">Create Account</CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Join WebBot Platform and start building amazing chatbots
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-medium">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-medium">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-300 font-medium">Company</Label>
              <Input
                id="company"
                name="company"
                type="text"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 font-medium">Password *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20 h-12"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-semibold h-12 shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <div className="text-center text-sm pt-4 border-t border-slate-700">
            <span className="text-slate-400">Already have an account? </span>
            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Users, Zap, Share2, Palette, MessageSquare, Sparkles, Globe, Shield } from "lucide-react";
import BotrixLogo from "@/components/BotrixLogo";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('webbot_user');
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Chatbots",
      description: "Create intelligent chatbots with advanced conversational AI capabilities"
    },
    {
      icon: Users,
      title: "Multi-Account Management", 
      description: "Manage multiple client accounts and bots from one unified dashboard"
    },
    {
      icon: Zap,
      title: "n8n Integration",
      description: "Connect with n8n workflows for powerful automation and integrations"
    },
    {
      icon: Share2,
      title: "Easy Deployment",
      description: "Generate embeddable widgets for seamless website integration"
    },
    {
      icon: Palette,
      title: "Custom Themes",
      description: "Customize colors, logos, and branding to match your identity"
    },
    {
      icon: MessageSquare,
      title: "Speech-to-Text",
      description: "Voice input support with real-time transcription capabilities"
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm shadow-2xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <BotrixLogo />
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')} 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/signup')} 
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-slate-300">Powered by Advanced AI Technology</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Next-Gen AI Chatbots
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Built with Botrix AI
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create, customize, and deploy intelligent AI-powered chatbots with cutting-edge technology. 
            Manage multiple accounts, integrate with powerful workflows, and deliver exceptional user experiences.
          </p>
          <div className="flex justify-center space-x-6">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')} 
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Building
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/demo')} 
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-lg transition-all duration-300"
            >
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Build Amazing AI Agents
            </h2>
            <p className="text-lg text-slate-300">
              Powerful features designed for agencies, developers, and businesses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:from-slate-700 hover:to-slate-800 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 group"
              >
                <CardHeader>
                  <div className="p-3 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg w-fit mb-4 group-hover:shadow-lg transition-all duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-slate-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">10k+</div>
              <div className="text-slate-300">Active Developers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">50k+</div>
              <div className="text-slate-300">AI Agents Deployed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">99.9%</div>
              <div className="text-slate-300">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Digital Experience?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
            Join thousands of developers and businesses already using Botrix AI to create 
            intelligent AI agents that engage users 24/7
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')} 
            className="bg-white text-emerald-600 hover:bg-slate-100 px-8 py-4 text-lg font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Create Your First AI Agent
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <BotrixLogo />
            <div className="flex items-center space-x-6 text-slate-400">
              <Globe className="h-5 w-5" />
              <Shield className="h-5 w-5" />
              <p>© 2024 Botrix AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

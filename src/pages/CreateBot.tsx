
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, ArrowLeft, Palette, Zap, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateBot = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    welcomeMessage: "Hi there! 👋 How can I help you today?",
    webhookUrl: "https://rahulcode9.app.n8n.cloud/webhook/daf9f0f2-fd77-439c-ad26-7517e85009de/chat",
    primaryColor: "#00a651",
    secondaryColor: "#f8f9fa",
    textColor: "#333333",
    backgroundColor: "#ffffff",
    headerTextColor: "#ffffff",
    logo: "",
    headerTitle: "",
    headerSubtitle: "I'm here to help you 24/7",
    messageBackgroundColor: "#ffffff",
    userMessageColor: "#667eea",
    botMessageColor: "#e9ecef",
    borderRadius: "16",
    fontSize: "14",
    fontFamily: "Inter, sans-serif"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Get current user data
    const userData = localStorage.getItem('webbot_user');
    if (!userData) {
      toast({
        title: "Authentication error",
        description: "Please log in again",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);

    // Create new bot
    const newBot = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active',
      userId: user.email || user.id
    };

    // Save to user-specific localStorage key
    const userBotsKey = `webbot_bots_${user.email || user.id}`;
    const existingBots = localStorage.getItem(userBotsKey);
    const bots = existingBots ? JSON.parse(existingBots) : [];
    bots.push(newBot);
    localStorage.setItem(userBotsKey, JSON.stringify(bots));

    toast({
      title: "Bot created successfully!",
      description: "Your chatbot is now ready to use",
    });

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm shadow-2xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="mr-4 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Create New Bot
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure the basic settings for your chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300 font-medium">Bot Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Customer Support Bot"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headerTitle" className="text-slate-300 font-medium">Header Title</Label>
                  <Input
                    id="headerTitle"
                    name="headerTitle"
                    placeholder="e.g., Customer Support"
                    value={formData.headerTitle}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300 font-medium">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what this bot does..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage" className="text-slate-300 font-medium">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  placeholder="Enter the first message users will see"
                  value={formData.welcomeMessage}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headerSubtitle" className="text-slate-300 font-medium">Header Subtitle</Label>
                <Input
                  id="headerSubtitle"
                  name="headerSubtitle"
                  placeholder="e.g., I'm here to help you 24/7"
                  value={formData.headerSubtitle}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span>n8n Integration</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Connect your bot to n8n workflows for intelligent responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="webhookUrl" className="text-slate-300 font-medium">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  name="webhookUrl"
                  type="url"
                  placeholder="https://your-n8n-instance.com/webhook/..."
                  value={formData.webhookUrl}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                />
                <p className="text-sm text-slate-500">
                  This URL will receive user messages and should return bot responses
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Appearance Customization */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <span>Advanced Appearance</span>
              </CardTitle>
              <CardDescription className="text-slate-400">
                Customize colors, typography, and visual elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Colors Section */}
              <div>
                <h4 className="font-medium mb-4 text-white">Colors</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor" className="text-slate-300 font-medium">Primary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primaryColor"
                        name="primaryColor"
                        type="color"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        className="w-16 h-10"
                      />
                      <Input
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        placeholder="#00a651"
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="userMessageColor" className="text-slate-300 font-medium">User Message Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="userMessageColor"
                        name="userMessageColor"
                        type="color"
                        value={formData.userMessageColor}
                        onChange={handleInputChange}
                        className="w-16 h-10"
                      />
                      <Input
                        name="userMessageColor"
                        value={formData.userMessageColor}
                        onChange={handleInputChange}
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="botMessageColor" className="text-slate-300 font-medium">Bot Message Background</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="botMessageColor"
                        name="botMessageColor"
                        type="color"
                        value={formData.botMessageColor}
                        onChange={handleInputChange}
                        className="w-16 h-10"
                      />
                      <Input
                        name="botMessageColor"
                        value={formData.botMessageColor}
                        onChange={handleInputChange}
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor" className="text-slate-300 font-medium">Widget Background</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="backgroundColor"
                        name="backgroundColor"
                        type="color"
                        value={formData.backgroundColor}
                        onChange={handleInputChange}
                        className="w-16 h-10"
                      />
                      <Input
                        name="backgroundColor"
                        value={formData.backgroundColor}
                        onChange={handleInputChange}
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textColor" className="text-slate-300 font-medium">Text Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="textColor"
                        name="textColor"
                        type="color"
                        value={formData.textColor}
                        onChange={handleInputChange}
                        className="w-16 h-10"
                      />
                      <Input
                        name="textColor"
                        value={formData.textColor}
                        onChange={handleInputChange}
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headerTextColor" className="text-slate-300 font-medium">Header Text Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="headerTextColor"
                        name="headerTextColor"
                        type="color"
                        value={formData.headerTextColor}
                        onChange={handleInputChange}
                        className="w-16 h-10"
                      />
                      <Input
                        name="headerTextColor"
                        value={formData.headerTextColor}
                        onChange={handleInputChange}
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography and Layout */}
              <div>
                <h4 className="font-medium mb-4 text-white">Typography & Layout</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontSize" className="text-slate-300 font-medium">Font Size (px)</Label>
                    <Input
                      id="fontSize"
                      name="fontSize"
                      type="number"
                      min="12"
                      max="20"
                      value={formData.fontSize}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="borderRadius" className="text-slate-300 font-medium">Border Radius (px)</Label>
                    <Input
                      id="borderRadius"
                      name="borderRadius"
                      type="number"
                      min="0"
                      max="30"
                      value={formData.borderRadius}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-slate-300 font-medium">Logo URL</Label>
                    <Input
                      id="logo"
                      name="logo"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={formData.logo}
                      onChange={handleInputChange}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white"
            >
              Create Bot
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateBot;

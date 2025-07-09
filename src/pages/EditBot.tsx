
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, ArrowLeft, Save, Palette, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditBot = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    welcomeMessage: "",
    webhookUrl: "",
    primaryColor: "#00a651",
    secondaryColor: "#f8f9fa",
    textColor: "#333333",
    backgroundColor: "#ffffff",
    headerTextColor: "#ffffff",
    logo: "",
    headerTitle: "",
    headerSubtitle: "",
    messageBackgroundColor: "#fafafa",
    userMessageColor: "#667eea",
    botMessageColor: "#e9ecef",
    borderRadius: "16",
    fontSize: "14",
    fontFamily: "Inter, sans-serif"
  });

  useEffect(() => {
    const userData = localStorage.getItem('webbot_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load existing bots and find the one to edit
    const userBotsKey = `webbot_bots_${parsedUser.email || parsedUser.id}`;
    const savedBots = localStorage.getItem(userBotsKey);
    
    if (savedBots) {
      try {
        const bots = JSON.parse(savedBots);
        const botToEdit = bots.find((bot: any) => bot.id === botId);
        
        if (botToEdit) {
          setFormData(botToEdit);
        } else {
          toast({
            title: "Bot not found",
            description: "The bot you're trying to edit doesn't exist",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading bot data:', error);
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  }, [botId, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your bot",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a description for your bot",
        variant: "destructive",
      });
      return;
    }

    // Update the bot in localStorage
    const userBotsKey = `webbot_bots_${user.email || user.id}`;
    const savedBots = localStorage.getItem(userBotsKey);
    
    if (savedBots) {
      try {
        const bots = JSON.parse(savedBots);
        const updatedBots = bots.map((bot: any) => 
          bot.id === botId ? { ...formData, id: botId } : bot
        );
        
        localStorage.setItem(userBotsKey, JSON.stringify(updatedBots));
        
        toast({
          title: "Bot updated successfully!",
          description: "Your AI agent has been updated with the new settings",
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error updating bot:', error);
        toast({
          title: "Error updating bot",
          description: "There was an error updating your bot. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm shadow-2xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Edit AI Agent
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
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                Basic Information
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
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Customer Support Bot"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headerTitle" className="text-slate-300 font-medium">Header Title</Label>
                  <Input
                    id="headerTitle"
                    name="headerTitle"
                    value={formData.headerTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Customer Support"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300 font-medium">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what this bot does..."
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage" className="text-slate-300 font-medium">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  name="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={handleInputChange}
                  placeholder="Enter the first message users will see"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="headerSubtitle" className="text-slate-300 font-medium">Header Subtitle</Label>
                <Input
                  id="headerSubtitle"
                  name="headerSubtitle"
                  value={formData.headerSubtitle}
                  onChange={handleInputChange}
                  placeholder="e.g., I'm here to help you 24/7"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Webhook Configuration */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
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
                  value={formData.webhookUrl}
                  onChange={handleInputChange}
                  placeholder="https://your-n8n-instance.com/webhook/..."
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
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
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor" className="text-slate-300 font-medium">Secondary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="color"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        className="w-16 h-10"
                      />
                      <Input
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleInputChange}
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="messageBackgroundColor" className="text-slate-300 font-medium">Message Background</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="messageBackgroundColor"
                        name="messageBackgroundColor"
                        type="color"
                        value={formData.messageBackgroundColor}
                        onChange={handleInputChange}
                        className="w-16 h-10"
                      />
                      <Input
                        name="messageBackgroundColor"
                        value={formData.messageBackgroundColor}
                        onChange={handleInputChange}
                        className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontFamily" className="text-slate-300 font-medium">Font Family</Label>
                    <Input
                      id="fontFamily"
                      name="fontFamily"
                      value={formData.fontFamily}
                      onChange={handleInputChange}
                      placeholder="Inter, sans-serif"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div>
                <h4 className="font-medium mb-4 text-white">Branding</h4>
                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-slate-300 font-medium">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    type="url"
                    value={formData.logo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Update Agent
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditBot;

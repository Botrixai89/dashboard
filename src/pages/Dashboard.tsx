
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Plus, Sparkles, Users, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LiveAnalytics from "@/components/LiveAnalytics";
import UserHistory from "@/components/UserHistory";
import DashboardHeader from "@/components/DashboardHeader";
import BotsGrid from "@/components/BotsGrid";
import { useTheme } from "@/contexts/ThemeContext";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [bots, setBots] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { actualTheme } = useTheme();

  useEffect(() => {
    const userData = localStorage.getItem('webbot_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load existing bots from localStorage with user-specific key
    const userBotsKey = `webbot_bots_${parsedUser.email || parsedUser.id}`;
    const savedBots = localStorage.getItem(userBotsKey);
    if (savedBots) {
      try {
        const parsedBots = JSON.parse(savedBots);
        setBots(Array.isArray(parsedBots) ? parsedBots : []);
      } catch (error) {
        console.error('Error parsing saved bots:', error);
        setBots([]);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('webbot_user');
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleCreateBot = () => {
    navigate('/create-bot');
  };

  const handleViewBot = (botId: string) => {
    navigate(`/bot/${botId}`);
  };

  const handleEditBot = (botId: string) => {
    navigate(`/edit-bot/${botId}`);
  };

  const handleDeleteBot = (botId: string) => {
    const updatedBots = bots.filter(bot => bot.id !== botId);
    setBots(updatedBots);
    
    // Save to user-specific key
    const userBotsKey = `webbot_bots_${user.email || user.id}`;
    localStorage.setItem(userBotsKey, JSON.stringify(updatedBots));
    
    toast({
      title: "Bot deleted",
      description: "Your chatbot has been removed successfully",
    });
  };

  const handleShareBot = (bot: any) => {
    const embedCode = `<script src="${window.location.origin}/widget/${bot.id}"></script>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Embed code copied!",
      description: "Share this code with your clients to deploy the chatbot",
    });
  };

  if (!user) {
    return <div className={`min-h-screen flex items-center justify-center ${
      actualTheme === 'dark' 
        ? 'bg-gradient-to-br from-slate-950 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      <div className={actualTheme === 'dark' ? 'text-white' : 'text-slate-900'}>Loading...</div>
    </div>;
  }

  const themeClasses = {
    background: actualTheme === 'dark' 
      ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
      : 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
    text: {
      primary: actualTheme === 'dark' ? 'text-white' : 'text-slate-900'
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      <DashboardHeader 
        user={user}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full grid-cols-3 ${actualTheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bots" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className={`text-3xl font-bold ${themeClasses.text.primary} mb-6 flex items-center gap-3`}>
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                Live Analytics Dashboard
              </h2>
              <LiveAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="bots" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-3xl font-bold ${themeClasses.text.primary} flex items-center gap-3`}>
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                Your AI Agents
              </h2>
              <Button 
                onClick={handleCreateBot} 
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Agent
              </Button>
            </div>

            <BotsGrid
              bots={bots}
              onCreateBot={handleCreateBot}
              onViewBot={handleViewBot}
              onEditBot={handleEditBot}
              onShareBot={handleShareBot}
              onDeleteBot={handleDeleteBot}
            />
          </TabsContent>

          <TabsContent value="users">
            <UserHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;

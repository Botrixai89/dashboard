
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Plus, Settings, Share2, Eye, Trash2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface BotsGridProps {
  bots: any[];
  onCreateBot: () => void;
  onViewBot: (botId: string) => void;
  onEditBot: (botId: string) => void;
  onShareBot: (bot: any) => void;
  onDeleteBot: (botId: string) => void;
}

const BotsGrid = ({ 
  bots, 
  onCreateBot, 
  onViewBot, 
  onEditBot, 
  onShareBot, 
  onDeleteBot 
}: BotsGridProps) => {
  const { actualTheme } = useTheme();

  const themeClasses = {
    text: {
      primary: actualTheme === 'dark' ? 'text-white' : 'text-slate-900',
      muted: actualTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
    },
    card: actualTheme === 'dark' 
      ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' 
      : 'bg-white border-slate-200 shadow-lg',
    button: actualTheme === 'dark' 
      ? 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white' 
      : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  };

  if (bots.length === 0) {
    return (
      <Card className={`text-center py-16 ${themeClasses.card} shadow-2xl`}>
        <CardContent>
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full w-fit mx-auto mb-6">
            <Bot className="h-16 w-16 text-white" />
          </div>
          <h3 className={`text-2xl font-semibold ${themeClasses.text.primary} mb-3`}>No AI agents yet</h3>
          <p className={`${themeClasses.text.muted} mb-6 text-lg`}>Create your first intelligent agent to get started</p>
          <Button 
            onClick={onCreateBot} 
            className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Agent
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bots.map((bot) => (
        <Card 
          key={bot.id} 
          className={`${themeClasses.card} ${
            actualTheme === 'dark' 
              ? 'hover:from-slate-700 hover:to-slate-800 hover:shadow-emerald-500/10' 
              : 'hover:shadow-emerald-500/20'
          } transition-all duration-300 hover:shadow-2xl group`}
        >
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${bot.primaryColor || '#10b981'}, #3b82f6)` }}
              >
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className={`text-lg ${themeClasses.text.primary} group-hover:text-emerald-400 transition-colors duration-300`}>
                  {bot.name}
                </CardTitle>
                <CardDescription className={themeClasses.text.muted}>{bot.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Active</span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => onViewBot(bot.id)} className={themeClasses.button}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEditBot(bot.id)} className={themeClasses.button}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onShareBot(bot)} className={themeClasses.button}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onDeleteBot(bot.id)}
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BotsGrid;

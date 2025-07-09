
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, LogOut, User, Sparkles } from "lucide-react";
import BotrixLogo from "./BotrixLogo";
import ThemeSettings from "./ThemeSettings";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardHeaderProps {
  user: any;
  onProfileClick: () => void;
  onLogout: () => void;
}

const DashboardHeader = ({ user, onProfileClick, onLogout }: DashboardHeaderProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const { actualTheme } = useTheme();

  const themeClasses = {
    header: actualTheme === 'dark' 
      ? 'bg-slate-900/80 backdrop-blur-sm shadow-2xl border-b border-slate-800' 
      : 'bg-white/80 backdrop-blur-sm shadow-2xl border-b border-slate-200',
    text: {
      secondary: actualTheme === 'dark' ? 'text-slate-300' : 'text-slate-600',
      primary: actualTheme === 'dark' ? 'text-white' : 'text-slate-900'
    },
    button: actualTheme === 'dark' 
      ? 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white' 
      : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  };

  return (
    <header className={themeClasses.header}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <BotrixLogo />
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${themeClasses.text.secondary}`}>
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm">Welcome, {user.name}</span>
            </div>
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className={themeClasses.button}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className={actualTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}>
                <DialogHeader>
                  <DialogTitle className={themeClasses.text.primary}>Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <ThemeSettings />
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={onProfileClick} className={themeClasses.button}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout} className={themeClasses.button}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeSettings = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const themeClasses = {
    card: actualTheme === 'dark' 
      ? 'bg-slate-900/50 backdrop-blur-sm border-slate-700 shadow-xl' 
      : 'bg-white/50 backdrop-blur-sm border-slate-200 shadow-xl',
    text: {
      primary: actualTheme === 'dark' ? 'text-white' : 'text-slate-900',
      secondary: actualTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
    }
  };

  return (
    <Card className={themeClasses.card}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text.primary} flex items-center gap-2`}>
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg">
            <Monitor className="h-4 w-4 text-white" />
          </div>
          Theme Settings
        </CardTitle>
        <CardDescription className={themeClasses.text.secondary}>
          Choose your preferred theme or follow system settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = theme === option.value;
            
            return (
              <Button
                key={option.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme(option.value)}
                className={`h-20 flex flex-col gap-2 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white border-green-500 shadow-lg' 
                    : actualTheme === 'dark'
                      ? 'bg-slate-800/50 hover:bg-slate-700 text-slate-300 border-slate-600 hover:text-white hover:border-green-500'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900 hover:border-green-500'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-xs font-medium">{option.label}</span>
                {isSelected && (
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
        <div className={`mt-4 p-3 rounded-lg border ${
          actualTheme === 'dark' 
            ? 'bg-slate-800/30 border-slate-700' 
            : 'bg-slate-50/30 border-slate-200'
        }`}>
          <p className={`text-xs ${themeClasses.text.secondary}`}>
            Current theme: <span className="text-green-400 font-medium capitalize">{actualTheme}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;

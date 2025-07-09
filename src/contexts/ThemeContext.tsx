
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('webbot_theme');
    return (saved as Theme) || 'dark'; // Default to dark theme
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const updateActualTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setActualTheme(systemTheme);
      } else {
        setActualTheme(theme);
      }
    };

    updateActualTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateActualTheme);
      return () => mediaQuery.removeEventListener('change', updateActualTheme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('webbot_theme', theme);
    
    // Apply theme to document
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light');
    body.classList.remove('dark', 'light');
    
    // Add the current theme class to both html and body
    root.classList.add(actualTheme);
    body.classList.add(actualTheme);
    
    // Set data attribute for additional styling
    root.setAttribute('data-theme', actualTheme);
    
    // Apply theme-specific styles to body
    if (actualTheme === 'light') {
      body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
      body.style.color = '#0f172a';
    } else {
      body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)';
      body.style.color = '#f8fafc';
    }
    
    console.log('Theme applied:', actualTheme);
  }, [theme, actualTheme]);

  const handleSetTheme = (newTheme: Theme) => {
    console.log('Setting theme to:', newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, actualTheme }}>
      <div className={actualTheme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

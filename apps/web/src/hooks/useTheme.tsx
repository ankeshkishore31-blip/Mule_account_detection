import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'daylight' | 'night';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('mule_theme') as Theme | null;
    if (saved === 'daylight' || saved === 'night') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'daylight';
  });

  const setTheme = (nextTheme: Theme) => {
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('mule_theme', nextTheme);
    setThemeState(nextTheme);

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 200);
  };

  const toggleTheme = () => {
    setTheme(theme === 'daylight' ? 'night' : 'daylight');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

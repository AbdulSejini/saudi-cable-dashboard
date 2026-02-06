import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Saudi Cable Brand Colors
export const themes = {
  light: {
    name: 'light',
    colors: {
      // Backgrounds
      bgPrimary: '#FFFFFF',
      bgSecondary: '#F5F5F5',
      bgTertiary: '#EAEAEA',
      bgCard: '#FFFFFF',
      bgGlass: 'rgba(255, 255, 255, 0.95)',
      // Text
      textPrimary: '#2E2D2C',
      textSecondary: '#666564',
      textMuted: '#ABABAB',
      // Borders
      border: '#EAEAEA',
      borderHover: '#D5D5D5',
      // Brand
      accent: '#F39200',
      accentLight: '#FFB84D',
      accentDark: '#CC7A00',
      // Status
      success: '#10B981',
      warning: '#F39200',
      danger: '#EF4444',
      info: '#3B82F6',
      // Shadows
      shadow: 'rgba(46, 45, 44, 0.08)',
      shadowHover: 'rgba(46, 45, 44, 0.12)',
    }
  },
  dark: {
    name: 'dark',
    colors: {
      // Backgrounds
      bgPrimary: '#1A1918',
      bgSecondary: '#2E2D2C',
      bgTertiary: '#3A3938',
      bgCard: '#2E2D2C',
      bgGlass: 'rgba(46, 45, 44, 0.95)',
      // Text
      textPrimary: '#FFFFFF',
      textSecondary: '#D5D5D5',
      textMuted: '#ABABAB',
      // Borders
      border: '#3A3938',
      borderHover: '#4A4948',
      // Brand
      accent: '#F39200',
      accentLight: '#FFB84D',
      accentDark: '#CC7A00',
      // Status
      success: '#10B981',
      warning: '#F39200',
      danger: '#EF4444',
      info: '#3B82F6',
      // Shadows
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowHover: 'rgba(0, 0, 0, 0.5)',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  const [colors, setColors] = useState(themes[theme].colors);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    setColors(themes[theme].colors);

    // Update CSS variables
    const root = document.documentElement;
    Object.entries(themes[theme].colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Add class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    setTheme,
    colors,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

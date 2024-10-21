import React from 'react';

export interface IThemeContext {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const ThemeContext = React.createContext<IThemeContext>({
  theme: 'light',
  toggleTheme: () => {},
  isDarkMode: false,
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      setIsDarkMode(newTheme === 'dark');
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        isDarkMode,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

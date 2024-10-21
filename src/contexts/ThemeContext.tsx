import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as 'light' | 'dark');
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme from AsyncStorage', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setTheme(newTheme);
      setIsDarkMode(newTheme === 'dark');
    } catch (error) {
      console.error('Failed to save theme to AsyncStorage', error);
    }
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

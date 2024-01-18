import { CssBaseline, ThemeProvider as MuiThemeProvider, Theme } from '@mui/material';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import favicons from '~/assets/favicons';
import { useAppSelector } from '~/store/hooks';
import { selectUserConfig } from '~/store/slices/userSlice';
import { env, variables } from '~/utils/env';
import { configTheme, themeVariables } from '~/utils/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: themeMode, mainColor, language } = useAppSelector(selectUserConfig);

  const [theme, setTheme] = useState<Theme>(configTheme(themeMode, mainColor));

  useEffect(() => {
    setTheme(configTheme(themeMode, mainColor));

    if (env(variables.environment) === 'development') {
      console.log(theme);
    }
  }, [themeMode, mainColor]);

  useEffect(() => {
    const faviconElement = document.getElementById('favicon') as HTMLLinkElement;
    faviconElement.href = favicons[mainColor] ?? favicons['#000000'];
    document.documentElement.style.setProperty('--color-primary', mainColor);
  }, [mainColor]);

  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

      {children}

      <ToastContainer
        theme={themeMode}
        autoClose={2000}
        style={{ top: themeVariables.headerHeight }}
        toastStyle={{ backgroundColor: theme.palette.background.paper }}
      />
    </MuiThemeProvider>
  );
}

import { BrowserRouter } from 'react-router-dom';
import ReduxProvider from './ReduxProvider';
import TanStackProvider from './TanStackProvider';
import ThemeProvider from './ThemeProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanStackProvider>
      <ReduxProvider>
        <ThemeProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
      </ReduxProvider>
    </TanStackProvider>
  );
}

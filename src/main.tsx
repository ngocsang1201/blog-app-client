import { createRoot } from 'react-dom/client';
import App from './App';
import Providers from './providers';
import 'i18n';
import './styles/index.css';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  <Providers>
    <App />
  </Providers>
);

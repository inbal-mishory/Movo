import '@fontsource-variable/open-sans/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App } from './App';
import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/ui.css';
import './styles/dashboard.css';
import './styles/schedule.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);

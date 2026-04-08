import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App, { getTenantFromHostname } from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext';

const existingTenant =
  sessionStorage.getItem('tenantId') || localStorage.getItem('tenantId') || getTenantFromHostname();
const tenantId = existingTenant;
if (!sessionStorage.getItem('tenantId')) {
  sessionStorage.setItem('tenantId', tenantId);
}
if (!localStorage.getItem('tenantId')) {
  localStorage.setItem('tenantId', tenantId);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <ThemeProvider tenantId={tenantId}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

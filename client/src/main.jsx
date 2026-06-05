import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/react';
import App from './App.jsx';
import { store } from './app/store.js';
import './index.css';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

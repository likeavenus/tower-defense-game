import React from 'react';
import ReactDOM from 'react-dom/client';

// import './animation';
import App from './App';
import './index.scss';
import './game';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

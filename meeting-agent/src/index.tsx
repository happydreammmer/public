import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './styles/base.css';
import './styles/content.css';
import './styles/header.css';
import './styles/recorder.css';
import './styles/sidebar.css';
import './styles/tabs.css';
import './styles/utility.css';
import './styles/variables.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
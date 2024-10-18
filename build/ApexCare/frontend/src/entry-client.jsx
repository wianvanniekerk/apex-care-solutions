import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import AppRouter from './components/router'; 
import './styles.css';

createRoot(
 
  document.getElementById('root')
).render( <React.StrictMode>
    <AppRouter />
  </React.StrictMode>);

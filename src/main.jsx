import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Falha ao renderizar o App:', error);
  }
} else {
  console.error('Elemento #root não encontrado no DOM.');
}


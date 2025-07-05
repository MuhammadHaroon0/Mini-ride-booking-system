import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import "./utils/axios"; // just importing will run the config code

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position='top-right' />
      <App />
    </BrowserRouter>
  </StrictMode>
)


import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const renderApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found! Creating one...");
    const newRoot = document.createElement("div");
    newRoot.id = "root";
    document.body.appendChild(newRoot);
  }
  
  try {
    createRoot(document.getElementById("root")!).render(
      <App />
    );
    console.info("App rendered successfully");
  } catch (error) {
    console.error("Failed to render app:", error);
    
    // Display a minimal error UI
    const errorDiv = document.createElement("div");
    errorDiv.style.padding = "20px";
    errorDiv.style.margin = "20px";
    errorDiv.style.backgroundColor = "#1a1f2c";
    errorDiv.style.color = "#e8c282";
    errorDiv.style.borderRadius = "8px";
    errorDiv.style.border = "1px solid #e8c28244";
    errorDiv.style.fontFamily = "system-ui, sans-serif";
    errorDiv.innerHTML = `
      <h2>Something went wrong</h2>
      <p>The application couldn't load properly. Please refresh the page.</p>
      <button onclick="window.location.reload()" 
              style="background-color:#e8c282; color:#1a1f2c; border:none; 
                     padding:8px 16px; border-radius:4px; cursor:pointer; 
                     margin-top:10px;">
        Refresh
      </button>
    `;
    
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = "";
      root.appendChild(errorDiv);
    }
  }
};

// Ensure the container exists before rendering
document.addEventListener('DOMContentLoaded', renderApp);

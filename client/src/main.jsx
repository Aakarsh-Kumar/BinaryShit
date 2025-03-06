import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
const allowedOrigins = import.meta.env.VITE_ALLOWED_ORIGINS.split(",");

if (!allowedOrigins.some((origin) => window.location.origin.includes(origin))) {
  document.body.innerHTML = "Access Denied";
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import App from "@/App";
import "@/index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

createRoot(document.body).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

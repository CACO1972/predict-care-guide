import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initMetaPixel, trackPageView } from "./utils/metaPixel";

// Initialize Meta Pixel for Clinica Miró
initMetaPixel();

// Track initial page view
trackPageView();

createRoot(document.getElementById("root")!).render(<App />);

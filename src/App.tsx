import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentBasicSuccess from "./pages/PaymentBasicSuccess";
import PaymentPremiumSuccess from "./pages/PaymentPremiumSuccess";
import PatientQuestionnaire from "./pages/PatientQuestionnaire";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evaluacion" element={<PatientQuestionnaire />} />
          <Route path="/pago-exitoso" element={<PaymentSuccess />} />
          <Route path="/gracias-basico" element={<PaymentBasicSuccess />} />
          <Route path="/gracias-premium" element={<PaymentPremiumSuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

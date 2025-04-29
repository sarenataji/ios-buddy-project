
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScheduleProvider } from "@/contexts/ScheduleContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import Moments from "./pages/Moments";
import Reflection from "./pages/Reflection";
import { MomentProvider } from "./contexts/MomentContext";
import { CountdownProvider } from "./contexts/CountdownContext";
import { FaceProvider } from "./contexts/FaceContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Force the dark theme on body and html
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    document.body.style.backgroundColor = "#121212";
    document.documentElement.style.backgroundColor = "#121212";
    
    // Debug logging to help identify any issues
    console.log("App mounted, dark theme applied");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScheduleProvider>
          <MomentProvider>
            <CountdownProvider>
              <FaceProvider>
                <div className="bg-[#121212] min-h-screen text-[#edd6ae]">
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/moments" element={<Moments />} />
                      <Route path="/reflection" element={<Reflection />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </div>
              </FaceProvider>
            </CountdownProvider>
          </MomentProvider>
        </ScheduleProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

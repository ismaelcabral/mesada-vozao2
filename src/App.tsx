import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";

// Layouts
import { ParentLayout } from "@/components/layouts/ParentLayout";
import { ChildLayout } from "@/components/layouts/ChildLayout";

// Pages
import Home from "@/pages/Home";

// Parent Pages
import ParentHome from "@/pages/parent/Home";
import ParentTasks from "@/pages/parent/Tasks";
import ParentCards from "@/pages/parent/Cards";
import ParentGoals from "@/pages/parent/Goals";
import ParentMessages from "@/pages/parent/Messages";
import ParentMonthEnd from "@/pages/parent/MonthEnd";
import ParentMesadaSettings from "@/pages/parent/MesadaSettings";

// Child Pages
import ChildHome from "@/pages/child/Home";
import ChildTasks from "@/pages/child/Tasks";
import ChildMessages from "@/pages/child/Messages";
import ChildMesadaHistory from "@/pages/child/MesadaHistory";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Home - Role Selection */}
            <Route path="/" element={<Home />} />

            {/* Parent Routes */}
            <Route path="/parent/home" element={<ParentLayout><ParentHome /></ParentLayout>} />
            <Route path="/parent/tasks" element={<ParentLayout><ParentTasks /></ParentLayout>} />
            <Route path="/parent/cards" element={<ParentLayout><ParentCards /></ParentLayout>} />
            <Route path="/parent/goals" element={<ParentLayout><ParentGoals /></ParentLayout>} />
            <Route path="/parent/messages" element={<ParentLayout><ParentMessages /></ParentLayout>} />
            <Route path="/parent/month-end" element={<ParentLayout><ParentMonthEnd /></ParentLayout>} />
            <Route path="/parent/mesada-settings" element={<ParentLayout><ParentMesadaSettings /></ParentLayout>} />

            {/* Child Routes */}
            <Route path="/child/home" element={<ChildLayout><ChildHome /></ChildLayout>} />
            <Route path="/child/tasks" element={<ChildLayout><ChildTasks /></ChildLayout>} />
            <Route path="/child/messages" element={<ChildLayout><ChildMessages /></ChildLayout>} />
            <Route path="/child/mesada-history" element={<ChildLayout><ChildMesadaHistory /></ChildLayout>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

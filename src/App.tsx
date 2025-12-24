import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import HRPanel from "./pages/HRPanel";
import EmployeeResponses from "./pages/EmployeeResponses";
import ManagerActions from "./pages/ManagerActions";
import ManagerAssignments from "./pages/ManagerAssignments";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import SuggestionBox from "./pages/SuggestionBox";
import SuggestionsManagement from "./pages/SuggestionsManagement";
import Targets from "./pages/Targets";
import Analytics from "./pages/Analytics";
import Install from "./pages/Install";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/hr-panel" element={
            <ProtectedRoute>
              <HRPanel />
            </ProtectedRoute>
          } />
          <Route path="/employee-responses" element={
            <ProtectedRoute>
              <EmployeeResponses />
            </ProtectedRoute>
          } />
          <Route path="/manager-actions" element={
            <ProtectedRoute>
              <ManagerActions />
            </ProtectedRoute>
          } />
          <Route path="/manager-assignments" element={
            <ProtectedRoute>
              <ManagerAssignments />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/suggestion-box" element={<SuggestionBox />} />
          <Route path="/install" element={<Install />} />
          <Route path="/suggestions-management" element={
            <ProtectedRoute>
              <SuggestionsManagement />
            </ProtectedRoute>
          } />
          <Route path="/targets" element={
            <ProtectedRoute>
              <Targets />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

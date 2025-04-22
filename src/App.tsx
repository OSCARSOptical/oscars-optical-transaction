
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Transactions from "./pages/Transactions";
import BalanceSheetPage from "./pages/BalanceSheetPage";
import NotFound from "./pages/NotFound";
import PatientDetailPage from "./pages/PatientDetail";
import TransactionDetail from "./pages/TransactionDetail";
import NewTransaction from "./pages/NewTransaction";
import Reports from "./pages/Reports";
import JobOrders from "./pages/JobOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/balance-sheet" element={<BalanceSheetPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/job-orders" element={<JobOrders />} />
            <Route path="/patients/:patientCode" element={<PatientDetailPage />} />
            <Route path="/patients/:patientCode/transactions/:transactionCode" element={<TransactionDetail />} />
            <Route 
              path="/transactions/:transactionCode" 
              element={<TransactionDetail />} 
            />
            <Route path="/transactions/new" element={<NewTransaction />} />
            <Route path="/transactions/new/:patientId" element={<NewTransaction />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

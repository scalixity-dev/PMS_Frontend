import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import DashboardLayout from './components/dashboardlayout/DashboardLayout';
import HomePage from './pages/basewebsite/home';
import ScreeningPage from './pages/basewebsite/features/screening/index';
import LeasePage from './pages/basewebsite/features/lease/index';
import FinancePage from './pages/basewebsite/features/finance/index';
import LeadsPage from './pages/basewebsite/features/leads/index';
import PricingPage from './pages/basewebsite/pricing';
import LoginPage from './pages/basewebsite/auth/login';
import SignUpPage from './pages/basewebsite/auth/signUp';
import OtpPage from './pages/basewebsite/auth/otp';
import OAuthCallbackPage from './pages/basewebsite/auth/oauth-callback';
import OAuthCompletePage from './pages/basewebsite/auth/signUp/oauth-complete';
import TeamPage from './pages/basewebsite/features/team/index';
import LandlordUseCasesPage from './pages/basewebsite/usecases/landlord';
import ResourcePage from './pages/basewebsite/resources';
import TenantPage from './pages/basewebsite/usecases/tenant';
import ServiceProsPage from './pages/basewebsite/usecases/servicepros';
import Dashboard from './pages/Dashboard/Dashboard';
import ListUnit from './pages/Dashboard/features/ListUnit';
import AddProperty from './pages/Dashboard/features/Property/AddProperty';
import AddIncomeInvoice from './pages/Dashboard/features/Transactions/AddIncomeInvoice';
import AddExpenseInvoice from './pages/Dashboard/features/Transactions/AddExpenseInvoice';
// import ListUnit from './pages/Dashboard/features/ListUnit/ListUnit';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signup/oauth-complete" element={<OAuthCompletePage />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
         

          <Route path="/usecases/landlord" element={<LandlordUseCasesPage />} />
          <Route path="/usecases/tenant" element={<TenantPage />} />
          <Route path="/usecases/servicepros" element={<ServiceProsPage />} />
          <Route path="/features/screening" element={<ScreeningPage />} />
          <Route path="/features/lease" element={<LeasePage />} />
          <Route path="/features/finance" element={<FinancePage />} />
          <Route path="/features/leads" element={<LeadsPage />} />
          <Route path="/features/team" element={<TeamPage />} />
          <Route path="/resources" element={<ResourcePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
                <Dashboard />
              // </ProtectedRoute>
            }
          />
          <Route path="/dashboard/list-unit" element={<ListUnit />} />
          <Route path="/dashboard/property/add" element={<AddProperty />} />
          <Route path="/dashboard/accounting/transactions/income/add" element={<AddIncomeInvoice />} />
          <Route path="/dashboard/accounting/transactions/expense/add" element={<AddExpenseInvoice />} />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leasing"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounting"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/downloads"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

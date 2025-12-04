import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import AddProperty from './pages/Dashboard/features/Properties/AddProperty';
import EditProperty from './pages/Dashboard/features/Properties/EditProperty';
import AddIncomeInvoice from './pages/Dashboard/features/Transactions/AddIncomeInvoice';
import AddExpenseInvoice from './pages/Dashboard/features/Transactions/AddExpenseInvoice';
import AddMaintenanceRequest from './pages/Dashboard/features/Maintenance/AddMaintenanceRequest';
import Properties from './pages/Dashboard/features/Properties/Properties';
import Equipments from './pages/Dashboard/features/Equipments/Equipments';
import PropertyDetail from './pages/Dashboard/features/Properties/PropertyDetail';
import Listing from './pages/Dashboard/features/Listing/Listing';
import ListingDetail from './pages/Dashboard/features/Listing/ListingDetail';
import Calendar from './pages/Dashboard/features/Calendar/Calendar';
import Tasks from './pages/Dashboard/features/Tasks/Tasks';
import Tenants from './pages/Dashboard/features/Tenants/Tenants';
import TenantDetail from './pages/Dashboard/features/Tenants/TenantDetail';
import Units from './pages/Dashboard/features/Units/Units';
// import ListUnit from './pages/Dashboard/features/ListUnit/ListUnit';

// Create a QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="/dashboard/properties" element={<Properties />} />
            <Route path="/dashboard/portfolio/units" element={<Units />} />
            <Route path="/dashboard/properties/:id" element={<PropertyDetail />} />
            <Route path="/dashboard/portfolio/listing" element={<Listing />} />
            <Route path="/dashboard/listings/:id" element={<ListingDetail />} />
            <Route path="/dashboard/calendar" element={<Calendar />} />
            <Route path="/dashboard/tasks" element={<Tasks />} />
            <Route path="/dashboard/equipments" element={<Equipments />} />
            <Route path="/dashboard/property/add" element={<AddProperty />} />
            <Route path="/dashboard/properties/edit/:id" element={<EditProperty />} />
            <Route path="/dashboard/accounting/transactions/income/add" element={<AddIncomeInvoice />} />
            <Route path="/dashboard/accounting/transactions/expense/add" element={<AddExpenseInvoice />} />
            <Route path="/dashboard/maintenance/request" element={<AddMaintenanceRequest />} />
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
            <Route path="/dashboard/contacts/tenants" element={<Tenants />} />
            <Route path="/dashboard/contacts/tenants/:id" element={<TenantDetail />} />
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
    </QueryClientProvider>
  );
};

export default App;

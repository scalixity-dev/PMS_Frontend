import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
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
import TeamPage from './pages/basewebsite/features/team/index';
import LandlordUseCasesPage from './pages/basewebsite/usecases/landlord';
import ResourcePage from './pages/basewebsite/resources';
import TenantPage from './pages/basewebsite/usecases/tenant';
import ServiceProsPage from './pages/basewebsite/usecases/servicepros';
import Dashboard from './pages/Dashboard/Dashboard';
import ListUnit from './pages/Dashboard/features/ListUnit/ListUnit';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/otp" element={<OtpPage />} />
         
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/list-unit" element={<ListUnit />} />
          <Route path="/portfolio" element={<Dashboard />} />
          <Route path="/leasing" element={<Dashboard />} />
          <Route path="/contacts" element={<Dashboard />} />
          <Route path="/accounting" element={<Dashboard />} />
          <Route path="/maintenance" element={<Dashboard />} />
          <Route path="/documents" element={<Dashboard />} />
          <Route path="/reports" element={<Dashboard />} />
          <Route path="/downloads" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

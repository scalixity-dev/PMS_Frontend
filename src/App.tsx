import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/home';
import ScreeningPage from './pages/features/screening/index';
import LeasePage from './pages/features/lease/index';
import FinancePage from './pages/features/finance/index';
import LeadsPage from './pages/features/leads/index';
import PricingPage from './pages/pricing';
import LoginPage from './pages/auth/login';
import SignUpPage from './pages/auth/signUp';
import TeamPage from './pages/features/team/index';
import LandlordUseCasesPage from './pages/usecases/landlord';
import ResourcePage from './pages/resources';
import TenantPage from './pages/usecases/tenant';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
         
          <Route path="/usecases/landlord" element={<LandlordUseCasesPage />} />
          <Route path="/usecases/tenant" element={<TenantPage />} />
          <Route path="/features/screening" element={<ScreeningPage />} />
          <Route path="/features/lease" element={<LeasePage />} />
          <Route path="/features/finance" element={<FinancePage />} />
          <Route path="/features/leads" element={<LeadsPage />} />
          <Route path="/features/team" element={<TeamPage />} />
          <Route path="/resources" element={<ResourcePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

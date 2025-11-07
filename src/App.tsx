import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/home';
import ScreeningPage from './pages/features/screening/index';
import LeasePage from './pages/features/lease/index';
import FinancePage from './pages/features/finance/index';
import LeadsPage from './pages/features/leads/index';
import LoginPage from './pages/login';
import SignUpPage from './pages/signUp';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/features/screening" element={<ScreeningPage />} />
          <Route path="/features/lease" element={<LeasePage />} />
          <Route path="/features/finance" element={<FinancePage />} />
          <Route path="/features/leads" element={<LeadsPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

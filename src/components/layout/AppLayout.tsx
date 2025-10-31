import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const AppLayout: React.FC = () => {
  return (
  <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        {/* Page content (excluding header/footer) wrapped with uniform padding */}
        <div className="p-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;

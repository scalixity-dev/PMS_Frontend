import React from 'react';
import { useIsMutating } from '@tanstack/react-query';

export const GlobalLoader: React.FC = () => {
  // We track active mutations (e.g., form submissions, API POST/PUT/DELETE calls)
  const isMutating = useIsMutating();

  if (isMutating === 0) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/30 backdrop-blur-sm flex items-center justify-center transition-opacity">
      <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#88D94C]/20 border-t-[#88D94C] rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-700 tracking-wide">Processing...</p>
      </div>
    </div>
  );
};

export default GlobalLoader;

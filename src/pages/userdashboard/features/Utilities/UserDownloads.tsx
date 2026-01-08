import React from "react";
import { ListPlus } from "lucide-react";

const Downloads: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-100 min-h-[400px] text-center shadow-sm mx-6 mt-6">
      <div className="mb-4 p-4 bg-gray-50 rounded-full">
        <ListPlus size={48} className="text-[#566573]" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h2 className="text-xl font-bold text-[#111827]">No files downloaded yet</h2>
        <p className="text-sm text-[#7F8C8D] leading-relaxed">
          There are no downloaded files. Once you export some files, they will appear here for you to access.
        </p>
      </div>
    </div>
  );
};

export default Downloads;



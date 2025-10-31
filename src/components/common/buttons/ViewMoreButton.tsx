import React from "react";
import { ArrowRight } from "lucide-react";

const ViewMoreButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-fit mt-4 inline-flex items-center gap-2 rounded-md bg-[#3D7475] px-4 py-2 text-white border border-white/20 shadow-sm hover:opacity-95 transition"
    style={{ border: 'none' }}
  >
    <span className="text-sm font-medium">View More</span>
    <ArrowRight size={16} />
  </button>
);

export default ViewMoreButton;

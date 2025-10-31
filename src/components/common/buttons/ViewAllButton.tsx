import React from "react";

const ViewAllButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
  <button
    onClick={onClick}
    className="text-base px-8 py-3 shadow-lg border-0 rounded-md bg-[#3D7475] text-white"
  >
    View All
  </button>
  >
    View All
  </button>
);

export default ViewAllButton;

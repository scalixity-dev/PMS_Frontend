import React from "react";

type ViewAllButtonProps = { onClick?: () => void };

const ViewAllButton: React.FC<ViewAllButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-base px-8 py-3 border-0 rounded-md bg-[#3D7475] text-white shadow-[0px_4px_0px_0px_#00000040]"
  >
    View All
  </button>
);

export default ViewAllButton;

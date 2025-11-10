import React from 'react';
// Make sure to install lucide-react: npm install lucide-react
import { Video } from 'lucide-react'; 

const VideoTutorialsCard: React.FC = () => {
  return (
    // Main container: Light green bg, rounded, flex layout, and overflow-hidden
    <div className="max-w-7xl mt-10 mb-10 mx-auto px-10  bg-[#819A78]/20 rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-sm">
      
      {/* Left Side: Text Content */}
      <div className="flex-1 md:p-12 flex flex-col justify-center">
        
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Video Tutorials
        </h2>
        
        <p className="text-lg text-gray-600 mb-6">
          Learn by watching short video tutorials
        </p>

        {/* Button */}
          <button className="bg-gradient-to-r from-[#3A4E33] to-[#85B474]  hover:from-[#3A4E33] hover:to-[#3A4E33] text-white font-semibold py-3 w-fit px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center mx-auto md:mx-0">
          View Tutorials
          <Video className="h-5 w-5 ml-2" />
        </button>
      </div>

      <div className="flex-1 md:flex-[1.5] my-6 relative min-h-[300px] md:min-h-0">
        <img
          src="/videoTutorial.jpg"
          alt="Modern House Patio"
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default VideoTutorialsCard;
import React from 'react';
// Make sure to install lucide-react: npm install lucide-react
import { Video } from 'lucide-react'; 

const VideoTutorialsCard: React.FC = () => {
    return (
      <div className="max-w-7xl mb-8 mx-auto px-4 sm:px-6 bg-[#819A78]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
      
      <div className="flex-1 text-center md:text-left md:pr-8 mb-8 md:mb-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Video Tutorials
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Learn by watching short video tutorials
        </p>

        <button className="bg-gradient-to-r from-[#3A4E33] to-[#85B474]  hover:from-[#3A4E33] hover:to-[#3A4E33] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center mx-auto md:mx-0">
            View Tutorials
            <Video className="h-5 w-5 ml-2" />
        </button>
      </div>

      <div className="flex-none w-full md:w-auto">
        <img
          src="/videoTutorial.jpg"
          alt="Video tutorials preview"
          className="rounded-lg lg:rounded-xl md:rounded-xl shadow-lg w-full max-w-[350px] h-auto object-cover mx-auto"
         />
      </div>
    </div>
   );
};

export default VideoTutorialsCard;
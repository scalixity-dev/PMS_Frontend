import React from 'react';

const HeroStamp: React.FC = () => {
  return (
    <div className="hidden lg:flex items-end justify-end">
      <div className="flex h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 items-center justify-center rounded-full bg-black shadow-md border border-gray-700 p-2 md:p-2.5 lg:p-3 -translate-y-16 md:-translate-y-20 lg:-translate-y-28">
        <svg
          viewBox="0 0 132 132"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path
              id="circlePath"
              d="M66,66 m-51,0a51,51 0 1,1 102,0a51,51 0 1,1 -102,0"
              fill="none"
            />
          </defs>
          <g transform="rotate(260,66,66)">
            <text fill="white" fontSize="12" fontWeight="600" letterSpacing="3.5">
              <textPath href="#circlePath" startOffset="0%">
                ✨ Discover Your Dream Property
              </textPath>
            </text>
          </g>
          <circle cx="66" cy="66" r="30.1116" fill="#0f0f0f" stroke="#262626" strokeWidth="1.2" opacity="1" />
          <path
            d="M 57.9559 66 L 66 57.9559 L 74.0441 66 M 66 57.9559 L 66 80"
            stroke="white"
            strokeWidth="1.51"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="1"
            transform="rotate(45,66,66)"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroStamp;



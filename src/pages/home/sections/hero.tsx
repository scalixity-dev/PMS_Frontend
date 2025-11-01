import React from 'react';

const HeroSection: React.FC = () => {
  const badgeClassName = "inline-flex items-center justify-center min-w-32 h-10 gap-1 rounded-lg px-4 py-3 border border-white bg-[#819A78] text-white shadow-md font-heading font-medium text-sm leading-[150%] tracking-normal";
  const features = ["Free 14 day trial", "Credit card required", "Cancel anytime"] as const;
  return (
    <section className="w-full bg-white p-4 sm:p-4 lg:p-6">
      <div className="mx-auto max-w-8xl rounded-3xl bg-(--color-header-bg) px-6 py-10 shadow-md sm:px-8 sm:py-14 lg:min-h-[10rem] xl:min-h-[37.5rem] 2xl:min-h-[44.375rem]  3xl:min-h-[48.5rem] lg:px-16 lg:py-14 2xl:py-20 3xl:px-20 4xl:px-2 overflow-visible">
        <div className="relative grid items-center gap-4  lg:grid-cols-[50%_15%_35%] 2xl:grid-cols-[50%_10%_40%] ">
          {/* Left: Content */}
          <div>
            <p className="mb-6 font-heading text-2xl text-[#0B696B] font-medium leading-[150%] tracking-normal text-secondary">Property Management Software</p>

            <h1 className="mb-6 font-heading text-5xl font-medium leading-[120%] tracking-normal text-heading">
              The all-in-one platform that
             
              scales with your portfolio
            </h1>

            <p className="mb-14  font-heading font-light text-base leading-[150%] tracking-normal text-subheading">
              PMS helps you simplify and grow your property management business. Find everything you
              need to list properties, collect rent, and screen pms — in one, easy place.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                className="inline-flex items-center justify-center w-36 h-14 gap-2 rounded-lg px-5 py-4 border-2 border-[#4B5563] bg-transparent hover:bg-[#1F2937] opacity-100 rotate-0 font-heading font-medium text-lg leading-none whitespace-nowrap tracking-[0] text-black hover:text-white "
              >
                Learn More
              </button>
              <button
                className="inline-flex items-center justify-center w-40 h-14 gap-2 rounded-lg px-5 py-4 border border-white bg-[#3D7475] opacity-100 rotate-0 font-heading font-light text-lg leading-none whitespace-nowrap tracking-[0] text-white hover:opacity-90 shadow-md"
              >
                Get Started
              </button>
            </div>

            <div className="mt-8 flex flex-wrap whitespace-nowrap gap-3 text-sm">
              {features.map((text) => (
                <span key={text} className={badgeClassName}>{text}</span>
              ))}
            </div>
          </div>

          {/* Middle: Stamp */}
          <div className="flex items-end justify-end">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-black shadow-md border border-gray-700 p-3 -translate-y-36">
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

                {/* Full circular text */}
                <g transform="rotate(260,66,66)"> 
                  <text fill="white" fontSize="12" fontWeight="600" letterSpacing="3.5">
                    <textPath href="#circlePath" startOffset="0%">
                      ✨ Discover Your Dream Property 
                    </textPath>
                  </text>
                </g>

                {/* Inner circle */}
                <circle cx="66" cy="66" r="30.1116" fill="#0f0f0f" stroke="#262626" strokeWidth="1.2" opacity="1" />

                {/* Arrow */}
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

          {/* Right: Image */}
          <div className="flex h-full ">
            <img
              src="/hero.png"
              alt="Modern property with pool"
              className="w-full max-w-2xl max-h-120 rotate-0 rounded-2xl object-cover shadow-lg translate-y-4 sm:translate-y-6 lg:translate-y-32 xl:translate-y-12 2xl:translate-y-28"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



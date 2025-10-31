import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full bg-white p-10 sm:p-14 lg:p-14">
      <div className="mx-auto max-w-[1824px] rounded-[27.12px] bg-[var(--color-header-bg)] px-6 py-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:px-8 sm:py-14 lg:min-h-[785px] lg:px-20 lg:py-20 2xl:py-24 3xl:px-24 4xl:px-28 overflow-visible">
        <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-9 2xl:gap-8 3xl:gap-10 4xl:gap-12">
          {/* Left: Content */}
          <div>
            <p className="mb-6 font-heading text-[26px] text-[#0B696B] font-medium leading-[150%] tracking-normal text-secondary">Property Management Software</p>

            <h1 className="mb-6 font-heading text-[52px] font-medium leading-[120%] tracking-normal text-heading">
              The all-in-one platform that
             
              scales with your portfolio
            </h1>

            <p className="mb-14  font-heading font-light text-[16.78px] leading-[150%] tracking-normal text-subheading">
              PMS helps you simplify and grow your property management business. Find everything you
              need to list properties, collect rent, and screen pms — in one, easy place.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                className="inline-flex items-center justify-center w-[141.553px] h-[57.165px] gap-[6.93px] rounded-[14.61px] px-[20.78px] py-[15.58px] border-2 border-[#4B5563] bg-[transparent] hover:bg-[#1F2937] opacity-100 rotate-0 font-[Manrope] font-semibold text-[18.78px] leading-[1] whitespace-nowrap tracking-[0] text-black hover:text-white "
              >
                Learn More
              </button>
              <button
                className="inline-flex items-center justify-center w-[153.356px] h-[57.165px] gap-[6.93px] rounded-[14.61px] px-[20.78px] py-[15.58px] border border-white bg-[#3D7475] opacity-100 rotate-0 font-[Manrope] font-semibold text-[18.78px] leading-none whitespace-nowrap tracking-[0] text-white hover:opacity-90 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
              >
                Get Started
              </button>
            </div>

            <div className="mt-8 flex flex-wrap whitespace-nowrap gap-3 text-sm">
              <span className="inline-flex items-center justify-center min-w-[122.972px] h-[41.615px] gap-[1.41px] rounded-[13.47px] px-[16.96px] py-[11.31px] border border-white bg-[#819A78] text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] font-heading font-medium text-[12.72px] leading-[150%] tracking-normal">Free 14 day trial</span>
              <span className="inline-flex items-center justify-center min-w-[122.972px] h-[41.615px] gap-[1.41px] rounded-[13.47px] px-[16.96px] py-[11.31px] border border-white bg-[#819A78] text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] font-heading font-medium text-[12.72px] leading-[150%] tracking-normal">Credit card required</span>
              <span className="inline-flex items-center justify-center min-w-[122.972px] h-[41.615px] gap-[1.41px] rounded-[13.47px] px-[16.96px] py-[11.31px] border border-white bg-[#819A78] text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] font-heading font-medium text-[12.72px] leading-[150%] tracking-normal">Cancel anytime</span>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative flex h-full flex-col items-end justify-end">
          <div className="mb-4 flex h-[132px] w-[132px] items-center justify-center rounded-full bg-black shadow-md border border-gray-700 p-3 absolute left-0 top-[45%] -translate-y-28">
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

            <img
              src="/hero.png"
              alt="Modern property with pool"
              className="w-full max-w-[649.3453369140625px] rotate-0 rounded-[15.03px] object-cover shadow-lg translate-y-4 sm:translate-y-6 lg:translate-y-36"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



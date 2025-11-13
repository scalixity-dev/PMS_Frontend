import { Link } from 'react-router-dom';

const ExplorePropertiesBanner = () => {
  return (
  <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white py-10 sm:py-16 lg:py-20">
      {/* Left abstract image - positioned at bottom, responsive sizing */}
      <div className="absolute left-0 bottom-0 w-1/4 sm:w-1/3 h-[50%] sm:h-[60%] lg:h-[70%]">
        <img
          src="https://res.cloudinary.com/dxwspucxw/image/upload/v1761905090/abstractleft_yhtzva.png"
          alt="Abstract Left"
          className="h-full w-full object-cover filter brightness-90"
        />
      </div>

      {/* Right abstract image - positioned at bottom, mirrored, responsive sizing */}
      <div className="absolute right-0 bottom-0 w-1/4 sm:w-1/3 h-[50%] sm:h-[60%] lg:h-[70%]">
        <img
          src="https://res.cloudinary.com/dxwspucxw/image/upload/v1761905090/abstractright_qhdpgm.png"
          alt="Abstract Right"
          className="h-full w-full object-cover filter brightness-90"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>

      {/* Content Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* Use a responsive row: stacked on small screens, row on md+ with items centered and space between text and button */}
        <div className="flex w-full flex-col px-4 sm:px-6 gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
          <div className="md:max-w-3xl">
            <h2 className="text-xl sm:text-2xl text-gray-900 font-medium leading-normal lg:text-3xl xl:text-4xl">
              List, manage, and maintain your <br className="hidden sm:block" />
              properties at scale <span className="text-teal-700">Effortlessly..</span>
            </h2>

            <p className="mt-2 sm:mt-3 text-xs leading-relaxed text-gray-600 sm:text-sm">
              Manage every aspect of your properties from one powerful platform — list,
              screen, and lease with ease. Handle rent collection and maintenance
              seamlessly while saving time through automation. Built for modern
              investors and managers, PMS simplifies every task. Grow your portfolio
              effortlessly while staying in complete control.
            </p>
          </div>

          {/* Button container - keeps button on the right and vertically centered on md+ */}
          <div className="mt-2 sm:mt-3 flex-shrink-0 md:mt-0">
            <Link to="/features/screening" className="inline-block rounded-md bg-[var(--color-primary)] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-normal text-gray-50 transition-all duration-200 hover:opacity-90" aria-label="Explore properties">
              Explore Properties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplorePropertiesBanner;

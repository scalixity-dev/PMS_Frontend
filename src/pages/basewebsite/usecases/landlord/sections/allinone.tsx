import React from "react";

const AllInOneUseCaseSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white px-6 pb-10 sm:px-10">
      <div className="mx-auto max-w-7xl flex w-full  flex-col items-center gap-14 lg:flex-row lg:items-start lg:gap-20">
        <div className="max-w-xl text-center lg:text-left">
          <span className="inline-flex items-center rounded-sm border border-[#0CA474]/30 bg-[#E5F8EE] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0CA474] shadow-sm">
            Property Manager
          </span>

          <h2 className="mt-6 text-4xl font-medium leading-tight text-[#091431] sm:text-[44px]">
            All-in-One Software for
            <br className="hidden sm:block" />
            <span className="text-[#0CA474]"> Busy Property </span>
            Managers
          </h2>

          <p className="mt-5 text-base leading-relaxed text-[#54606F] sm:text-lg">
            Fill vacancies, collect rent, and manage your entire workflow from one easy dashboard.
            Property managers save up to 9 hours a week on average with SmartTenantAI&apos;s Team Management
            tools.
          </p>
        </div>

        <div className="flex w-full max-w-2xl flex-1 justify-center lg:justify-end">
          <img
            src="/allinone.png"
            alt="All-in-One analytics preview"
            className="w-full max-w-xl rounded-[48px] object-contain "
          />
        </div>
      </div>
    </section>
  );
};

export default AllInOneUseCaseSection;

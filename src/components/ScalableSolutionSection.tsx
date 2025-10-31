// components/ScalableSolutionSection.tsx
import ScalableCard from "./cards/ScalableCard";
import PaginationButtons from "./common/buttons/PaginationButtons";

export default function ScalableSolutionSection() {
  return (
    <section className="max-w-7xl mx-auto px-0 py-16 flex flex-col gap-8">
      <div className="px-6 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-heading)] font-heading">
          A solution that scales with your needs
        </h2>
        <PaginationButtons containerClassName="flex items-center gap-2" />
      </div>

  {/* Cards Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 w-full">
    <ScalableCard
          image="src\assets\images\LandLords.png"
          title="Landlords"
          description="Protect your property and find Pms you trust."
        />
        <ScalableCard
          image="src\assets\images\propertymanager.png"
          title="Property Manager"
          description="Stay organized and connected with your team."
        />
        <ScalableCard
          image="src\assets\images\servicepro.png"
          title="Service Pros"
          description={<>
            <span>Enjoy your rental,</span>
            <br />
            <span>stress-free.</span>
          </>}
        />
        <ScalableCard
          image="src\assets\images\owner.png    "
          title="Owners"
          description="Protect your property and find Pms you trust."
        />
      </div>
    </section>
  );
}

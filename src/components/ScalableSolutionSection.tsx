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
          image="https://res.cloudinary.com/dxwspucxw/image/upload/v1761905088/LandLords_bucwby.png"
          title="Landlords"
          description="Protect your property and find Pms you trust."
        />
        <ScalableCard
          image="https://res.cloudinary.com/dxwspucxw/image/upload/v1761905089/propertymanager_pqausl.png"
          title="Property Manager"
          description="Stay organized and connected with your team."
        />
        <ScalableCard
          image="https://res.cloudinary.com/dxwspucxw/image/upload/v1761905090/servicepro_y7ry43.png"
          title="Service Pros"
          description={<>
            <span>Enjoy your rental,</span>
            <br />
            <span>stress-free.</span>
          </>}
        />
        <ScalableCard
          image="https://res.cloudinary.com/dxwspucxw/image/upload/v1761905089/owner_ipyjef.png"
          title="Owners"
          description="Protect your property and find Pms you trust."
        />
      </div>
    </section>
  );
}

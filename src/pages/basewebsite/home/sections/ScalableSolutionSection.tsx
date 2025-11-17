// components/ScalableSolutionSection.tsx
import ScalableCard from "../../../../components/common/cards/ScalableCard";


export default function ScalableSolutionSection() {
  return (
    <section className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 flex flex-col gap-6 sm:gap-8">
      <div className="px-4 sm:px-6 flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[var(--color-heading)] font-heading">
          A solution that scales with your needs
        </h2>
       
      </div>

  {/* Cards Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 px-4 sm:px-6 w-full">
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

// components/EverythingElseSection.tsx
import { Smartphone, Briefcase, Home, Users } from "lucide-react";
import EverythingElseCard from "../../../components/common/cards/EverythingElseCard";
import ViewMoreButton from "../../../components/common/buttons/ViewMoreButton";

export default function EverythingElseSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-stretch">
        {/* Left Side Box */}
        <div
          className="flex flex-col rounded-lg p-6 sm:p-8 lg:p-10 w-full h-full space-y-4 sm:space-y-6"
          style={{ backgroundColor: "var(--color-card-1)" }}
        >
          <div>
            <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold font-[var(--font-heading)] mb-3 sm:mb-4 leading-snug">
              Plus, everything else you'd expect on our highly rated platform
            </h2>
            <div className="mt-3 sm:mt-4">
              <ViewMoreButton to="/features/screening" />
            </div>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6 w-full justify-items-center h-full">
          <EverythingElseCard
            number="01"
            title="Tenant Mobile App"
            description="A user-friendly app built for tenants to easily pay rent, raise maintenance requests, track payment history, and communicate directly with property managers — all from their mobile device."
            icon={<Smartphone />}
          />
          <EverythingElseCard
            number="02"
            title="Property Manager App"
            description="An intuitive app for property managers to handle tenant requests, monitor payments, manage listings, and streamline operations — helping them stay connected and efficient on the go."
            icon={<Briefcase />}
          />
          <EverythingElseCard
            number="03"
            title="Owner Portal"
            description="Keep owners involved with a separate owner portal, giving them access to the things they need without all the fluff."
            icon={<Home />}
          />
          <EverythingElseCard
            number="04"
            title="Team Management"
            description="Get more done with team management tools. Add team members, grant permissions, access a team calendar and task list."
            icon={<Users />}
          />
        </div>
      </div>
    </section>
  );
}

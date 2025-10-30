// components/EverythingElseSection.tsx
import { Smartphone, Briefcase, Home, Users } from "lucide-react";
import EverythingElseCard from "./cards/EverythingElseCard";
import ViewMoreButton from "./common/buttons/ViewMoreButton";

export default function EverythingElseSection() {
  return (
  <section className="max-w-7xl mx-auto px-6 py-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {/* Left Side Box */}
        <div
          className="flex flex-col rounded-lg p-10 w-full h-full space-y-6"
          style={{ backgroundColor: "var(--color-card-1)" }}
        >
          <div>
            <h2 className="text-white text-3xl md:text-4xl font-semibold font-[var(--font-heading)] mb-4 leading-snug">
              Plus, everything else you’d expect on our highly rated platform
            </h2>
            <div className="mt-4">
              <ViewMoreButton />
            </div>
          </div>
          <div />
        </div>

      {/* Right Side Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full justify-items-center h-full">
        <EverythingElseCard
          number="01"
          title="Tenant Mobile App"
          description="A user-friendly app built for tenants to easily pay rent, raise maintenance requests, track payment history, and communicate directly with property managers — all from their mobile device."
          icon={<Smartphone size={20} />}
        />
        <EverythingElseCard
          number="02"
          title="Property Manager App"
          description="An intuitive app for property managers to handle tenant requests, monitor payments, manage listings, and streamline operations — helping them stay connected and efficient on the go."
          icon={<Briefcase size={20} />}
        />
        <EverythingElseCard
          number="03"
          title="Owner Portal"
          description="Keep owners involved with a separate owner portal, giving them access to the things they need without all the fluff."
          icon={<Home size={20} />}
        />
        <EverythingElseCard
          number="04"
          title="Team Management"
          description="Get more done with team management tools. Add team members, grant permissions, access a team calendar and task list."
          icon={<Users size={20} />}
        />
      </div>
      </div>
    </section>
  );
}

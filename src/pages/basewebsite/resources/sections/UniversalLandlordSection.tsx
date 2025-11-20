import React from 'react';
import { Documents, GetPaid, Leasing, Portfolio } from './resourceIcons';
import { InfoCard } from './ResourceCards';

const UniversalLandlordForms: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <h1 className="text-center text-5xl font-bold text-slate-900 mb-16">
          Universal Landlord Forms
        </h1>

        {/* Forms Grid */}
        <div className="flex flex-wrap justify-center gap-y-8 gap-x-5">
          
          {/* Lease Agreements */}
          <InfoCard
            title="Lease Agreements"
            icon={<Documents />}
            subtitle="Cover the rules and responsibilities of each party."
            variant='light2'
          />

          {/* Welcome Letter */}
          <InfoCard
            title="Welcome Letter"
            icon={<Leasing />}
            subtitle="Give a long-lasting positive impression on Pms."
            iconColorClass="text-emerald-500"
            variant='primary2'
            iconBgColorClass='#DDDDDD'
          />

          {/* Rules Addendum */}
          <InfoCard
            title="Rules Addendum"
            icon={<Portfolio />} 
            subtitle="Amend the original lease and include rental guidelines."
            iconColorClass="text-emerald-500"
            variant='light2'
          />

          {/* Smoke Free Addendum */}
          <InfoCard
            title="Smoke Free Addendum"
            icon={<GetPaid />} 
            subtitle="Ensure that Pms are not allowed to smoke indoors on your property."
            iconColorClass="text-emerald-500"
            variant='primary2'
          />

          {/* Security Deposit Receipt */}
          <InfoCard
            title="Security Deposit Receipt"
            icon={<Portfolio />}
            subtitle="Provide proof that the security deposit payment was received."
            iconColorClass="text-emerald-500"
            variant='light2'
          />

          {/* Notice of Rent Increase */}
          <InfoCard
            title="Notice of Rent Increase"
            icon={<Leasing />}
            subtitle="Properly inform Pms about rent rises."
            iconColorClass="text-emerald-500"
            variant='light2'
          />

        </div>
      </div>
    </section>
  );
};

export default UniversalLandlordForms;
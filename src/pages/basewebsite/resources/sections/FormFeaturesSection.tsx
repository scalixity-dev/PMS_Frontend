import React from 'react';
import { SimpleIconCard } from './ResourceCards';
import { Check, Clock, Contact, Scan } from './resourceIcons';

const FormFeaturesSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Legally Compliant Forms */}
        <SimpleIconCard
          icon={<Check/>}
          title={
            <>
              Legally Compliant
              <br />
              Forms
            </>
          }
        />

        {/* Card 2: Fully Customizable Templates */}
        <SimpleIconCard
          icon={<Scan />}
          title={
            <>
              Fully Customizable
              <br />
              Templates
            </>
          }
        />

        {/* Card 3: Time-Saving Automation */}
        <SimpleIconCard
          icon={<Clock />}
          title={
            <>
              Time-Saving
              <br />
              Automation
            </>
          }
        />

        {/* Card 4: State-Specific Documents */}
        <SimpleIconCard
          icon={<Contact />}
          title={
            <>
              State-Specific
              <br />
              Documents
            </>
          }
        />

      </div>
    </section>
  );
};

export default FormFeaturesSection;
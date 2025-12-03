import React from 'react';
import YesNoToggle from '../../../../../components/common/YesNoToggle';
import { useListUnitStore } from '../store/listUnitStore';

interface ApplicationSettingsProps {
  propertyId?: string;
}

const ApplicationSettings: React.FC<ApplicationSettingsProps> = () => {
  const { formData, updateFormData } = useListUnitStore();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-[var(--color-heading)]">
          Do you want to receive rental applications online?
        </h2>
        <p className="text-[var(--color-subheading)] text-gray-500">
          You can find more details in the Rental applications settings.
        </p>
      </div>

      <YesNoToggle
        value={formData.receiveApplicationsOnline}
        onChange={(val) => updateFormData('receiveApplicationsOnline', val)}
      />
    </div>
  );
};

export default ApplicationSettings;

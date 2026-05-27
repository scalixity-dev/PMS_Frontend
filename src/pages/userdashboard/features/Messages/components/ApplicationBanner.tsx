import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { applicationService } from '../../../../../services/application.service';
import { FileText, ExternalLink } from 'lucide-react';

export const ApplicationBanner = ({ applicationId, isUserDashboard = false }: { applicationId: string, isUserDashboard?: boolean }) => {
  const { data: app, isLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationService.getOne(applicationId),
    enabled: !!applicationId
  });

  if (isLoading) {
    return (
      <div className="bg-[#EDF2F1] border-b border-[#A7D8C9] px-4 py-2 flex items-center justify-center text-xs text-[#3D7068]">
        <span className="animate-pulse">Loading application details...</span>
      </div>
    );
  }

  if (!app) return null;

  const propertyName = app.leasing?.property?.propertyName || 'Property';
  const unitName = app.leasing?.unit?.unitName;
  const locationText = unitName ? `${propertyName} - Unit ${unitName}` : propertyName;

  const appLink = isUserDashboard ? `/userdashboard/applications/${applicationId}` : `/dashboard/application/${applicationId}`;

  return (
    <a href={appLink} className="block hover:bg-gray-50 transition-colors cursor-pointer bg-[#EDF2F1] border-b border-[#A7D8C9] px-4 py-3 text-sm shadow-sm print:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <FileText className="w-5 h-5 text-[#3D7068]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">Application: {locationText}</span>
            <div className="flex gap-2 text-xs text-gray-600 font-medium">
              <span className="capitalize">Status: <span className="text-[#3D7068]">{app.status.toLowerCase()}</span></span>
              <span>•</span>
              <span>Move-in: {new Date(app.moveInDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 hover:text-[#3D7068] transition-colors" />
      </div>
    </a>
  );
};

import { Eye } from 'lucide-react';

interface Request {
    id: number;
    tenantName: string;
    tenantInitial: string;
    status: string;
    description: string;
    property: string;
}

const TenantRequestsSection = () => {
    // Mock request data
    const requests: Request[] = [
        {
            id: 1,
            tenantName: 'Anil',
            tenantInitial: 'A',
            status: 'Normal',
            description: 'Electrical / Lights / Smoke Detectors / Beeping',
            property: 'Avasa Apartment'
        },
        {
            id: 2,
            tenantName: 'Anil',
            tenantInitial: 'A',
            status: 'Normal',
            description: 'Electrical / Lights / Smoke Detectors / Beeping',
            property: 'Avasa Apartment'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'normal':
                return 'bg-[#7BD747]';
            case 'urgent':
                return 'bg-red-500';
            case 'low':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-4 bg-[#F0F0F6] p-4 rounded-[2rem]">
            {requests.map((request) => (

                <div
                    key={request.id}
                    className="bg-[#F6F6F8] rounded-[2rem] p-6 shadow-lg grid grid-cols-[1.2fr_0.8fr_2fr_1fr_0.8fr] gap-4 items-center"
                >
                    {/* Name & Image */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#7BD747] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {request.tenantInitial}
                        </div>
                        <span className="font-semibold text-gray-800 text-sm truncate">{request.tenantName}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex self justify-center">
                        <div className={`${getStatusColor(request.status)} text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] inline-block`}>
                            {request.status}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="text-sm font-medium text-[#2E6819] truncate text-center">
                        {request.description}
                    </div>

                    {/* Property Badge */}
                    <div className="flex justify-center">
                        <div className="bg-[#7BD747] text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] inline-block">
                            {request.property}
                        </div>
                    </div>

                    {/* View Button */}
                    <div className="flex justify-end">
                        <button
                            className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] flex items-center gap-2"
                            onClick={() => { }}
                        >
                            <Eye className="w-4 h-4" />
                            View
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TenantRequestsSection;


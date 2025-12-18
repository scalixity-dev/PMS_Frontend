import { User, Eye } from 'lucide-react';

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
        <div className="space-y-4">
            {requests.map((request) => (
                <div
                    key={request.id}
                    className="bg-[#F6F6F8] rounded-[2rem] p-6 shadow-lg flex items-center gap-4"
                >
                    {/* Profile Icon */}
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-[#7BD747] flex items-center justify-center text-white font-bold text-sm">
                            {request.tenantInitial}
                        </div>
                        <User className="w-5 h-5 text-white absolute -bottom-1 -right-1 bg-[#3A6D6C] rounded-full p-0.5" />
                    </div>

                    {/* Status Badge */}
                    <div className={`${getStatusColor(request.status)} text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] flex-shrink-0`}>
                        {request.status}
                    </div>

                    {/* Description */}
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{request.description}</p>
                    </div>

                    {/* Property Badge */}
                    <div className="bg-[#7BD747] text-white px-4 py-2 rounded-full text-xs font-medium shadow-[inset_0_4px_1px_rgba(0,0,0,0.1)] flex-shrink-0">
                        {request.property}
                    </div>

                    {/* View Button */}
                    <button
                        className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] flex items-center gap-2 flex-shrink-0"
                        onClick={() => { }}
                    >
                        <Eye className="w-4 h-4" />
                        View
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TenantRequestsSection;


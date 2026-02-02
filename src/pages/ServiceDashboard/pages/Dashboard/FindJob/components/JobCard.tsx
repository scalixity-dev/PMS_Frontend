import { MapPin, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobCardProps {
    id: string;
    image: string;
    title: string;
    location: string;
    address: string;
    payout: number;
    priority: string;
    jobsAvailable?: number;
}

const JobCard = ({
    id,
    image: _image,
    title,
    location,
    address,
    payout,
    priority,
}: JobCardProps) => {
    const getPriorityColor = (p: string) => {
        switch (p.toLowerCase()) {
            case 'critical': return 'bg-[#FF4D4D] text-white';
            case 'normal': return 'bg-[#7CD947] text-white';
            case 'low': return 'bg-[#FFA500] text-white'; // Orange for low
            case 'high': return 'bg-[#FF4D4D] text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Content Section */}
            <div className="p-5">
                <div className="flex justify-between items-start gap-3 mb-3 min-h-[48px]">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                        {title}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex-shrink-0 tracking-wide ${getPriorityColor(priority)}`}>
                        {priority}
                    </span>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Home className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">{location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">{address}</span>
                    </div>
                </div>

                <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase mb-0.5">Payout</p>
                        <p className="text-xl font-bold text-[#7CD947] flex items-center">
                            $<span className="ml-0.5">{payout}</span>
                        </p>
                    </div>

                    <Link to={`/service-dashboard/find-job/${id}`} className="px-6 py-2 bg-[#7CD947] hover:bg-[#6BC939] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-[#7CD947]/30">
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default JobCard;

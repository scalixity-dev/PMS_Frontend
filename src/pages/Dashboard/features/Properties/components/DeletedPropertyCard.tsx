import { RotateCcw, Clock } from 'lucide-react';

interface DeletedPropertyCardProps {
    name: string;
    address: string;
    image: string | null;
    type?: string;
    daysRemaining: number;
    onRecover: () => void;
    isRecovering?: boolean;
}

const DeletedPropertyCard: React.FC<DeletedPropertyCardProps> = ({
    name,
    address,
    image,
    type = 'Single Apartment',
    daysRemaining,
    onRecover,
    isRecovering = false,
}) => {
    return (
        <div className="bg-[#F6F6F8] rounded-[2rem] p-4 shadow-sm relative flex flex-col h-full opacity-90">
            {/* Image Section */}
            <div className="w-full h-48 mb-4 relative flex-shrink-0">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover rounded-2xl grayscale-[40%]"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) placeholder.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className={`w-full h-full rounded-2xl ${image ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300`}
                >
                    <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-2">🏠</div>
                        <p className="text-gray-500 text-xs font-medium">No Image</p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-[#D1E2D1] text-[#3A6D6C] text-xs px-3 py-1 rounded-full font-medium">
                        {type}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {address}
                </p>

                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 text-xs px-3 py-2 rounded-xl mb-4 mt-auto">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>
                        {daysRemaining > 0
                            ? `Permanently deleted in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`
                            : 'Permanently deleted soon'}
                    </span>
                </div>
            </div>

            {/* Recover Action */}
            <div className="bg-white shadow-sm px-3 py-3 rounded-2xl">
                <button
                    onClick={onRecover}
                    disabled={isRecovering}
                    className="flex items-center justify-center gap-2 bg-[#82D64D] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#72c042] transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RotateCcw className="w-4 h-4" />
                    {isRecovering ? 'Recovering...' : 'Recover'}
                </button>
            </div>
        </div>
    );
};

export default DeletedPropertyCard;

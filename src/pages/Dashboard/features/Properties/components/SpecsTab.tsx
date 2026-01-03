import React from 'react';
import {
    Key,
    PaintBucket,
    DoorOpen,
    Edit2,
    Trash2,
    Grid
} from 'lucide-react';
import SectionHeader from './SectionHeader';

interface SpecItemProps {
    icon: React.ReactNode;
    title: string;
    badges: { label: string; value: string; color?: string }[];
    onEdit?: () => void;
    onDelete?: () => void;
}

const SpecItem: React.FC<SpecItemProps> = ({ icon, title, badges, onEdit, onDelete }) => {
    return (
        <div className="bg-[#F0F0F6] shadow-sm rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-start mb-4 w-full md:w-fit md:pr-12">
            <div className="flex items-center gap-3 md:gap-6 flex-1 flex-wrap">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                    {icon}
                </div>

                <div className="bg-[#82D64D] text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold min-w-[80px] md:min-w-[100px] text-center">
                    {title}
                </div>

                {badges.map((badge, index) => (
                    <div key={index} className="bg-[#82D64D] text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium">
                        {badge.label && <span className="mr-1">{badge.label} -</span>}
                        {badge.value}
                    </div>
                ))}
            </div>

            {(onEdit || onDelete) && (
                <div className="flex gap-2 md:gap-3 mt-3 md:mt-0 md:ml-6">
                    {onEdit && (
                        <button onClick={onEdit} className="p-2 text-[#3A6D6C] hover:bg-gray-200 rounded-full transition-colors">
                            <Edit2 className="w-5 h-5" />
                        </button>
                    )}
                    {onDelete && (
                        <button onClick={onDelete} className="p-2 text-red-500 hover:bg-gray-200 rounded-full transition-colors">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const SpecsTab: React.FC = () => {
    // Mock Data
    const keys = [
        { id: 1, name: 'Key 1', keyName: 'xyz', type: 'Main door' },
        { id: 2, name: 'Key 2', keyName: 'xyz', type: 'Main door' },
    ];

    const paints = [
        { id: 1, name: 'Paint 1', color: 'red', description: 'scjjsc snckns zcsc' },
        { id: 2, name: 'Paint 2', color: 'red', description: 'scjjsc snckns zcsc' },
    ];

    const doors = [
        { id: 1, name: 'Door 1', type: 'huh', lockType: '1' },
        { id: 2, name: 'Door 1', type: 'huh', lockType: '1' },
    ];

    const flooring = [
        { id: 1, name: 'Flooring 1', type: 'Black', description: 'jsbfbsf sjfbsjff sjbjs' },
        { id: 2, name: 'Flooring 2', type: 'Black', description: 'jsbfbsf sjfbsjff sjbjs' },
    ];

    return (
        <div className="space-y-8">
            {/* Keys Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6">
                <SectionHeader
                    title="Keys"
                    count={keys.length}
                    actionLabel="Assign"
                    onAction={() => console.log('Assign Key')}
                />
                <div className="space-y-4">
                    {keys.map((item) => (
                        <SpecItem
                            key={item.id}
                            icon={<Key className="w-6 h-6 text-gray-700" />}
                            title={item.name}
                            badges={[
                                { label: 'Name', value: item.keyName },
                                { label: 'Type', value: item.type }
                            ]}
                            onEdit={() => console.log('Edit key:', item.id)}
                            onDelete={() => console.log('Delete key:', item.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Paints Section */}
            <div className="bg-[#E8E8EA] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-lg">
                <SectionHeader
                    title="Paints"
                    count={paints.length}
                    actionLabel="Add"
                    onAction={() => console.log('Add Paint')}
                />
                <div className="space-y-4">
                    {paints.map((item) => (
                        <SpecItem
                            key={item.id}
                            icon={<PaintBucket className="w-6 h-6 text-red-400" />}
                            title={item.name}
                            badges={[
                                { label: 'Paint color', value: item.color },
                                { label: 'Description', value: item.description }
                            ]}
                            onEdit={() => console.log('Edit paint:', item.id)}
                            onDelete={() => console.log('Delete paint:', item.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Doors Section */}
            <div className="bg-[#E8E8EA] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-lg">
                <SectionHeader
                    title="Doors"
                    count={doors.length}
                    actionLabel="Add"
                    onAction={() => console.log('Add Door')}
                />
                <div className="space-y-4">
                    {doors.map((item) => (
                        <SpecItem
                            key={item.id}
                            icon={<DoorOpen className="w-6 h-6 text-orange-400" />}
                            title={item.name}
                            badges={[
                                { label: 'Door type', value: item.type },
                                { label: 'Lock type', value: item.lockType }
                            ]}
                            onEdit={() => console.log('Edit door:', item.id)}
                            onDelete={() => console.log('Delete door:', item.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Flooring Section */}
            <div className="bg-[#E8E8EA] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-lg">
                <SectionHeader
                    title="Flooring"
                    count={flooring.length}
                    actionLabel="Add"
                    onAction={() => console.log('Add Flooring')}
                />
                <div className="space-y-4">
                    {flooring.map((item) => (
                        <SpecItem
                            key={item.id}
                            icon={<Grid className="w-6 h-6 text-gray-500" />}
                            title={item.name}
                            badges={[
                                { label: 'Flooring type', value: item.type },
                                { label: 'Description', value: item.description }
                            ]}
                            onEdit={() => console.log('Edit flooring:', item.id)}
                            onDelete={() => console.log('Delete flooring:', item.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpecsTab;

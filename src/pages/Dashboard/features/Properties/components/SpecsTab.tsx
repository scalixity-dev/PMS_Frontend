import React, { useState } from 'react';
import {
    Key,
    PaintBucket,
    DoorOpen,
    Edit2,
    Trash2,
    Grid
} from 'lucide-react';
import SectionHeader from './SectionHeader';
import ConfirmationModal from '../../KeysLocks/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import AssignKeyModal from './AssignKeyModal';
import AddPaintModal from './AddPaintModal';
import AddDoorModal from './AddDoorModal';
import AddFloorModal from './AddFloorModal';

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
    const navigate = useNavigate();
    // State for mock data to allow deletion
    const [keys, setKeys] = useState([
        { id: 1, name: 'Key 1', keyName: 'xyz', type: 'Main door' },
        { id: 2, name: 'Key 2', keyName: 'xyz', type: 'Main door' },
    ]);

    const [paints, setPaints] = useState([
        { id: 1, name: 'Paint 1', color: 'red', description: 'scjjsc snckns zcsc' },
        { id: 2, name: 'Paint 2', color: 'red', description: 'scjjsc snckns zcsc' },
    ]);

    const [doors, setDoors] = useState([
        { id: 1, name: 'Door 1', type: 'huh', lockType: '1' },
        { id: 2, name: 'Door 1', type: 'huh', lockType: '1' },
    ]);

    const [flooring, setFlooring] = useState([
        { id: 1, name: 'Flooring 1', type: 'Black', description: 'jsbfbsf sjfbsjff sjbjs' },
        { id: 2, name: 'Flooring 2', type: 'Black', description: 'jsbfbsf sjfbsjff sjbjs' },
    ]);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number, type: 'key' | 'paint' | 'door' | 'flooring' } | null>(null);

    // Assign Key Modal State
    const [isAssignKeyModalOpen, setIsAssignKeyModalOpen] = useState(false);

    // Add Paint Modal State
    const [isAddPaintModalOpen, setIsAddPaintModalOpen] = useState(false);

    // Add Door Modal State
    const [isAddDoorModalOpen, setIsAddDoorModalOpen] = useState(false);

    // Add Floor Modal State
    const [isAddFloorModalOpen, setIsAddFloorModalOpen] = useState(false);

    const handleDeleteClick = (id: number, type: 'key' | 'paint' | 'door' | 'flooring') => {
        setItemToDelete({ id, type });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        switch (itemToDelete.type) {
            case 'key':
                setKeys(keys.filter(item => item.id !== itemToDelete.id));
                break;
            case 'paint':
                setPaints(paints.filter(item => item.id !== itemToDelete.id));
                break;
            case 'door':
                setDoors(doors.filter(item => item.id !== itemToDelete.id));
                break;
            case 'flooring':
                setFlooring(flooring.filter(item => item.id !== itemToDelete.id));
                break;
        }

        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleAddPaint = (data: { color: string; description: string }) => {
        const newPaint = {
            id: Date.now(), // Simple ID generation
            name: `Paint ${paints.length + 1}`,
            color: data.color,
            description: data.description
        };
        setPaints([...paints, newPaint]);
    };

    const handleAddDoor = (data: { doorType: string; lockType: string; insideDoorColor: string; exteriorDoorColor: string; screenDoorAttached: boolean }) => {
        const newDoor = {
            id: Date.now(),
            name: `Door ${doors.length + 1}`,
            type: data.doorType,
            lockType: data.lockType
        };
        setDoors([...doors, newDoor]);
    };

    const handleAddFlooring = (data: { flooringType: string; description: string }) => {
        const newFloor = {
            id: Date.now(),
            name: `Flooring ${flooring.length + 1}`,
            type: data.flooringType,
            description: data.description || 'No description'
        };
        setFlooring([...flooring, newFloor]);
    };

    return (
        <div className="space-y-8">
            {/* Keys Section */}
            <div className="bg-[#E9E9E9] shadow-lg rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6">
                <SectionHeader
                    title="Keys"
                    count={keys.length}
                    actionLabel="Assign"
                    onAction={() => setIsAssignKeyModalOpen(true)}
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
                            onEdit={() => navigate('/dashboard/portfolio/keys-locks')}
                            onDelete={() => handleDeleteClick(item.id, 'key')}
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
                    onAction={() => setIsAddPaintModalOpen(true)}
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

                            onDelete={() => handleDeleteClick(item.id, 'paint')}
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
                    onAction={() => setIsAddDoorModalOpen(true)}
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

                            onDelete={() => handleDeleteClick(item.id, 'door')}
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
                    onAction={() => setIsAddFloorModalOpen(true)}
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

                            onDelete={() => handleDeleteClick(item.id, 'flooring')}
                        />
                    ))}
                </div>
            </div>
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Item"
                message="Are you sure you want to delete this item? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />

            <AssignKeyModal
                isOpen={isAssignKeyModalOpen}
                onClose={() => setIsAssignKeyModalOpen(false)}
                onAssign={(keyId) => {
                    console.log('Assigned key:', keyId);
                    // In real app, you'd add the key to the list or make an API call
                }}
            />

            <AddPaintModal
                isOpen={isAddPaintModalOpen}
                onClose={() => setIsAddPaintModalOpen(false)}
                onAdd={handleAddPaint}
            />

            <AddDoorModal
                isOpen={isAddDoorModalOpen}
                onClose={() => setIsAddDoorModalOpen(false)}
                onAdd={handleAddDoor}
            />

            <AddFloorModal
                isOpen={isAddFloorModalOpen}
                onClose={() => setIsAddFloorModalOpen(false)}
                onAdd={handleAddFlooring}
            />
        </div>
    );
};

export default SpecsTab;

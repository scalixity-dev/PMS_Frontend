import React, { useState } from 'react';
import {
    Key,
    PaintBucket,
    DoorOpen,
    Edit2,
    Trash2,
    Grid,
    Loader2
} from 'lucide-react';
import SectionHeader from './SectionHeader';
import ConfirmationModal from '../../KeysLocks/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import AssignKeyModal from './AssignKeyModal';
import AddPaintModal from './AddPaintModal';
import AddDoorModal from './AddDoorModal';
import AddFloorModal from './AddFloorModal';
import { useCreatePropertySpec, useUpdatePropertySpec, useGetPropertySpecs, useDeletePropertySpec, propertyDetailQueryKeys } from '../../../../../hooks/usePropertyDetailQueries';
import { useDeleteKey } from '../../../../../hooks/useKeysQueries';
import { useQueryClient } from '@tanstack/react-query';

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

interface SpecsTabProps {
    propertyId: string;
    unitId?: string;
}

const SpecsTab: React.FC<SpecsTabProps> = ({ propertyId, unitId }) => {
    const navigate = useNavigate();

    // Fetch specs from API
    const { data: specsData = { paints: [], doors: [], flooring: [], keys: [] }, isLoading, error } = useGetPropertySpecs(propertyId, unitId);
    const createSpecMutation = useCreatePropertySpec();
    const updateSpecMutation = useUpdatePropertySpec();
    const deleteSpecMutation = useDeletePropertySpec();
    const deleteKeyMutation = useDeleteKey();
    const queryClient = useQueryClient();

    const paints = specsData.paints || [];
    const doors = specsData.doors || [];
    const flooring = specsData.flooring || [];
    const keys = specsData.keys || [];

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: number | string, type: 'key' | 'paint' | 'door' | 'flooring' } | null>(null);

    // Assign Key Modal State
    const [isAssignKeyModalOpen, setIsAssignKeyModalOpen] = useState(false);

    // Add/Edit Paint Modal State (Bug 2 fix)
    const [isAddPaintModalOpen, setIsAddPaintModalOpen] = useState(false);
    const [editingPaint, setEditingPaint] = useState<any | null>(null);

    // Add/Edit Door Modal State (Bug 2 fix)
    const [isAddDoorModalOpen, setIsAddDoorModalOpen] = useState(false);
    const [editingDoor, setEditingDoor] = useState<any | null>(null);

    // Add/Edit Floor Modal State (Bug 2 fix)
    const [isAddFloorModalOpen, setIsAddFloorModalOpen] = useState(false);
    const [editingFlooring, setEditingFlooring] = useState<any | null>(null);

    const handleDeleteClick = (id: number | string, type: 'key' | 'paint' | 'door' | 'flooring') => {
        setItemToDelete({ id, type });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            if (itemToDelete.type === 'key') {
                await deleteKeyMutation.mutateAsync(String(itemToDelete.id));
                queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.specs(propertyId) });
            } else {
                await deleteSpecMutation.mutateAsync({
                    propertyId,
                    specId: String(itemToDelete.id),
                });
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }

        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    const handleAddPaint = async (data: { name: string; color: string; description: string }) => {
        if (editingPaint) {
            await updateSpecMutation.mutateAsync({
                propertyId,
                specId: editingPaint.id,
                specData: { type: 'PAINT', name: data.name, color: data.color, description: data.description },
            });
            setEditingPaint(null);
        } else {
            await createSpecMutation.mutateAsync({
                propertyId,
                specData: { unitId, type: 'PAINT', name: data.name, color: data.color, description: data.description },
            });
        }
    };

    // Bug 1 fix: send door fields to proper columns
    const handleAddDoor = async (data: { name: string; doorType: string; lockType: string; insideDoorColor: string; exteriorDoorColor: string; screenDoorAttached: boolean }) => {
        if (editingDoor) {
            await updateSpecMutation.mutateAsync({
                propertyId,
                specId: editingDoor.id,
                specData: {
                    type: 'DOOR',
                    name: data.name,
                    doorType: data.doorType,
                    lockType: data.lockType,
                    color: data.insideDoorColor,
                    exteriorColor: data.exteriorDoorColor,
                    screenDoor: data.screenDoorAttached,
                    description: undefined,
                },
            });
            setEditingDoor(null);
        } else {
            await createSpecMutation.mutateAsync({
                propertyId,
                specData: {
                    unitId,
                    type: 'DOOR',
                    name: data.name,
                    doorType: data.doorType,
                    lockType: data.lockType,
                    color: data.insideDoorColor,
                    exteriorColor: data.exteriorDoorColor,
                    screenDoor: data.screenDoorAttached,
                    description: undefined,
                },
            });
        }
    };

    const handleAddFlooring = async (data: { name: string; flooringType: string; description: string }) => {
        if (editingFlooring) {
            await updateSpecMutation.mutateAsync({
                propertyId,
                specId: editingFlooring.id,
                specData: { type: 'FLOORING', name: data.name, brand: data.flooringType, description: data.description },
            });
            setEditingFlooring(null);
        } else {
            await createSpecMutation.mutateAsync({
                propertyId,
                specData: { unitId, type: 'FLOORING', name: data.name, brand: data.flooringType, description: data.description || 'No description' },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                <span className="ml-3 text-gray-600">Loading specs...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Failed to load specs. Please try again.</p>
            </div>
        );
    }

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
                            onEdit={() => { setEditingPaint(item); setIsAddPaintModalOpen(true); }}
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
                                // Bug 1 fix: read from proper columns; fall back to legacy columns for old rows
                                { label: 'Door type', value: item.doorType || item.brand || '-' },
                                { label: 'Lock type', value: item.lockType || item.notes || '-' },
                                { label: 'Inside color', value: item.color || '-' },
                                { label: 'Exterior color', value: item.exteriorColor || item.location || '-' },
                                { label: 'Screen', value: item.screenDoor != null ? (item.screenDoor ? 'Yes' : 'No') : (item.description || '-') },
                            ]}
                            onEdit={() => { setEditingDoor(item); setIsAddDoorModalOpen(true); }}
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
                                { label: 'Flooring type', value: item.brand || '-' },
                                { label: 'Description', value: item.description }
                            ]}
                            onEdit={() => { setEditingFlooring(item); setIsAddFloorModalOpen(true); }}
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
                propertyId={propertyId}
                unitId={unitId}
                onAssign={() => {
                    queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.specs(propertyId) });
                }}
            />

            <AddPaintModal
                isOpen={isAddPaintModalOpen}
                onClose={() => { setIsAddPaintModalOpen(false); setEditingPaint(null); }}
                onAdd={handleAddPaint}
                initialData={editingPaint ? { name: editingPaint.name, color: editingPaint.color, description: editingPaint.description || '' } : undefined}
            />

            <AddDoorModal
                isOpen={isAddDoorModalOpen}
                onClose={() => { setIsAddDoorModalOpen(false); setEditingDoor(null); }}
                onAdd={handleAddDoor}
                initialData={editingDoor ? {
                    name: editingDoor.name,
                    doorType: editingDoor.doorType || editingDoor.brand || '',
                    lockType: editingDoor.lockType || editingDoor.notes || '',
                    insideDoorColor: editingDoor.color || '',
                    exteriorDoorColor: editingDoor.exteriorColor || editingDoor.location || '',
                    screenDoorAttached: editingDoor.screenDoor ?? false,
                } : undefined}
            />

            <AddFloorModal
                isOpen={isAddFloorModalOpen}
                onClose={() => { setIsAddFloorModalOpen(false); setEditingFlooring(null); }}
                onAdd={handleAddFlooring}
                initialData={editingFlooring ? { name: editingFlooring.name, flooringType: editingFlooring.brand || '', description: editingFlooring.description || '' } : undefined}
            />
        </div>
    );
};

export default SpecsTab;

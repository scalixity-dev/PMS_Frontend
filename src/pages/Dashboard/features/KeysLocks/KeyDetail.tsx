import React from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ChevronLeft, Edit, Trash2, Loader2 } from 'lucide-react';
import CustomTextBox from '../../components/CustomTextBox';
import AssignKeyModal from './AssignKeyModal';
import ConfirmationModal from './ConfirmationModal';
import { useGetKey, useUpdateKey, useDeleteKey } from '../../../../hooks/useKeysQueries';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';

// Map backend key type to display format
const mapKeyType = (keyType: string): string => {
    const typeMap: Record<string, string> = {
        'DOOR': 'Main Door',
        'MAILBOX': 'Mailbox',
        'GARAGE': 'Garage',
        'GATE': 'Gate',
        'STORAGE': 'Storage',
        'OTHER': 'Other',
    };
    return typeMap[keyType] || keyType;
};

const KeyDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [isActionDropdownOpen, setIsActionDropdownOpen] = React.useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isUnassignModalOpen, setIsUnassignModalOpen] = React.useState(false);

    // Fetch key data from backend
    const { data: keyData, isLoading, error } = useGetKey(id || null, !!id);
    const { data: properties = [] } = useGetAllProperties();
    const updateKeyMutation = useUpdateKey();
    const deleteKeyMutation = useDeleteKey();

    const handleAssignKey = async (issuedTo: string) => {
        if (!id || !keyData) return;

        try {
            await updateKeyMutation.mutateAsync({
                keyId: id,
                updateData: {
                    issuedTo,
                    status: 'ISSUED',
                    issuedDate: new Date().toISOString(),
                },
            });
            setIsAssignModalOpen(false);
        } catch (error) {
            console.error('Error assigning key:', error);
            alert(error instanceof Error ? error.message : 'Failed to assign key');
        }
    };

    const handleUnassignKey = async () => {
        if (!id || !keyData) return;

        try {
            await updateKeyMutation.mutateAsync({
                keyId: id,
                updateData: {
                    issuedTo: null,
                    status: 'AVAILABLE',
                    returnedDate: new Date().toISOString(),
                },
            });
            setIsUnassignModalOpen(false);
        } catch (error) {
            console.error('Error unassigning key:', error);
            alert(error instanceof Error ? error.message : 'Failed to unassign key');
        }
    };

    const handleDeleteKey = async () => {
        if (!id) return;

        try {
            await deleteKeyMutation.mutateAsync(id);
            setIsDeleteModalOpen(false);
            navigate('/dashboard/portfolio/keys-locks');
        } catch (error) {
            console.error('Error deleting key:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete key');
        }
    };

    // Format address from backend data
    const formatAddress = (address: {
        streetAddress: string;
        city: string;
        stateRegion: string;
        zipCode: string;
        country: string;
    } | null | undefined): string => {
        if (!address) return 'Address not available';
        return `${address.streetAddress}, ${address.city}, ${address.stateRegion} ${address.zipCode}, ${address.country}`;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
            </div>
        );
    }

    // Error state
    if (error || !keyData) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit">
                <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                        <p className="text-red-800">
                            {error instanceof Error ? error.message : 'Key not found'}
                        </p>
                        <button
                            onClick={() => navigate('/dashboard/portfolio/keys-locks')}
                            className="mt-4 px-4 py-2 bg-[#3A6D6C] text-white rounded-lg hover:bg-[#2c5251] transition-colors"
                        >
                            Back to Keys & Locks
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isAssigned = keyData.issuedTo && keyData.status === 'ISSUED';

    // Determine property image URL with fallback chain
    const propertyImageUrl =
        keyData.property?.coverPhotoUrl ||
        keyData.property?.photos?.find((p) => p.isPrimary)?.photoUrl ||
        keyData.property?.photos?.[0]?.photoUrl ||
        'https://via.placeholder.com/300x300?text=No+Image';

    return (
        <>
            <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
                {/* Breadcrumb */}
                <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                    <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-600 text-sm font-semibold">Keys & Locks</span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-600 text-sm font-semibold truncate max-w-[150px] md:max-w-none">
                        Key no. <span className="md:hidden">{id ? `${id.slice(0, 8)}...` : 'Unknown'}</span><span className="hidden md:inline">{id || 'Unknown'}</span>
                    </span>
                </div>

                <div className="p-4 md:p-6 bg-[#E0E5E5] min-h-screen rounded-[1.5rem] md:rounded-[2rem]">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                                <ChevronLeft className="w-6 h-6 text-black" />
                            </button>
                            <h1 className="text-2xl font-bold text-black mr-auto md:mr-0">Keys</h1>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto ml-auto">
                            {!isAssigned ? (
                                <button
                                    onClick={() => setIsAssignModalOpen(true)}
                                    disabled={updateKeyMutation.isPending}
                                    className="flex-1 md:flex-none justify-center px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {updateKeyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Assign
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsUnassignModalOpen(true)}
                                    disabled={updateKeyMutation.isPending}
                                    className="flex-1 md:flex-none justify-center px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                                >
                                    {updateKeyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Unassign
                                </button>
                            )}
                            <div className="relative flex-1 md:flex-none">
                                <button
                                    onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                                    className="w-full md:w-auto justify-center px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                >
                                    Action
                                </button>
                                {isActionDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-100 overflow-hidden">
                                        <button
                                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                                            onClick={() => {
                                                setIsActionDropdownOpen(false);
                                                navigate(`/dashboard/portfolio/edit-key/${id}`);
                                            }}
                                        >
                                            <div className="p-1.5 bg-[#E8F0F0] rounded-md text-[#3A6D6C]">
                                                <Edit size={16} />
                                            </div>
                                            <span className="font-medium">Edit</span>
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                                            onClick={() => {
                                                setIsActionDropdownOpen(false);
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            <div className="p-1.5 bg-red-50 rounded-md text-red-500">
                                                <Trash2 size={16} />
                                            </div>
                                            <span className="font-medium">Delete</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-sm">
                        {/* Key Section */}
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            {/* Key Image */}
                            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
                                {keyData.keyPhotoUrl ? (
                                    <img
                                        src={keyData.keyPhotoUrl}
                                        alt={keyData.keyName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-400 text-sm text-center p-4">
                                        No photo available
                                    </div>
                                )}
                            </div>

                            {/* Green Card */}
                            <div className="flex-1 bg-[#7BD747] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 relative overflow-hidden">
                                <h2 className="text-white text-xl font-bold mb-4">{keyData.keyName}</h2>
                                <div className="w-full">
                                    <CustomTextBox
                                        value={keyData.description || "No description available"}
                                        readOnly={true}
                                        className="bg-[#E0E5E5]/90 h-24 items-start pt-2 rounded-lg"
                                        valueClassName="text-gray-600 text-sm whitespace-pre-wrap"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Property Section */}
                        <div className="bg-[#E0E5E5] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 border border-white/50">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        {keyData.property?.propertyName || 'Unknown Property'}
                                    </h3>
                                    <div className="mt-2">
                                        <CustomTextBox
                                            value={formatAddress(keyData.property?.address || null)}
                                            readOnly={true}
                                            className="bg-[#D9EBD3] border border-white/50 rounded-lg"
                                            valueClassName="text-gray-700 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-48 h-48 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 relative group bg-gray-200 flex items-center justify-center">
                                    {propertyImageUrl && propertyImageUrl !== 'https://via.placeholder.com/300x300?text=No+Image' ? (
                                        <img
                                            src={propertyImageUrl}
                                            alt={keyData.property?.propertyName || 'Property'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-xs text-center p-4">
                                            No image available
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col gap-4">
                                    <div>
                                        <button
                                            onClick={() => navigate(`/dashboard/properties/${keyData.propertyId}`)}
                                            className="w-full md:w-auto px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                                        >
                                            View Property
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <CustomTextBox
                                            value={keyData.description || "No description available"}
                                            readOnly={true}
                                            className="bg-[#E0E5E5] border border-gray-200 h-full items-start pt-2 rounded-lg"
                                            valueClassName="text-gray-600 text-sm whitespace-pre-wrap"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Key Information Section */}
                        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 border border-gray-200 mt-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Key Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 mb-1">Key Type</p>
                                    <p className="text-sm text-gray-800">{mapKeyType(keyData.keyType)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                                    <p className="text-sm text-gray-800">{keyData.status}</p>
                                </div>
                                {keyData.unit && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600 mb-1">Unit</p>
                                        <p className="text-sm text-gray-800">{keyData.unit.unitName}</p>
                                    </div>
                                )}
                                {keyData.issuedTo && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600 mb-1">Issued To</p>
                                        <p className="text-sm text-gray-800">{keyData.issuedTo}</p>
                                    </div>
                                )}
                                {keyData.issuedDate && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600 mb-1">Issued Date</p>
                                        <p className="text-sm text-gray-800">
                                            {new Date(keyData.issuedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                                {keyData.returnedDate && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-600 mb-1">Returned Date</p>
                                        <p className="text-sm text-gray-800">
                                            {new Date(keyData.returnedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AssignKeyModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onAssign={handleAssignKey}
                properties={properties.map(p => p.propertyName)}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteKey}
                title="You're about to delete this key"
                message="Are you sure you want to delete it?"
                confirmLabel="Delete"
            />

            <ConfirmationModal
                isOpen={isUnassignModalOpen}
                onClose={() => setIsUnassignModalOpen(false)}
                onConfirm={handleUnassignKey}
                title="Unassign Key"
                message="Are you sure you want to unassign this key?"
                confirmLabel="Unassign"
            />
        </>
    );
};

export default KeyDetail;

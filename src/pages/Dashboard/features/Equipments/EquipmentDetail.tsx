import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit, Paperclip, ChevronDown, ChevronUp, Trash2, Loader2 } from 'lucide-react';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import CustomTextBox from '../../components/CustomTextBox';
import { useGetEquipment, useDeleteEquipment, useGetEquipmentCategories } from '../../../../hooks/useEquipmentQueries';
import type { BackendEquipment } from '../../../../services/equipment.service';

const findSubcategoryName = (categories: any[], subcategoryId: string): string => {
    for (const cat of categories) {
        if (cat.subcategories) {
            const found = cat.subcategories.find((sub: any) => sub.id === subcategoryId);
            if (found) return found.name;
        }
    }
    return '';
};

const EquipmentDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);

    const [sections, setSections] = useState({
        general: true,
        checkup: false,
        related: false,
        attachments: false
    });

    const toggleSection = (section: keyof typeof sections) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const deleteEquipmentMutation = useDeleteEquipment();

    const handleEdit = () => {
        setIsActionDropdownOpen(false);
        navigate(`/dashboard/equipments/edit/${id}`);
    };

    const handleDelete = () => {
        setIsActionDropdownOpen(false);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!id) return;
        try {
            await deleteEquipmentMutation.mutateAsync(id);
            navigate('/dashboard/equipments');
        } catch (error) {
            console.error('Error deleting equipment:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete equipment');
        }
    };

    // Fetch equipment details from backend
    const { data: equipment, isLoading, error } = useGetEquipment(id ?? null, !!id);
    const { data: allCategories = [] } = useGetEquipmentCategories();

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                    <span className="text-sm text-gray-600">Loading equipment details...</span>
                </div>
            </div>
        );
    }

    if (error || !equipment) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md text-center">
                    <p className="text-red-800 font-semibold mb-2">Unable to load equipment details</p>
                    <p className="text-sm text-red-700 mb-4">
                        {error instanceof Error ? error.message : 'Equipment not found'}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    // Strongly-typed backend equipment (see BackendEquipment in equipment.service.ts)
    const equipmentTyped = equipment as BackendEquipment;
    // Handle category being either a string or an object { id, name, description }
    let categoryLabel = 'Unknown category';
    if (typeof equipmentTyped.category === 'string') {
        const foundCat = allCategories.find(c => c.id === equipmentTyped.category || c.name === equipmentTyped.category);
        categoryLabel = foundCat ? foundCat.name : equipmentTyped.category;
    } else if (equipmentTyped.category && typeof equipmentTyped.category === 'object') {
        categoryLabel = equipmentTyped.category.name ?? 'Unknown category';
    } else if (equipmentTyped.categoryId) {
        const foundCat = allCategories.find(c => c.id === equipmentTyped.categoryId);
        categoryLabel = foundCat ? foundCat.name : '-';
    }

    // Handle subcategory being an object { id, name, description }
    let subcategoryLabel = '';
    if (equipmentTyped.subcategory && typeof equipmentTyped.subcategory === 'object') {
        subcategoryLabel = equipmentTyped.subcategory.name ?? '';
    } else if (typeof equipmentTyped.subcategory === 'string') {
        const resolvedName = findSubcategoryName(allCategories, equipmentTyped.subcategory);
        subcategoryLabel = resolvedName || equipmentTyped.subcategory;
    } else if (equipmentTyped.subcategoryId) {
        subcategoryLabel = findSubcategoryName(allCategories, equipmentTyped.subcategoryId);
    }
    const imageUrl = equipmentTyped.photoUrl || 'https://via.placeholder.com/300x300?text=No+Image';
    const propertyName = equipmentTyped.property?.propertyName || 'Unassigned property';
    // Prefer property cover photo (or primary photo) for the Property section image
    const propertyImageUrl =
        equipmentTyped.property?.coverPhotoUrl ||
        equipmentTyped.property?.photos?.find((p) => p.isPrimary)?.photoUrl ||
        equipmentTyped.property?.photos?.[0]?.photoUrl ||
        imageUrl;

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <div className="mb-6">
                <Breadcrumb
                    items={[
                        { label: 'Dashboard', path: '/dashboard' },
                        { label: 'Equipments', path: '/dashboard/equipments' },
                        { label: `Equipment no. ${equipmentTyped.id}` }
                    ]}
                />
            </div>
            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-[1.5rem] md:rounded-[2rem]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                        Equipments
                    </button>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <button
                                onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                                className="w-full md:w-auto justify-center px-6 py-1.5 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                            >
                                Action
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {isActionDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-full md:w-32 bg-white rounded-lg shadow-lg z-10 border border-gray-100 overflow-hidden">
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        onClick={handleEdit}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Section */}
                <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        {/* Image */}
                        <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                            <img
                                src={imageUrl}
                                alt={categoryLabel}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Green Header Card */}
                        <div className="flex-1 bg-[#82D64D] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 flex flex-col justify-center gap-4">
                            <h2 className="text-white text-xl font-bold">Equipment no. {equipmentTyped.id}</h2>
                            <div className="flex flex-wrap gap-3">
                                <CustomTextBox
                                    value={categoryLabel}
                                    readOnly={true}
                                    className="bg-[#E3EBDE] rounded-full px-5 py-2"
                                    valueClassName="text-gray-800 text-sm md:text-base font-semibold"
                                />
                                {subcategoryLabel && (
                                    <CustomTextBox
                                        value={subcategoryLabel}
                                        readOnly={true}
                                        className="bg-[#E3EBDE] rounded-full px-5 py-2"
                                        valueClassName="text-gray-800 text-sm md:text-base font-semibold"
                                    />
                                )}
                                <CustomTextBox
                                    value={equipmentTyped.brand}
                                    readOnly={true}
                                    className="bg-[#E3EBDE] rounded-full px-5 py-2"
                                    valueClassName="text-gray-800 text-sm md:text-base font-semibold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Section */}
                    <div>
                        <h3 className="text-gray-700 font-bold mb-3 ml-2">Property</h3>
                        <div className="bg-[#F0F0F6] border border-white rounded-[1.5rem] md:rounded-[2rem] p-4 flex flex-col md:flex-row gap-6 shadow-sm">
                            <div className="w-full md:w-48 h-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                                {equipmentTyped.property ? (
                                    <img
                                        src={propertyImageUrl}
                                        alt={propertyName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                        No property image
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 rounded-xl">
                                <CustomTextBox
                                    value={equipmentTyped.equipmentDetails || "No description available"}
                                    readOnly={true}
                                    className="h-full items-start border-none p-0 rounded-lg"
                                    valueClassName="text-gray-600 text-sm whitespace-pre-wrap w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collapsible Sections */}
                <div className="space-y-6">
                    {/* General Information */}
                    <div>
                        <button
                            onClick={() => toggleSection('general')}
                            className="flex items-center gap-2 text-gray-800 font-bold text-lg mb-4"
                        >
                            General information
                            {sections.general ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                        </button>

                        {sections.general && (
                            <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <label className="w-auto md:w-24 text-sm font-medium text-gray-600">Model</label>
                                    <CustomTextBox
                                        value={equipmentTyped.model || '--'}
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <label className="w-auto md:w-48 text-sm font-medium text-gray-600">Warranty expiration date</label>
                                    <CustomTextBox
                                        // Warranty is not in backend model yet
                                        value={'-'}
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <label className="w-auto md:w-24 text-sm font-medium text-gray-600">Serial</label>
                                    <CustomTextBox
                                        value={equipmentTyped.serialNumber || '---'}
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <label className="w-auto md:w-48 text-sm font-medium text-gray-600">Additional email 1</label>
                                    <CustomTextBox
                                        // Additional email not in backend model
                                        value={'-'}
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                    <label className="w-auto md:w-24 text-sm font-medium text-gray-600">Price</label>
                                    <CustomTextBox
                                        value={
                                            equipmentTyped.price
                                                ? typeof equipmentTyped.price === 'string'
                                                    ? equipmentTyped.price
                                                    : `$${equipmentTyped.price}`
                                                : '---'
                                        }
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Related requests */}
                    <div>
                        <button
                            onClick={() => toggleSection('related')}
                            className="flex items-center gap-2 text-gray-800 font-bold text-lg mb-4"
                        >
                            Related requests
                            {sections.related ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                        </button>
                        {sections.related && (
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-12 flex justify-center items-center">
                                <div className="flex flex-col items-center gap-2 text-[#3A6D6C]">
                                    <Edit className="w-8 h-8" />
                                    <span className="text-xs font-medium">No related requests yet</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Attachments */}
                    <div>
                        <button
                            onClick={() => toggleSection('attachments')}
                            className="flex items-center gap-2 text-gray-800 font-bold text-lg mb-4"
                        >
                            Attachments
                            {sections.attachments ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                        </button>
                        {sections.attachments && (
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-12 flex justify-center items-center">
                                <div className="flex flex-col items-center gap-2 text-[#3A6D6C]">
                                    <Paperclip className="w-8 h-8" />
                                    <span className="text-xs font-medium">No attachments yet</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Equipment"
                itemName={equipmentTyped?.brand || 'this equipment'}
                message={
                    <>
                        Are you sure you want to delete <span className="font-bold text-gray-800">"{equipmentTyped?.brand || 'this equipment'}"</span>?
                        <br />This action cannot be undone. All associated data for this equipment will be permanently deleted.
                    </>
                }
                confirmText={deleteEquipmentMutation.isPending ? 'Deleting...' : 'Delete Equipment'}
            />
        </div>
    );
};

export default EquipmentDetail;

import React, { useState } from 'react';
import { Plus, Trash2, Building2 } from 'lucide-react';
import DatePicker from '../../../../../../components/ui/DatePicker';
import DeleteConfirmationModal from '../../../../../../components/common/modals/DeleteConfirmationModal';

interface Entity {
    id: string;
    widthName: string; // The name of the entity
    status: 'Active' | 'Inactive';
    entityType: string;
    ein: string;
    registrationDate: string;
}

const initialEntities: Entity[] = [
    {
        id: '1',
        widthName: 'Bagga Properties LLC',
        status: 'Active',
        entityType: 'LLC',
        ein: '12-3456789',
        registrationDate: '1/15/2023',
    },
    {
        id: '2',
        widthName: 'Maintenance Solutions Inc',
        status: 'Active',
        entityType: 'Corporation',
        ein: '98-7654321',
        registrationDate: '6/20/2022',
    },
];

const Entities = () => {
    // Data State
    const [entities, setEntities] = useState<Entity[]>(initialEntities);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [entityName, setEntityName] = useState('');
    const [entityType, setEntityType] = useState('');
    const [ein, setEin] = useState('');
    const [registrationDate, setRegistrationDate] = useState<Date | undefined>(undefined);

    const handleAddEntity = () => {
        // Basic Validation
        if (!entityName || !entityType || !ein || !registrationDate) {
            alert("Please fill in all fields");
            return;
        }

        const newEntity: Entity = {
            id: Date.now().toString(),
            widthName: entityName,
            status: 'Active',
            entityType: entityType,
            ein: ein,
            // Format date to simple string (M/D/YYYY) for display
            registrationDate: registrationDate.toLocaleDateString('en-US'),
        };

        setEntities([...entities, newEntity]);

        // Reset Form
        setEntityName('');
        setEntityType('');
        setEin('');
        setRegistrationDate(undefined);
        setIsModalOpen(false);
    };

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setEntityToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (entityToDelete) {
            setEntities(entities.filter(e => e.id !== entityToDelete));
            setDeleteModalOpen(false);
            setEntityToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Entity"
                message="Are you sure you want to delete this entity? This action cannot be undone."
            />
            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                            <Building2 className="text-gray-900" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Business Entities</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Manage your business entities and legal structures</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#7CD947] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#6bc13d] transition-colors shadow-sm self-start sm:self-center"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        Add Entity
                    </button>
                </div>

                {/* List Section */}
                <div className="divide-y divide-gray-100">
                    {entities.length === 0 ? (
                        <div className="p-4 md:p-8 text-center text-gray-500 text-sm">
                            No entities found. Click "Add Entity" to create one.
                        </div>
                    ) : (
                        entities.map((entity) => (
                            <div key={entity.id} className="p-4 md:p-6">
                                {/* Top Row: Name, Badge, Trash Icon */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-base font-bold text-gray-900">{entity.widthName}</h3>
                                        <span className="bg-[#E7F6E7] text-[#44A445] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                            {entity.status}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClick(entity.id)}
                                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8">
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-900 mb-1">Entity Type</p>
                                        <p className="text-xs text-gray-600 font-medium">{entity.entityType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-900 mb-1">EIN</p>
                                        <p className="text-xs text-gray-600 font-medium">{entity.ein}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-900 mb-1">Registration Date</p>
                                        <p className="text-xs text-gray-600 font-medium">{entity.registrationDate}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>


            {/* Add Entity Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl transform transition-all">
                            <div className="p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Add New Entity</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {/* Entity Name */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Entity Name
                                        </label>
                                        <input
                                            type="text"
                                            value={entityName}
                                            onChange={(e) => setEntityName(e.target.value)}
                                            placeholder="Enter entity name"
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Entity Type */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Entity Type
                                        </label>
                                        <input
                                            type="text"
                                            value={entityType}
                                            onChange={(e) => setEntityType(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border-2 border-blue-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                                            autoFocus
                                        />
                                    </div>

                                    {/* EIN */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            EIN (Tax ID)
                                        </label>
                                        <input
                                            type="text"
                                            value={ein}
                                            onChange={(e) => setEin(e.target.value)}
                                            placeholder="XX-XXXXXXX"
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Registration Date */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Registration Date
                                        </label>
                                        <DatePicker
                                            className="w-full border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all text-gray-600"
                                            onChange={(date) => {
                                                setRegistrationDate(date);
                                            }}
                                            value={registrationDate}
                                        />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddEntity}
                                        className="flex-1 bg-[#7CD947] hover:bg-[#6AC13D] text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
                                    >
                                        Add Entity
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-[#D0D5DD] hover:bg-[#C0C5CD] text-[#344054] font-semibold py-3 rounded-lg transition-colors shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Entities;

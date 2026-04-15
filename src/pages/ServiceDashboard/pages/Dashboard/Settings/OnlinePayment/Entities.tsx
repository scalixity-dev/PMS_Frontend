import { useState } from 'react';
import { Plus, Trash2, Building2, Pencil } from 'lucide-react';
import DatePicker from '../../../../../../components/ui/DatePicker';
import DeleteConfirmationModal from '../../../../../../components/common/modals/DeleteConfirmationModal';

type TaxIdType = 'PAN' | 'GST' | 'CIN' | 'TAN' | 'EIN';
const TAX_ID_TYPES: TaxIdType[] = ['PAN', 'GST', 'CIN', 'TAN', 'EIN'];

// Common legal entity types (India + US variants).
const ENTITY_TYPE_OPTIONS = [
    'Sole Proprietorship',
    'Partnership',
    'LLP (Limited Liability Partnership)',
    'Private Limited Company',
    'Public Limited Company',
    'One Person Company (OPC)',
    'LLC',
    'Corporation',
    'Other',
];

// Format validators per tax ID type.
const TAX_ID_REGEX: Record<TaxIdType, RegExp> = {
    PAN: /^[A-Z]{5}[0-9]{4}[A-Z]$/,              // ABCDE1234F
    GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
    CIN: /^[LUu][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
    TAN: /^[A-Z]{4}[0-9]{5}[A-Z]$/,
    EIN: /^\d{2}-\d{7}$/,                         // XX-XXXXXXX
};

const TAX_ID_PLACEHOLDER: Record<TaxIdType, string> = {
    PAN: 'ABCDE1234F',
    GST: '22ABCDE1234F1Z5',
    CIN: 'U12345MH2020PTC123456',
    TAN: 'ABCD12345E',
    EIN: 'XX-XXXXXXX',
};

interface Entity {
    id: string;
    widthName: string;
    status: 'Active' | 'Inactive';
    entityType: string;
    taxIdType: TaxIdType;
    taxId: string;
    registrationDate: string;
}

const initialEntities: Entity[] = [];

const Entities = () => {
    const [entities, setEntities] = useState<Entity[]>(initialEntities);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [entityName, setEntityName] = useState('');
    const [entityType, setEntityType] = useState('');
    const [taxIdType, setTaxIdType] = useState<TaxIdType>('PAN');
    const [taxId, setTaxId] = useState('');
    const [registrationDate, setRegistrationDate] = useState<Date | undefined>(undefined);
    const [formError, setFormError] = useState<string | null>(null);

    const resetForm = () => {
        setEntityName('');
        setEntityType('');
        setTaxIdType('PAN');
        setTaxId('');
        setRegistrationDate(undefined);
        setFormError(null);
        setEditingId(null);
    };

    const openAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEdit = (e: Entity) => {
        setEditingId(e.id);
        setEntityName(e.widthName);
        setEntityType(e.entityType);
        setTaxIdType(e.taxIdType);
        setTaxId(e.taxId);
        const parts = e.registrationDate.split('/');
        if (parts.length === 3) {
            setRegistrationDate(new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1])));
        }
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleAddEntity = () => {
        if (!entityName || !entityType || !taxId || !registrationDate) {
            setFormError('Please fill in all fields');
            return;
        }
        const normalizedTaxId = taxIdType === 'EIN' ? taxId : taxId.toUpperCase();
        if (!TAX_ID_REGEX[taxIdType].test(normalizedTaxId)) {
            setFormError(`Invalid ${taxIdType} format. Example: ${TAX_ID_PLACEHOLDER[taxIdType]}`);
            return;
        }

        const formattedDate = registrationDate.toLocaleDateString('en-US');

        if (editingId) {
            setEntities(entities.map((e) => e.id === editingId ? {
                ...e,
                widthName: entityName,
                entityType,
                taxIdType,
                taxId: normalizedTaxId,
                registrationDate: formattedDate,
            } : e));
        } else {
            const newEntity: Entity = {
                id: Date.now().toString(),
                widthName: entityName,
                status: 'Active',
                entityType,
                taxIdType,
                taxId: normalizedTaxId,
                registrationDate: formattedDate,
            };
            setEntities([...entities, newEntity]);
        }

        resetForm();
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
                            <p className="text-xs text-amber-600 mt-1 font-medium">Coming soon — requires Stripe Connect business entity onboarding</p>
                        </div>
                    </div>

                    <button
                        disabled
                        className="flex items-center gap-2 bg-gray-300 text-gray-500 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed shadow-sm self-start sm:self-center"
                        title="Coming soon — requires Stripe Connect business entity onboarding"
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
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openEdit(entity)}
                                            aria-label="Edit entity"
                                            className="text-gray-500 hover:text-[#7CD947] transition-colors p-1 rounded-md hover:bg-gray-50"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(entity.id)}
                                            aria-label="Delete entity"
                                            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8">
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-900 mb-1">Entity Type</p>
                                        <p className="text-xs text-gray-600 font-medium">{entity.entityType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-900 mb-1">{entity.taxIdType}</p>
                                        <p className="text-xs text-gray-600 font-medium">{entity.taxId}</p>
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
                                <h2 className="text-lg font-bold text-gray-900 mb-6">{editingId ? 'Edit Entity' : 'Add New Entity'}</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">Entity Name *</label>
                                        <input
                                            type="text"
                                            value={entityName}
                                            onChange={(e) => setEntityName(e.target.value)}
                                            placeholder="Enter entity name"
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">Entity Type *</label>
                                        <select
                                            value={entityType}
                                            onChange={(e) => setEntityType(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all"
                                        >
                                            <option value="">Select entity type</option>
                                            {ENTITY_TYPE_OPTIONS.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">Tax ID Type *</label>
                                        <select
                                            value={taxIdType}
                                            onChange={(e) => { setTaxIdType(e.target.value as TaxIdType); setTaxId(''); }}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all"
                                        >
                                            {TAX_ID_TYPES.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">{taxIdType} Number *</label>
                                        <input
                                            type="text"
                                            value={taxId}
                                            onChange={(e) => setTaxId(taxIdType === 'EIN' ? e.target.value : e.target.value.toUpperCase())}
                                            placeholder={TAX_ID_PLACEHOLDER[taxIdType]}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">Registration Date *</label>
                                        <DatePicker
                                            className="w-full border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all text-gray-600"
                                            onChange={setRegistrationDate}
                                            value={registrationDate}
                                        />
                                    </div>
                                </div>

                                {formError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                        {formError}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddEntity}
                                        className="flex-1 bg-[#7CD947] hover:bg-[#6AC13D] text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
                                    >
                                        {editingId ? 'Save Changes' : 'Add Entity'}
                                    </button>
                                    <button
                                        onClick={() => { resetForm(); setIsModalOpen(false); }}
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

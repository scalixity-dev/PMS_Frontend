import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Edit, Paperclip, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import CustomTextBox from '../../components/CustomTextBox';
import { MOCK_EQUIPMENTS } from './Equipments';

const EquipmentDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const equipment = MOCK_EQUIPMENTS.find(e => e.id === Number(id));

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

    if (!equipment) {
        return <div>Equipment not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                        Equipments
                    </button>
                    <div className="flex gap-3 ml-4">
                        <button className="px-6 py-1.5 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm">
                            Assign
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                                className="px-6 py-1.5 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                            >
                                Action
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {isActionDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10 border border-gray-100 overflow-hidden">
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        onClick={() => setIsActionDropdownOpen(false)}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        onClick={() => setIsActionDropdownOpen(false)}
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
                <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-8 shadow-sm">
                    <div className="flex gap-6 mb-8">
                        {/* Image */}
                        <div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                            <img
                                src={equipment.image}
                                alt={equipment.category}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Green Header Card */}
                        <div className="flex-1 bg-[#82D64D] rounded-[2rem] p-8 flex flex-col justify-center gap-4">
                            <h2 className="text-white text-xl font-bold">Equipment no. {equipment.id}</h2>
                            <div className="flex gap-3">
                                <CustomTextBox
                                    value={`${equipment.category} ${equipment.subcategory ? `/ ${equipment.subcategory}` : ''}`}
                                    readOnly={true}
                                    className="bg-[#E3EBDE] rounded-full px-5 py-2"
                                    valueClassName="text-gray-800 text-base font-semibold"
                                />
                                <CustomTextBox
                                    value={equipment.brand}
                                    readOnly={true}
                                    className="bg-[#E3EBDE] rounded-full px-5 py-2"
                                    valueClassName="text-gray-800 text-base font-semibold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Section */}
                    <div>
                        <h3 className="text-gray-700 font-bold mb-3 ml-2">Property</h3>
                        <div className="bg-[#F0F0F6] border border-white rounded-[2rem] p-4 flex gap-6 shadow-sm">
                            <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400"
                                    alt="Property"
                                    className="w-full h-full object-cover"
                                />
                                <button className="absolute top-2 left-2 px-3 py-1 bg-[#82D64D] text-white text-xs font-medium rounded-full hover:bg-[#72bd42] transition-colors">
                                    Unassign
                                </button>
                            </div>
                            <div className="flex-1 rounded-xl">
                                <CustomTextBox
                                    value={equipment.description || "No description available"}
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
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-8 grid grid-cols-2 gap-x-12 gap-y-6">
                                <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-gray-600">Model</label>
                                    <CustomTextBox
                                        value={equipment.model || '--'}
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="w-48 text-sm font-medium text-gray-600">Warranty expiration date</label>
                                    <CustomTextBox
                                        value={equipment.warrantyExpiration || '-'}
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-gray-600">Serial</label>
                                    <CustomTextBox
                                        value={equipment.serial || '---'}
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="w-48 text-sm font-medium text-gray-600">Additional email 1</label>
                                    <CustomTextBox
                                        value={equipment.additionalEmail || '-'}
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="w-24 text-sm font-medium text-gray-600">Price</label>
                                    <CustomTextBox
                                        value={equipment.price || '---'}
                                        readOnly={true}
                                        className="bg-[#E0E8E7] rounded-full h-10 flex-1"
                                        valueClassName="text-gray-700 text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Check up */}
                    <div>
                        <button
                            onClick={() => toggleSection('checkup')}
                            className="flex items-center gap-2 text-gray-800 font-bold text-lg mb-4"
                        >
                            Check up
                            {sections.checkup ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                        </button>
                        {sections.checkup && (
                            <div className="bg-[#F0F0F6] rounded-[2rem] p-12 flex justify-center items-center">
                                <div className="flex flex-col items-center gap-2 text-[#3A6D6C]">
                                    <Calendar className="w-8 h-8" />
                                    <span className="text-xs font-medium">No scheduled check up yet</span>
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
        </div>
    );
};

export default EquipmentDetail;

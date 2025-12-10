import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2, User } from 'lucide-react';

interface Tenant {
    id: string;
    name: string;
    email: string;
    phone: string;
    image?: string;
}

interface MoveInTenantSelectionProps {
    selectedTenantId: string | null;
    onSelect: (tenantId: string) => void;
    onNext: () => void;
    onBack: () => void;
}

// Mock data based on Tenants.tsx structure
const MOCK_TENANTS: Tenant[] = [
    {
        id: '1',
        name: 'Anjali Vyas',
        phone: '+91 8569325417',
        email: 'Anjli57474@gmail.com',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '2',
        name: 'Sam Curren',
        phone: '+91 8569325417',
        email: 'Currensam@gmail.com',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '3',
        name: 'Herry Gurney',
        phone: '+91 8569325417',
        email: 'Herrygurnwe@gmail.com',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
        id: '4',
        name: 'James Fos',
        phone: '+91 8569325417',
        email: 'Jamesfos@gmail.com',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
    }
];

const MoveInTenantSelection: React.FC<MoveInTenantSelectionProps> = ({
    selectedTenantId,
    onSelect,
    onNext
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedTenant = MOCK_TENANTS.find(t => t.id === selectedTenantId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (tenantId: string) => {
        onSelect(tenantId);
        setIsOpen(false);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Tenant information</h2>
                <p className="text-[#6B7280] max-w-lg mx-auto">Select the tenant from the dropdown menu. If your tenant is connected with you, the lease will be automatically shared with them.</p>
            </div>

            <div className="w-full max-w-md relative" ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-bold">Tenants</label>

                {/* Dropdown Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-[#3D7475] focus:outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        {!selectedTenant ? (
                            <>
                                <span className="text-gray-500">Search a Tenants</span>
                            </>
                        ) : (
                            <>
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                    {selectedTenant.image ? (
                                        <img src={selectedTenant.image} alt={selectedTenant.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                            <User size={16} />
                                        </div>
                                    )}
                                </div>
                                <span className="text-gray-900 font-medium">{selectedTenant.name}</span>
                            </>
                        )}

                    </div>
                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                        {MOCK_TENANTS.map((tenant) => (
                            <button
                                key={tenant.id}
                                onClick={() => handleSelect(tenant.id)}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                                        {tenant.image ? (
                                            <img src={tenant.image} alt={tenant.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <User size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                                        <p className="text-xs text-gray-500">{tenant.email}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full max-w-md mt-16 flex justify-center">
                <button
                    onClick={onNext}
                    disabled={!selectedTenantId}
                    className={`
                    px-12 py-3 rounded-lg font-medium text-white transition-all
                    ${!selectedTenantId
                            ? 'bg-[#3D7475] opacity-50 cursor-not-allowed'
                            : 'bg-[#3D7475] hover:bg-[#2c5554] shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }
                `}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MoveInTenantSelection;

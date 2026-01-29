import { ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import type { Publication } from '@/pages/userdashboard/utils/types';

interface PublicationViewProps {
    publication: Publication;
    onBack: () => void;
}

const PublicationView = ({ publication, onBack }: PublicationViewProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="md:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-[#1e293b] truncate">Update Details</h2>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    {/* Publication Header Card */}
                    <div className="bg-[#f8fafc] rounded-2xl p-6 mb-8 border border-gray-100">
                        <h1 className="text-2xl font-black text-[#1e293b] mb-6 leading-tight">
                            {publication.title}
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-50">
                                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <User className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Author</p>
                                    <p className="text-sm font-bold text-[#334155] truncate">{publication.author}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-50">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Date Posted</p>
                                    <p className="text-sm font-bold text-[#334155] truncate">{formatDate(publication.date)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-6 bg-[#3A6D6C] rounded-full"></div>
                            <h3 className="font-bold text-[#1e293b]">Announcement</h3>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                            <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                                {publication.content}
                            </p>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <p className="text-xs text-gray-500 font-medium">Important Information for Service Providers</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicationView;

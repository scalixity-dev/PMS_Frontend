import { ArrowLeft, User, Calendar } from 'lucide-react';
import type { Publication } from '../../../utils/types';

interface PublicationViewProps {
    publication: Publication;
    onBack?: () => void;
}

const PublicationView = ({ publication, onBack }: PublicationViewProps) => {

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden h-full">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 md:py-4 flex items-center gap-2 md:gap-3">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="md:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    </button>
                )}
                <div>
                    <h2 className="font-semibold text-gray-800 text-base md:text-lg">Publication Details</h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                        {publication.title}
                    </h1>

                    <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8 text-xs md:text-sm text-gray-500 border-b border-gray-100 pb-4 md:pb-6">
                        <div className="flex items-center gap-1.5 md:gap-2 bg-gray-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full">
                            <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>Posted by <span className="font-semibold text-gray-700">{publication.author}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2 bg-gray-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full">
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>{formatDate(publication.date)}</span>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base lg:text-lg">
                            {publication.content}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicationView;

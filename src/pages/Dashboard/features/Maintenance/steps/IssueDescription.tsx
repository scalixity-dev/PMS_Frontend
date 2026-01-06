import React, { useState } from 'react';
import { Undo2 } from 'lucide-react';

interface IssueDescriptionProps {
    defaultTitle: string;
    onContinue: (title: string, description: string) => void;
}

const IssueDescription: React.FC<IssueDescriptionProps> = ({ defaultTitle, onContinue }) => {
    const [title, setTitle] = useState(defaultTitle);
    const [description, setDescription] = useState('');

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Describe the issue</h2>
                <p className="text-gray-500">Check the title and provide the issue details.</p>
            </div>

            <div className="w-full space-y-8">
                {/* Title Input */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Title*</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#7BD747] text-white px-6 py-3 rounded-full font-medium outline-none placeholder-white/70 text-center"
                    />
                </div>

                {/* Description Input */}
                <div className="bg-[#F0F2F5] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <div className="bg-[#4A7172] text-white px-4 py-2 flex items-center gap-2 text-sm font-medium">
                        <Undo2 size={14} className="rotate-180" />
                        <span>Description</span>
                    </div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Type here..."
                        className="w-full h-40 p-4 bg-[#F0F2F5] resize-none outline-none text-gray-700"
                    />
                </div>
            </div>

            <div className="mt-12">
                <button
                    onClick={() => onContinue(title, description)}
                    className="bg-[#3D7475] text-white w-full md:w-auto px-16 py-3 rounded-lg font-medium hover:opacity-90 transition-all shadow-lg"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default IssueDescription;

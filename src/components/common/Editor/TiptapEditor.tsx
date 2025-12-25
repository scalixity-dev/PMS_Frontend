import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
    Undo, Redo, Quote
} from 'lucide-react';
import { AutoFillNode } from './extensions/AutoFillNode';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    minHeight?: string;
    className?: string;
    onDropHandler?: (view: any, event: DragEvent) => boolean;
    onEditorReady?: (editor: any) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const btnClass = (active: boolean) => `p-2 rounded hover:bg-gray-100 transition-colors ${active ? 'bg-gray-200 text-[#3A6D6C]' : 'text-gray-600'}`;

    return (
        <div className="flex flex-wrap gap-1 p-6 bg-white border-b border-gray-100 rounded-t-xl sticky top-0 z-10 transition-all">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={btnClass(editor.isActive('bold'))}
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={btnClass(editor.isActive('italic'))}
            >
                <Italic size={18} />
            </button>
            <div className="w-px h-6 bg-gray-200 self-center mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={btnClass(editor.isActive('heading', { level: 1 }))}
            >
                <Heading1 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btnClass(editor.isActive('heading', { level: 2 }))}
            >
                <Heading2 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={btnClass(editor.isActive('heading', { level: 3 }))}
            >
                <Heading3 size={18} />
            </button>
            <div className="w-px h-6 bg-gray-200 self-center mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={btnClass(editor.isActive('bulletList'))}
            >
                <List size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={btnClass(editor.isActive('orderedList'))}
            >
                <ListOrdered size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={btnClass(editor.isActive('blockquote'))}
            >
                <Quote size={18} />
            </button>
            <div className="w-px h-6 bg-gray-200 self-center mx-1" />
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
            >
                <Undo size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({
    content,
    onChange,
    placeholder = 'Type here...',
    minHeight = '400px',
    className = '',
    onDropHandler,
    onEditorReady
}) => {
    const dropHandlerRef = React.useRef(onDropHandler);
    dropHandlerRef.current = onDropHandler;

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
            AutoFillNode,
        ],
        content: content,
        onCreate: ({ editor }) => {
            if (onEditorReady) {
                onEditorReady(editor);
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none text-gray-800 ${className}`,
                style: `min-height: ${minHeight}; padding: 1.5rem;`,
            },
            handleDrop: (view: any, event: any) => {
                if (dropHandlerRef.current) {
                    return dropHandlerRef.current(view, event);
                }
                return false;
            },
            handleDOMEvents: {
                dragover: (_view: any, event: any) => {
                    event.preventDefault();
                    return false;
                },
            },
        },
    });

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <style>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror {
                    outline: none !important;
                }
                .auto-fill-pill {
                    background-color: #88D94C;
                    border: 1px solid #77C342;
                    border-radius: 9999px;
                    padding: 4px 14px;
                    margin: 0 4px;
                    font-weight: 700;
                    color: white;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;
                    font-size: 0.85em;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    vertical-align: middle;
                    line-height: 1;
                    cursor: default;
                }
            `}</style>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Search, FileText, Image, File, Video, MoreVertical, Download, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import FilterDropdown from "../../../../components/ui/FilterDropdown";

interface FileItem {
  id: number;
  name: string;
  type: "PDF" | "Image" | "Document" | "Video";
  size: string;
  date: string;
}

interface MenuPosition {
  top: number;
  right: number;
}

interface ActionMenuProps {
  isOpen: boolean;
  position: MenuPosition | null;
  onClose: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  isOpen,
  position,
  onClose,
  onDownload,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !position) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100]" onClick={onClose} />
      <div
        className="fixed z-[101] bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-44 animate-in fade-in zoom-in-95 duration-200"
        style={{
          top: position.top,
          right: position.right,
        }}
      >
        <div className="px-2 space-y-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Download size={16} className="text-gray-400" />
            Download
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} className="text-gray-400" />
            Edit name
          </button>
          <div className="h-px bg-gray-100 my-1 mx-2" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} className="text-red-400" />
            Delete
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

const FileManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: "Lease Agreement.pdf", type: "PDF", size: "2.4 MB", date: "2024-01-15" },
    { id: 2, name: "Property Photos.jpg", type: "Image", size: "5.8 MB", date: "2024-01-20" },
    { id: 3, name: "Maintenance Report.docx", type: "Document", size: "1.2 MB", date: "2024-02-01" },
    { id: 4, name: "Inspection Video.mp4", type: "Video", size: "45.6 MB", date: "2024-02-05" },
    { id: 5, name: "Tenant Agreement.pdf", type: "PDF", size: "3.1 MB", date: "2024-01-10" },
    { id: 6, name: "Floor Plan.png", type: "Image", size: "4.2 MB", date: "2024-01-25" },
  ]);

  // Close menu on scroll
  useEffect(() => {
    const handleScroll = () => setActiveMenuId(null);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const handleMenuClick = useCallback((e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
    setActiveMenuId(activeMenuId === id ? null : id);
  }, [activeMenuId]);

  const handleDownload = (file: FileItem) => {
    const dummyContent = `Mock content for ${file.name}`;
    const blob = new Blob([dummyContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleEditInit = (file: FileItem) => {
    setEditingFileId(file.id);
    setNewName(file.name);
  };

  const handleSaveName = () => {
    if (editingFileId && newName.trim()) {
      setFiles(prev => prev.map(f =>
        f.id === editingFileId ? { ...f, name: newName.trim() } : f
      ));
      setEditingFileId(null);
    }
  };

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!file.name.toLowerCase().includes(query) && !file.type.toLowerCase().includes(query)) {
          return false;
        }
      }
      if (fileTypeFilter && file.type !== fileTypeFilter) return false;
      return true;
    });
  }, [searchQuery, fileTypeFilter, files]);

  const totalSize = useMemo(() => {
    const totalMB = files.reduce((acc, file) => {
      const sizeVal = parseFloat(file.size.split(' ')[0]);
      return isNaN(sizeVal) ? acc : acc + sizeVal;
    }, 0);
    return `${totalMB.toFixed(1)} MB`;
  }, [files]);

  const stats = [
    { label: "All Files", value: files.length },
    { label: "Total Size", value: totalSize },
    { label: "Documents", value: files.filter(f => f.type === "PDF" || f.type === "Document").length },
    { label: "Media", value: files.filter(f => f.type === "Image" || f.type === "Video").length },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText size={16} className="text-red-600" />;
      case "Image": return <Image size={16} className="text-blue-600" />;
      case "Document": return <FileText size={16} className="text-blue-600" />;
      case "Video": return <Video size={16} className="text-purple-600" />;
      default: return <File size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-full mx-auto p-8 space-y-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-base font-medium ">
            <li>
              <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
            </li>
            <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
            <li className="text-[#1A1A1A] font-medium" aria-current="page">File manager</li>
          </ol>
        </nav>

        <div className="flex items-center pt-3 justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">File manager</h1>
        </div>

        <div className="border-t border-[#E5E7EB]"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#F4F4F4] border border-[#E5E7EB] rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search Anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-600 bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white rounded-full p-1.5 hover:bg-gray-800 transition-colors">
              <Search size={14} />
            </button>
          </div>

          <FilterDropdown
            placeholder="File type"
            value={fileTypeFilter}
            onSelect={setFileTypeFilter}
            options={[
              { label: "PDF", value: "PDF" },
              { label: "Image", value: "Image" },
              { label: "Document", value: "Document" },
              { label: "Video", value: "Video" },
            ]}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#7ED957] to-[#6BC847]">
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">Name</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">Type</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">Size</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">Date</th>
                  <th className="px-6 py-4 text-center text-white font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <span className="text-sm text-gray-900 font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{file.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{file.size}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(file.date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => handleMenuClick(e, file.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                          >
                            <MoreVertical size={18} />
                          </button>
                          <ActionMenu
                            isOpen={activeMenuId === file.id}
                            position={menuPosition}
                            onClose={() => setActiveMenuId(null)}
                            onDownload={() => handleDownload(file)}
                            onEdit={() => handleEditInit(file)}
                            onDelete={() => handleDelete(file.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400">No files found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingFileId !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit File Name</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7ED957] mb-6"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setEditingFileId(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveName}
                className="flex-1 px-4 py-2.5 bg-[#7ED957] text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-[#7ED957]/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;




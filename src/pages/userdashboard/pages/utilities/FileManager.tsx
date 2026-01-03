import React, { useState, useMemo } from "react";
import { Search, FileText, Image, File, Video } from "lucide-react";
import { Link } from "react-router-dom";
import FilterDropdown from "../../../../components/ui/FilterDropdown";

interface FileItem {
  id: number;
  name: string;
  type: "PDF" | "Image" | "Document" | "Video";
  size: string;
  date: string;
}

const FileManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);

  // Mock file data
  const mockFiles: FileItem[] = [
    {
      id: 1,
      name: "Lease Agreement.pdf",
      type: "PDF",
      size: "2.4 MB",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "Property Photos.jpg",
      type: "Image",
      size: "5.8 MB",
      date: "2024-01-20",
    },
    {
      id: 3,
      name: "Maintenance Report.docx",
      type: "Document",
      size: "1.2 MB",
      date: "2024-02-01",
    },
    {
      id: 4,
      name: "Inspection Video.mp4",
      type: "Video",
      size: "45.6 MB",
      date: "2024-02-05",
    },
    {
      id: 5,
      name: "Tenant Agreement.pdf",
      type: "PDF",
      size: "3.1 MB",
      date: "2024-01-10",
    },
    {
      id: 6,
      name: "Floor Plan.png",
      type: "Image",
      size: "4.2 MB",
      date: "2024-01-25",
    },
  ];

  // Filter files
  const filteredFiles = useMemo(() => {
    return mockFiles.filter((file) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !file.name.toLowerCase().includes(query) &&
          !file.type.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // File type filter
      if (fileTypeFilter && file.type !== fileTypeFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, fileTypeFilter]);

  // Stats data
  const stats = [
    { label: "All Files", value: mockFiles.length },
    { label: "Total Size", value: "62.3 MB" },
    { label: "Documents", value: mockFiles.filter(f => f.type === "PDF" || f.type === "Document").length },
    { label: "Media", value: mockFiles.filter(f => f.type === "Image" || f.type === "Video").length },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText size={16} className="text-red-600" />;
      case "Image":
        return <Image size={16} className="text-blue-600" />;
      case "Document":
        return <FileText size={16} className="text-blue-600" />;
      case "Video":
        return <Video size={16} className="text-purple-600" />;
      default:
        return <File size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-full mx-auto p-8 space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-md font-medium ">
            <li>
              <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
            </li>
            <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
            <li className="text-[#1A1A1A] font-lg font-medium" aria-current="page">File manager</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center pt-3 justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">File manager</h1>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB]"></div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#F4F4F4] border border-[#E5E7EB] rounded-lg p-6 shadow-sm"
            >
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>


        {/* Filters Section */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Bar */}
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

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#7ED957] to-[#6BC847]">
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Date
                  </th>
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
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm">No files found</p>
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setFileTypeFilter(null);
                          }}
                          className="mt-2 text-[#7ED957] hover:underline text-sm font-medium"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;



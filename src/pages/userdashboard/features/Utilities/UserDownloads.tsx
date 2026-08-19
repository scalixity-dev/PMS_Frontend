import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Image, File, Video, Download, ChevronLeft, ChevronRight, ListPlus } from "lucide-react";
import { useGetDownloads } from "../../../../hooks/useFilesQueries";

const ROWS_PER_PAGE = 10;

const getFileIcon = (mimeType: string | null, fileName: string) => {
  const mime = (mimeType || "").toLowerCase();
  const name = fileName.toLowerCase();
  if (mime.includes("pdf") || name.endsWith(".pdf")) return <FileText size={16} className="text-red-500" />;
  if (mime.startsWith("image/")) return <Image size={16} className="text-blue-500" />;
  if (mime.startsWith("video/")) return <Video size={16} className="text-purple-500" />;
  if (mime.includes("word") || mime.includes("document") || name.endsWith(".doc") || name.endsWith(".docx"))
    return <FileText size={16} className="text-blue-600" />;
  return <File size={16} className="text-gray-500" />;
};

const formatSize = (bytes: number | null): string => {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const Downloads: React.FC = () => {
  const { data: downloads = [], isLoading } = useGetDownloads();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = downloads.filter((d) =>
    d.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-full mx-auto p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-base font-medium">
            <li>
              <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
            </li>
            <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
            <li className="text-[#1A1A1A] font-medium" aria-current="page">Downloads</li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center pt-3 justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Downloads</h1>
        </div>

        <div className="border-t border-[#E5E7EB]" />

        {/* Search */}
        <div className="relative w-full md:w-auto md:max-w-xs">
          <input
            type="text"
            placeholder="Search downloads..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-4 pr-10 py-2.5 border border-gray-600 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-transparent shadow-[0px_2px_4px_rgba(0,0,0,0.05)]"
          />
          {/* Search runs live from the input's onChange, so this icon was a button that did nothing. Kept as markup in case it comes back as a non-clickable affordance.
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white rounded-lg p-1.5">
            <Search size={14} />
          </button>
          */}
        </div>

        {/* Table — Desktop */}
        <div className="hidden lg:flex bg-white rounded-[1rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden flex-col">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#7ED957] to-[#6BC847]">
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">Name</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">Size</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">Downloaded</th>
                  <th className="px-6 py-4 text-center text-white font-semibold text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : paginated.length > 0 ? (
                  paginated.map((d) => (
                    <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(d.mimeType, d.fileName)}
                          <span className="text-sm text-gray-900 font-medium truncate max-w-xs">{d.fileName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatSize(d.sizeBytes)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(d.downloadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a
                          href={d.fileUrl}
                          download={d.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3A6D6C] text-white rounded-lg text-xs font-medium hover:bg-[#2c5251] transition-colors"
                        >
                          <Download size={13} />
                          Download
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <div className="p-4 bg-gray-50 rounded-full">
                          <ListPlus size={36} className="text-gray-400" />
                        </div>
                        <p className="text-base font-semibold text-gray-700">No downloads yet</p>
                        <p className="text-sm text-gray-400">Files you download from the File Manager will appear here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-8 py-4 border-t border-gray-200 flex justify-center items-center gap-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className={`p-2 rounded-full transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}>
                <ChevronLeft className="w-6 h-6" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${currentPage === page ? 'bg-[#3A7D76] text-white shadow-lg' : 'bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-100'}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className={`p-2 rounded-full transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden flex flex-col gap-4">
          {isLoading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : paginated.length > 0 ? (
            paginated.map((d) => (
              <div key={d.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl">{getFileIcon(d.mimeType, d.fileName)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{d.fileName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatSize(d.sizeBytes)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(d.downloadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <a
                    href={d.fileUrl}
                    download={d.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[var(--dashboard-accent)] text-xs font-semibold hover:opacity-80 transition-opacity"
                  >
                    <Download size={13} />
                    Download again
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400 py-16">
              <div className="p-4 bg-gray-50 rounded-full">
                <ListPlus size={36} className="text-gray-400" />
              </div>
              <p className="text-base font-semibold text-gray-700">No downloads yet</p>
              <p className="text-sm text-center text-gray-400">Files you download from the File Manager will appear here.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-4">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className={`p-2 rounded-full transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}>
                <ChevronLeft className="w-6 h-6" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${currentPage === page ? 'bg-[#3A7D76] text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'}`}>
                  {page}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className={`p-2 rounded-full transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Downloads;

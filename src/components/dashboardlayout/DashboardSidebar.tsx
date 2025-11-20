// src/components/dashboard/DashboardSidebar.tsx
import { SquarePen } from "lucide-react";
import { 
  PiChartLineUpFill, 
  PiChartPieSliceFill, 
  PiBuildingsFill, 
  PiUsersFill, 
  PiCurrencyDollarFill, 
  PiWrenchFill, 
  PiFileTextFill, 
  PiFileFill, 
  PiDownloadFill
} from "react-icons/pi";
import { Link } from "react-router-dom";
import artworkImage from "../../assets/images/Artwork.png";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DashboardSidebar({ open, setOpen }: SidebarProps) {
  return (
    <>
      {/* Dark overlay for mobile/tablet */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 top-20 bottom-0 left-0 w-64 h-[calc(100vh-80px)]
        bg-white shadow-md transform lg:translate-x-0 transition-transform duration-300 overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >


        {/* Create New Button */}
        <div className="relative px-4 pt-4 pb-2">
          <button className="w-full bg-gradient-to-r from-[#1BCB40] to-[#7CD947] hover:opacity-95 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#1BCB40]/40 shadow-[0_20px_60px_rgba(27,203,64,0.32)] hover:shadow-[0_28px_90px_rgba(27,203,64,0.44)]">
            Create New
            <SquarePen size={20} className="text-white" />
          </button>

          {/* Extended glow panel reaching down to cover Portfolio item */}
          <div className="pointer-events-none absolute left-4 right-4 top-[64px] h-28">
            <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#1BCB40]/40 to-transparent filter blur-[20px] opacity-40" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-1 py-2 space-y-1">
          <SidebarLink label="Dashboard" to="/dashboard" icon={<PiChartLineUpFill size={24} />} />
          <SidebarLink label="Portfolio" to="/portfolio" icon={<PiChartPieSliceFill size={24} />} />
          <SidebarLink label="Leasing" to="/leasing" icon={<PiBuildingsFill size={24} />} />
          <SidebarLink label="Contacts" to="/contacts" icon={<PiUsersFill size={24} />} />
          <SidebarLink label="Accounting" to="/accounting" icon={<PiCurrencyDollarFill size={24} />} />
          <SidebarLink label="Maintenance" to="/maintenance" icon={<PiWrenchFill size={24} />} />
          <SidebarLink label="Documents" to="/documents" icon={<PiFileTextFill size={24} />} />
          <SidebarLink label="Reports" to="/reports" icon={<PiFileFill size={24} />} />
          <SidebarLink label="Downloads" to="/downloads" icon={<PiDownloadFill size={24} />} />
        </nav>

        {/* Artwork at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <img 
            src={artworkImage} 
            alt="Decorative artwork" 
            className="mx-auto object-fill opacity-90 blur-[3px]"
          />
        </div>
      </aside>
    </>
  );
}

interface SidebarLinkProps {
  label: string;
  to: string;
  icon: React.ReactNode;
}

function SidebarLink({ label, to, icon }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors group"
    >
      <span className="text-black group-hover:text-black">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

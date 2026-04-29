import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import {
  LayoutDashboard,
  ClipboardList,
  PackageSearch,
  MessageSquareQuote,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";

interface SidebarItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

function SidebarItem({ to, icon, label, active, onClick }: SidebarItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
          : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, roles: ["admin", "operator", "supervisor"] },
    { to: "/material-issue", label: "Material Issue", icon: <ClipboardList size={20} />, roles: ["admin", "operator", "supervisor"] },
    { to: "/consumption", label: "Consumption", icon: <PackageSearch size={20} />, roles: ["admin", "operator", "supervisor"] },
    { to: "/ai", label: "AI Assistant", icon: <MessageSquareQuote size={20} />, roles: ["admin", "operator", "supervisor"] },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <div className="flex h-screen bg-black text-zinc-100 overflow-hidden">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <img src="/favicon.png" alt="Logo" className="w-10 h-10 rounded-lg" />
            <h1 className="text-xl font-bold text-purple-400">
              Material System
            </h1>
          </div>

          <nav className="space-y-2">
            {filteredNavItems.map((item) => (
              <SidebarItem
                key={item.to}
                {...item}
                active={location.pathname === item.to}
              />
            ))}
          </nav>
        </div>

        {/* USER + LOGOUT */}
        <div className="mt-auto p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold">{user?.username}</p>
              <p className="text-xs text-zinc-500 uppercase flex items-center gap-1">
                <ShieldCheck size={10} /> {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MOBILE OVERLAY ================= */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">

          {/* TOP */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>

            {/* NAV */}
            <nav className="space-y-2">
              {filteredNavItems.map((item) => (
                <SidebarItem
                  key={item.to}
                  {...item}
                  active={location.pathname === item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </nav>
          </div>

          {/* 🔥 USER + LOGOUT (FIXED) */}
          <div className="mt-auto pt-6 border-t border-zinc-800">

            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold">{user?.username}</p>
                <p className="text-xs text-zinc-500 uppercase">
                  {user?.role}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6">

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4 ml-auto">

            {/* USER INFO (mobile small) */}
            <div className="md:hidden text-right">
              <p className="text-xs">{user?.username}</p>
              <p className="text-[10px] text-zinc-500">{user?.role}</p>
            </div>

            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <UserIcon size={18} />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

import {
  LayoutDashboard,
  Users,
  FileBarChart,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/api/auth';

const AdminLayout = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-neutral-100 font-sans text-neutral-900">
      <div className="flex h-full w-full p-4 gap-4">
        {/* ================= Sidebar ================= */}
        <aside
          className="
            hidden md:flex w-64 flex-col
            bg-neutral-900/90 text-neutral-100
            rounded-3xl shadow-2xl
            backdrop-blur-xl
          "
        >
          {/* Brand */}
          <div className="px-6 py-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Admin Portal
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Administration
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            <SidebarLink to="/admin" icon={LayoutDashboard} label="Dashboard" end />
            <SidebarLink to="/admin/enrollments" icon={ClipboardList} label="Enrollments" />
            <SidebarLink to="/admin/users" icon={Users} label="Users" />
            <SidebarLink to="/admin/reports" icon={FileBarChart} label="Reports" />
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="
                flex items-center gap-2 text-sm
                text-neutral-400 hover:text-white
                transition
              "
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* ================= Main ================= */}
        <div className="flex-1 rounded-3xl bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Top Bar */}
          <header className="border-b border-neutral-200">
            <div className="flex justify-between items-center px-8 py-5">
              <h1 className="text-2xl font-semibold tracking-tight">
                Admin Panel
              </h1>

              <div className="text-sm text-neutral-600">
                {user?.firstName} {user?.lastName || 'Administrator'}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({
  to,
  icon: Icon,
  label,
  end = false,
}: any) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `
      relative group flex items-center gap-3
      px-4 py-2.5 rounded-xl
      text-sm font-medium cursor-pointer
      transition-all duration-200 ease-out
      ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-neutral-400 hover:text-white hover:bg-white/10'
      }
    `
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <span className="absolute left-1 top-2 bottom-2 w-[3px] rounded-full bg-white" />
        )}

        <Icon
          className={`
            w-[18px] h-[18px]
            ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}
          `}
        />
        <span className="tracking-tight">{label}</span>
      </>
    )}
  </NavLink>
);

export default AdminLayout;

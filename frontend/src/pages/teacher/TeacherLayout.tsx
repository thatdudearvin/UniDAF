import {
  BookUser,
  ClipboardCheck,
  QrCode,
  GraduationCap,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/api/auth';

const TeacherLayout = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-emerald-50 font-sans text-slate-900">
      <div className="flex h-full w-full gap-4 p-4">
        <aside
          className="
            hidden w-64 flex-col rounded-3xl
            bg-emerald-700/95 text-emerald-50
            shadow-2xl backdrop-blur-xl md:flex
          "
        >
          <div className="px-6 py-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <GraduationCap className="h-5 w-5" />
              Teacher Portal
            </h2>
            <p className="mt-0.5 text-xs text-emerald-200">Instructional Services</p>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            <SidebarLink to="/teacher" icon={LayoutDashboard} label="Dashboard" end />
            <SidebarLink to="/teacher/classes" icon={BookUser} label="My Classes" />
            <SidebarLink to="/teacher/grade-entry" icon={ClipboardCheck} label="Grade Entry" />
            <SidebarLink to="/teacher/attendance" icon={QrCode} label="Attendance" />
          </nav>

          <div className="border-t border-white/15 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-emerald-200 transition hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
          <header className="border-b border-emerald-100">
            <div className="flex items-center justify-between px-8 py-5">
              <h1 className="text-2xl font-semibold tracking-tight text-emerald-900">
                Teacher Dashboard
              </h1>
              <div className="text-sm text-slate-600">
                Prof. {user?.lastName || user?.firstName || 'Instructor'}
              </div>
            </div>
          </header>

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
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
}) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `
      relative group flex items-center gap-3
      rounded-xl px-4 py-2.5
      text-sm font-medium transition-all duration-200 ease-out
      ${
        isActive
          ? 'bg-white/20 text-white'
          : 'text-emerald-100 hover:bg-white/20 hover:text-white'
      }
    `
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <span className="absolute bottom-2 left-1 top-2 w-[3px] rounded-full bg-white" />
        )}

        <Icon
          className={`h-[18px] w-[18px] ${
            isActive ? 'text-white' : 'text-emerald-100 group-hover:text-white'
          }`}
        />
        <span className="tracking-tight">{label}</span>
      </>
    )}
  </NavLink>
);

export default TeacherLayout;
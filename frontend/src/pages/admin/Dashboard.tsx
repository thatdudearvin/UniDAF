import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, FileBarChart } from "lucide-react";

const accentMap = {
  indigo: "text-indigo-600",
  emerald: "text-emerald-600",
  blue: "text-blue-600",
  amber: "text-amber-600",
};

type StatCardProps = {
  title: string;
  value: string;
  accent: keyof typeof accentMap;
};

const StatCard = ({ title, value, accent }: StatCardProps) => (
  <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6 shadow-sm hover:shadow-md transition">
    <p className="text-sm text-neutral-500">{title}</p>
    <p className={`mt-2 text-3xl font-semibold tracking-tight ${accentMap[accent]}`}>
      {value}
    </p>
  </div>
);

type ActionCardProps = {
  title: string;
  description: string;
  action: string;
  to: string;
  icon: React.ElementType;
};

const ActionCard = ({ title, description, action, to, icon: Icon }: ActionCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-neutral-600" />
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-neutral-600">{description}</p>
      </div>

      <button
        onClick={() => navigate(to)}
        className="mt-6 self-start rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
      >
        {action}
      </button>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div className="space-y-10">
      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="1,234" accent="indigo" />
        <StatCard title="Active Classes" value="45" accent="emerald" />
        <StatCard title="Faculty Members" value="67" accent="blue" />
        <StatCard title="Pending Enrollments" value="23" accent="amber" />
      </section>

      {/* Management */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="Enrollment Management"
            description="Process and approve student enrollments"
            action="Manage Enrollments"
            to="/admin/enrollments"
            icon={ClipboardList}
          />

          <ActionCard
            title="User Management"
            description="Manage users, roles, and permissions"
            action="Manage Users"
            to="/admin/users"
            icon={Users}
          />

          <ActionCard
            title="Reports & Analytics"
            description="Generate and export institutional reports"
            action="View Reports"
            to="/admin/reports"
            icon={FileBarChart}
          />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

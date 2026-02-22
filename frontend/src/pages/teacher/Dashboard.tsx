import { useNavigate } from 'react-router-dom';
import { BookUser, ClipboardCheck, QrCode } from 'lucide-react';

const accentMap = {
  emerald: 'text-emerald-600',
  blue: 'text-blue-600',
  amber: 'text-amber-600',
};

type StatCardProps = {
  title: string;
  value: string;
  accent: keyof typeof accentMap;
};

const StatCard = ({ title, value, accent }: StatCardProps) => (
  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-sm transition hover:shadow-md">
    <p className="text-sm text-slate-500">{title}</p>
    <p className={`mt-2 text-3xl font-semibold tracking-tight ${accentMap[accent]}`}>{value}</p>
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
    <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-emerald-600" />
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>

      <button
        onClick={() => navigate(to)}
        className="mt-6 self-start rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        {action}
      </button>
    </div>
  );
};

const TeacherDashboard = () => {
  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Active Classes" value="3" accent="emerald" />
        <StatCard title="Total Students" value="75" accent="blue" />
        <StatCard title="Pending Grades" value="12" accent="amber" />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Teaching Tools</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ActionCard
            title="My Classes"
            description="View and manage assigned classes"
            action="View Classes"
            to="/teacher/classes"
            icon={BookUser}
          />

          <ActionCard
            title="Grade Entry"
            description="Enter and publish student grades"
            action="Enter Grades"
            to="/teacher/grade-entry"
            icon={ClipboardCheck}
          />

          <ActionCard
            title="Attendance"
            description="Generate QR codes and track attendance"
            action="Manage Attendance"
            to="/teacher/attendance"
            icon={QrCode}
          />
        </div>
      </section>
    </div>
  );
};

export default TeacherDashboard;
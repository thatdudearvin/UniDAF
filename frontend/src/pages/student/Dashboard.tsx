import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, QrCode } from 'lucide-react';

const accentMap = {
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  blue: 'text-blue-600',
};

type StatCardProps = {
  title: string;
  value: string;
  accent: keyof typeof accentMap;
};

const StatCard = ({ title, value, accent }: StatCardProps) => (
  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm transition hover:shadow-md">
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
    <div className="flex flex-col justify-between rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>

      <button
        onClick={() => navigate(to)}
        className="mt-6 self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        {action}
      </button>
    </div>
  );
};

const StudentDashboard = () => {
  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Current GPA" value="3.75" accent="indigo" />
        <StatCard title="Enrolled Classes" value="5" accent="emerald" />
        <StatCard title="Attendance Rate" value="95%" accent="blue" />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Management</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ActionCard
            title="My Grades"
            description="View current and past academic grades"
            action="View Grades"
            to="/student/grades"
            icon={BookOpen}
          />

          <ActionCard
            title="Class Schedule"
            description="Check your classes and timings"
            action="View Schedule"
            to="/student/schedule"
            icon={CalendarDays}
          />

          <ActionCard
            title="Attendance"
            description="Mark attendance using QR code"
            action="Scan QR Code"
            to="/student/attendance"
            icon={QrCode}
          />
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
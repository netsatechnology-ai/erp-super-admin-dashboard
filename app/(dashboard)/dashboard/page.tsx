import { LayoutDashboard, Users, CreditCard, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-hover">Dashboard Overview</h1>
        <p className="text-sm text-secondary mt-1">
          Welcome to the ERP Super Admin panel.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="rounded-xl border border-secondary-light bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary">Total Users</span>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold text-secondary-hover">1,284</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-primary-light text-primary">
            +12% from last month
          </span>
        </div>

        {/* Active Sessions */}
        <div className="rounded-xl border border-secondary-light bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary">Active Sessions</span>
            <Activity className="h-5 w-5 text-tertiary" />
          </div>
          <p className="mt-3 text-2xl font-bold text-secondary-hover">432</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-tertiary-light text-tertiary">
            +5% active now
          </span>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-xl border border-secondary-light bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary">Monthly Revenue</span>
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold text-secondary-hover">$24,500</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-tertiary-light text-tertiary">
            +18% growth
          </span>
        </div>

        {/* System Status */}
        <div className="rounded-xl border border-secondary-light bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary">System Status</span>
            <LayoutDashboard className="h-5 w-5 text-tertiary" />
          </div>
          <p className="mt-3 text-2xl font-bold text-tertiary">Healthy</p>
          <span className="text-xs text-secondary font-medium">99.9% uptime</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-xl border border-secondary-light bg-white p-6 shadow-sm min-h-[300px]">
        <h2 className="text-lg font-semibold text-secondary-hover mb-2">Recent Activity</h2>
        <p className="text-sm text-secondary">
          Your full system overview and analytics widgets will render here.
        </p>
      </div>
    </div>
  );
}
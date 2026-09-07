import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-secondary-light bg-white px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-secondary">
              Super Admin Portal
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
              AD
            </div>
            <span className="text-sm font-medium text-secondary">Admin User</span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
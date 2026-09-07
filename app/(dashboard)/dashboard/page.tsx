import { Header } from "@/components/dashboard/Header";
import { LayoutDashboard, Users, CreditCard, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">

    

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="rounded-xl border border-secondary-light bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary">Total Users</span>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold text-secondary-hover">1,284</p>
        
        </div>

        {/* Active Sessions */}
        <div className="rounded-xl border border-secondary-light bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary">Active Sessions</span>
            <Activity className="h-5 w-5 text-tertiary" />
          </div>
          <p className="mt-3 text-2xl font-bold text-secondary-hover">432</p>
        
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-xl border border-secondary-light bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary">Monthly Revenue</span>
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold text-secondary-hover">$24,500</p>
        
        </div>

     
      </div>

  
    </div>
  );
}
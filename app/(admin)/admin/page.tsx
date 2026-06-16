import { redirect } from "next/navigation"
import { createClient } from "@/app/lib/supabase/server"
import { getDashboardData } from "@/app/(admin)/actions/dashboard"
import { DashboardClient } from "@/app/components/admin/dashboard-client"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "Admin Dashboard | Gym Management Portal",
  description: "Advanced admin portal for branch statistics, audit logs, financials, scheduling and rosters.",
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // 1. Fetch user session securely
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 2. Fetch data based on user role from server action
  const result = await getDashboardData()

  if (!result.success) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <h3 className="font-extrabold text-sm">System Error Loading Dashboard</h3>
            <p className="text-xs opacity-90 mt-0.5">{result.error || "An unexpected error occurred. Please contact system support."}</p>
          </div>
        </div>
      </div>
    )
  }

  const role = result.role || "trainer"
  const dashboardData = result.data

  return (
    <div className="flex-1 w-full space-y-6">
      <DashboardClient role={role} data={dashboardData} />
    </div>
  )
}
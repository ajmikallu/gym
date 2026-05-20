import { createClient } from "@/app/lib/supabase/server"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Activity } from "lucide-react"
import { getMembershipDashboardData } from "./actions"
import { DashboardClient } from "./dashboard-client"

/**
 * DashboardPage Component
 * 
 * The main landing page for authenticated users.
 * Fetches the current user session from Supabase, checks role-based access,
 * and renders the interactive dashboard client with modular Overview/Membership views.
 * 
 * @returns {Promise<JSX.Element>} The rendered Dashboard page
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { user } = session
  const fullName = user.user_metadata?.full_name || "Athlete"
  
  // Safe, pre-verified server-side role retrieval
  const role = user?.app_metadata?.assigned_role || user?.role || "customer"
  const isCustomer = role === "customer"

  // Fetch membership database details for customers
  let memberships: any[] = []
  let catalog: any = { branches: [], activities: [], pricings: [], trainers: [] }

  if (isCustomer) {
    const dataRes = await getMembershipDashboardData()
    if (dataRes.success) {
      memberships = dataRes.memberships || []
      catalog = dataRes.catalog || catalog
    }
  }

  // Pre-render static-styled components to feed into the Client Tab layout
  const recentActivity = (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your completed workouts over the past week.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-6 pb-6 pr-6">
        <div className="h-[250px] w-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <Activity className="h-8 w-8 text-zinc-400 mb-2" />
          <span className="text-sm text-zinc-500 font-medium">Connect your fitness tracker to see activity</span>
        </div>
      </CardContent>
    </Card>
  )

  const upcomingSchedule = (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80">
      <CardHeader>
        <CardTitle>Upcoming Schedule</CardTitle>
        <CardDescription>
          Classes you are registered for.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[
            { title: "HIIT Blast", time: "Today, 6:00 PM", coach: "Sarah J." },
            { title: "Powerlifting Foundations", time: "Tomorrow, 7:00 AM", coach: "Mike R." },
            { title: "Recovery Yoga", time: "Friday, 5:30 PM", coach: "Emma W." },
          ].map((cls, i) => (
            <div key={i} className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-50">{cls.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {cls.time}
                </p>
              </div>
              <div className="text-xs font-bold text-orange-600 bg-orange-600/10 px-2.5 py-1 rounded-lg">
                {cls.coach}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardClient
      fullName={fullName}
      isCustomer={isCustomer}
      initialMemberships={memberships}
      catalog={catalog}
      recentActivity={recentActivity}
      upcomingSchedule={upcomingSchedule}
    />
  )
}
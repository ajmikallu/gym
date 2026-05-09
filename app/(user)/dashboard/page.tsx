import { createClient } from "@/app/lib/supabase/server"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Separator } from "@/app/components/ui/separator"
import { Activity, Calendar as CalendarIcon, Flame, Trophy } from "lucide-react"

/**
 * DashboardPage Component
 * 
 * The main landing page for authenticated users.
 * Fetches the current user session from Supabase and displays a personalized dashboard.
 * Includes metrics for active plans, next classes, workout streaks, and a schedule feed.
 * 
 * @returns {Promise<JSX.Element>} The rendered Dashboard page
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const fullName = user.user_metadata?.full_name || "Athlete"

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back, {fullName}!
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Here is an overview of your progress and upcoming schedule.</p>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plan</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pro Membership</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Renews in 14 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <CalendarIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">HIIT Blast</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Today at 6:00 PM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Days</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Keep it up!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Trophy className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your completed workouts over the past week.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-6 pb-6 pr-6">
            <div className="h-[250px] w-full flex flex-col items-center justify-center rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
              <Activity className="h-8 w-8 text-zinc-400 mb-2" />
              <span className="text-sm text-zinc-500 font-medium">Connect your fitness tracker to see activity</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
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
                    <p className="text-sm font-medium leading-none">{cls.title}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {cls.time}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-orange-600 bg-orange-600/10 px-2 py-1 rounded-sm">
                    {cls.coach}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
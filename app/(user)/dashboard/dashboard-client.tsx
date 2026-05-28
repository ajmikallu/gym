"use client"

import * as React from "react"
import { LayoutDashboard, Flame, Trophy, Activity, Calendar as CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

interface DashboardClientProps {
  fullName: string
  isCustomer: boolean
  recentActivity: React.ReactNode
  upcomingSchedule: React.ReactNode
}

export function DashboardClient({
  fullName,
  recentActivity,
  upcomingSchedule
}: DashboardClientProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Welcome back, {fullName}!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Here is an overview of your progress, schedule, and program subscriptions.
          </p>
        </div>
      </div>

      {/* OVERVIEW CONTENT */}
      <div className="space-y-8 animate-in fade-in duration-300">

        {/* Quick Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80">
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

          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80">
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

          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80">
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

          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80">
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

        {/* Activity and Schedule Panels */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            {recentActivity}
          </div>

          <div className="lg:col-span-3">
            {upcomingSchedule}
          </div>
        </div>

      </div>

    </div>
  )
}

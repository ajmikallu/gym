"use client"

import * as React from "react"
import { useState } from "react"
import { LayoutDashboard, Award, Flame, Trophy, Activity, Calendar as CalendarIcon, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Separator } from "@/app/components/ui/separator"
import { MembershipTab } from "./membership-tab"

interface DashboardClientProps {
  fullName: string
  isCustomer: boolean
  initialMemberships: any[]
  catalog: any
  recentActivity: React.ReactNode
  upcomingSchedule: React.ReactNode
}

export function DashboardClient({
  fullName,
  isCustomer,
  initialMemberships,
  catalog,
  recentActivity,
  upcomingSchedule
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "membership">("overview")

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header section with tab selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Welcome back, {fullName}!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Here is an overview of your progress, schedule, and program subscriptions.
          </p>
        </div>

        {/* Tab switcher buttons - only for customers */}
        {isCustomer && (
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 self-start md:self-center shrink-0 shadow-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${activeTab === "overview"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("membership")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${activeTab === "membership"
                  ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
            >
              <Award className="w-4 h-4" />
              Memberships
            </button>
          </div>
        )}
      </div>

      {/* OVERVIEW TAB CONTENT */}
      {activeTab === "overview" && (
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
      )}

      {/* MEMBERSHIPS TAB CONTENT */}
      {activeTab === "membership" && isCustomer && (
        <MembershipTab
          initialMemberships={initialMemberships}
          catalog={catalog}
        />
      )}

    </div>
  )
}

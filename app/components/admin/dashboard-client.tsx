"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
  LayoutDashboard,
  Users,
  MapPin,
  Activity,
  Award,
  Trophy,
  Clock,
  Database,
  Search,
  Eye,
  X,
  AlertCircle,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Dumbbell,
  BarChart2,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

interface DashboardClientProps {
  role: string
  data: any
}

// ----------------------------------------------------
// DEMO MOCK DATA FOR WOW FACTOR
// ----------------------------------------------------
const DEMO_REVENUE_HISTORY = [
  { month: "Jan", sales: 1200 },
  { month: "Feb", sales: 2100 },
  { month: "Mar", sales: 1800 },
  { month: "Apr", sales: 2900 },
  { month: "May", sales: 3400 },
  { month: "Jun", sales: 4100 },
]

const DEMO_AUDIT_LOGS = [
  {
    id: 101,
    action: "INSERT",
    table_name: "memberships",
    record_id: 14,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    user_name: "Root Superadmin",
    old_data: null,
    new_data: { user_id: "u-1", price: 249.00, has_pt: true, duration_days: 90 }
  },
  {
    id: 102,
    action: "UPDATE",
    table_name: "slots",
    record_id: 8,
    created_at: new Date(Date.now() - 32 * 60000).toISOString(),
    user_name: "Jane Admin",
    old_data: { max_capacity: 15, current_bookings: 10 },
    new_data: { max_capacity: 20, current_bookings: 10 }
  },
  {
    id: 103,
    action: "DELETE",
    table_name: "offers",
    record_id: 3,
    created_at: new Date(Date.now() - 120 * 60000).toISOString(),
    user_name: "Root Superadmin",
    old_data: { code: "SPRING10", discount_value: 10.00 },
    new_data: null
  },
  {
    id: 104,
    action: "UPDATE",
    table_name: "profiles",
    record_id: 99,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    user_name: "Emma Zen",
    old_data: { weight: 70.50 },
    new_data: { weight: 68.20 }
  }
]

const DEMO_BRANCHES = [
  { id: 1, name: "Downtown Powerhouse", address: "101 Muscle Blvd, NY", timezone: "America/New_York", membersCount: 145, trainersCount: 8, country: { name: "United States" } },
  { id: 2, name: "Sunset Wellness Hub", address: "55 Zen Way, CA", timezone: "America/Los_Angeles", membersCount: 92, trainersCount: 5, country: { name: "United States" } },
  { id: 3, name: "Metro Fitness Studio", address: "404 High Road, London", timezone: "Europe/London", membersCount: 110, trainersCount: 6, country: { name: "United Kingdom" } }
]

const DEMO_BOOKINGS = [
  { id: 201, booking_time: new Date(Date.now() - 10 * 60000).toISOString(), status: "CONFIRMED", user_name: "Alexander Mercer", slot: { start_time: new Date(Date.now() + 7200000).toISOString(), activity: { name: "HIIT Conditioning" }, branch: { name: "Downtown Powerhouse" } } },
  { id: 202, booking_time: new Date(Date.now() - 45 * 60000).toISOString(), status: "CONFIRMED", user_name: "Sophia Martinez", slot: { start_time: new Date(Date.now() + 18000000).toISOString(), activity: { name: "Power Yoga Flow" }, branch: { name: "Sunset Wellness Hub" } } },
  { id: 203, booking_time: new Date(Date.now() - 120 * 60000).toISOString(), status: "CANCELLED", user_name: "Marcus Aurelius", slot: { start_time: new Date(Date.now() - 3600000).toISOString(), activity: { name: "Olympic Weightlifting" }, branch: { name: "Downtown Powerhouse" } } },
  { id: 204, booking_time: new Date(Date.now() - 180 * 60000).toISOString(), status: "CONFIRMED", user_name: "Lily Sterling", slot: { start_time: new Date(Date.now() + 86400000).toISOString(), activity: { name: "Spin Endurance" }, branch: { name: "Metro Fitness Studio" } } }
]

const DEMO_TRAINERS = [
  { id: 1, name: "Coach Mike Irons", email: "mike@apexfit.com", specialization: "Strength & Conditioning", branch: { name: "Downtown Powerhouse" } },
  { id: 2, name: "Coach Sarah Flex", email: "sarah@apexfit.com", specialization: "Functional Training", branch: { name: "Sunset Wellness Hub" } },
  { id: 3, name: "Emma Zen", email: "emma@apexfit.com", specialization: "Yoga & Mindfulness", branch: { name: "Sunset Wellness Hub" } },
  { id: 4, name: "Lucas Heavy", email: "lucas@apexfit.com", specialization: "Powerlifting Coach", branch: { name: "Metro Fitness Studio" } }
]

const DEMO_SLOTS = [
  { id: 301, start_time: new Date(Date.now() + 7200000).toISOString(), end_time: new Date(Date.now() + 10800000).toISOString(), max_capacity: 12, current_bookings: 10, activity: { name: "Powerlifting Basics", description: "Learn safe deadlifts, squats, and bench presses." }, branch: { name: "Downtown Powerhouse" } },
  { id: 302, start_time: new Date(Date.now() + 86400000).toISOString(), end_time: new Date(Date.now() + 90000000).toISOString(), max_capacity: 15, current_bookings: 15, activity: { name: "HIIT Cardio Circuit", description: "High intensity interval training to boost engine." }, branch: { name: "Downtown Powerhouse" } },
  { id: 303, start_time: new Date(Date.now() + 172800000).toISOString(), end_time: new Date(Date.now() + 176400000).toISOString(), max_capacity: 10, current_bookings: 2, activity: { name: "Private Strength Coaching", description: "One-on-one session customized for client goals." }, branch: { name: "Downtown Powerhouse" } }
]

const DEMO_TRAINER_ROSTER = [
  { id: 401, booking_time: new Date().toISOString(), status: "CONFIRMED", user: { full_name: "Marcus Aurelius", age: 34, height: 185.00, weight: 92.50 }, slot: { activity: { name: "Powerlifting Basics" } } },
  { id: 402, booking_time: new Date().toISOString(), status: "CONFIRMED", user: { full_name: "Julius Caesar", age: 41, height: 178.00, weight: 79.00 }, slot: { activity: { name: "Powerlifting Basics" } } },
  { id: 403, booking_time: new Date().toISOString(), status: "CONFIRMED", user: { full_name: "Lily Sterling", age: 26, height: 168.00, weight: 58.50 }, slot: { activity: { name: "HIIT Cardio Circuit" } } }
]

export function DashboardClient({ role, data }: DashboardClientProps) {
  const [demoMode, setDemoMode] = useState(false)
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null)

  // Superadmin Audit Logs Search & Filters
  const [logSearch, setLogSearch] = useState("")
  const [logActionFilter, setLogActionFilter] = useState("all")

  const [mounted, setMounted] = useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const normalizedRole = role.toLowerCase()

  // ----------------------------------------------------
  // SELECT ACTIVE DATASET (REAL VS DEMO)
  // ----------------------------------------------------
  const isSuperadmin = normalizedRole === "superadmin"
  const isAdmin = normalizedRole === "admin"
  const isTrainer = normalizedRole === "trainer"

  // Check if real database is empty to default to demo mode or encourage toggling
  const isRealDataEmpty = useMemo(() => {
    if (isSuperadmin) {
      return !data?.auditLogs || data.auditLogs.length === 0
    }
    if (isAdmin) {
      return !data?.recentBookings || data.recentBookings.length === 0
    }
    if (isTrainer) {
      return !data?.slots || data.slots.length === 0
    }
    return true
  }, [data, isSuperadmin, isAdmin, isTrainer])

  // Automatically enable demo mode if real DB is empty so the dashboard isn't blank on first load
  React.useEffect(() => {
    if (isRealDataEmpty) {
      setDemoMode(true)
    }
  }, [isRealDataEmpty])

  // ----------------------------------------------------
  // COMPUTED SUPERADMIN DATA
  // ----------------------------------------------------
  const superadminMetrics = useMemo(() => {
    if (demoMode) {
      return {
        totalUsers: 154,
        totalBranches: 3,
        totalActivities: 8,
        totalTrainers: 12,
        totalRevenue: 6420.00
      }
    }
    return data?.metrics || { totalUsers: 0, totalBranches: 0, totalActivities: 0, totalTrainers: 0, totalRevenue: 0 }
  }, [data, demoMode])

  const superadminBranches = useMemo(() => {
    return demoMode ? DEMO_BRANCHES : (data?.branches || [])
  }, [data, demoMode])

  const superadminAuditLogs = useMemo(() => {
    const rawLogs = demoMode ? DEMO_AUDIT_LOGS : (data?.auditLogs || [])
    return rawLogs.filter((log: any) => {
      const matchSearch = (log.user_name || "").toLowerCase().includes(logSearch.toLowerCase()) ||
        (log.table_name || "").toLowerCase().includes(logSearch.toLowerCase()) ||
        String(log.record_id).includes(logSearch)
      const matchAction = logActionFilter === "all" || log.action === logActionFilter
      return matchSearch && matchAction
    })
  }, [data, demoMode, logSearch, logActionFilter])

  // Sparkline Chart (SVG)
  const sparklinePoints = useMemo(() => {
    const points = demoMode ? DEMO_REVENUE_HISTORY : [
      { month: "Cur", sales: superadminMetrics.totalRevenue }
    ]
    if (points.length === 1) {
      return `0,80 150,${80 - Math.min(60, points[0].sales / 5)} 300,80`
    }
    const maxVal = Math.max(...points.map(p => p.sales), 100)
    return points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * 260 + 20
      const y = 80 - (p.sales / maxVal) * 60
      return `${x},${y}`
    }).join(" ")
  }, [superadminMetrics, demoMode])

  // ----------------------------------------------------
  // COMPUTED ADMIN DATA
  // ----------------------------------------------------
  const adminMetrics = useMemo(() => {
    if (demoMode) {
      return {
        totalMembers: 142,
        totalBranches: 3,
        totalTrainers: 12,
        activeMemberships: 118
      }
    }
    return data?.metrics || { totalMembers: 0, totalBranches: 0, totalTrainers: 0, activeMemberships: 0 }
  }, [data, demoMode])

  const adminBookings = useMemo(() => {
    return demoMode ? DEMO_BOOKINGS : (data?.recentBookings || [])
  }, [data, demoMode])

  const adminTrainers = useMemo(() => {
    return demoMode ? DEMO_TRAINERS : (data?.trainers || [])
  }, [data, demoMode])

  // ----------------------------------------------------
  // COMPUTED TRAINER DATA
  // ----------------------------------------------------
  const trainerProfile = useMemo(() => {
    if (demoMode) {
      return {
        name: "Coach Mike Irons",
        specialization: "Strength & Conditioning",
        branch_name: "Downtown Powerhouse",
        email: "mike@apexfit.com"
      }
    }
    return data?.trainer || { name: "Trainer", specialization: "Fitness", branch_name: "N/A", email: "" }
  }, [data, demoMode])

  const trainerMetrics = useMemo(() => {
    if (demoMode) {
      return {
        totalSlots: 3,
        totalBookings: 27
      }
    }
    return data?.metrics || { totalSlots: 0, totalBookings: 0 }
  }, [data, demoMode])

  const trainerSlots = useMemo(() => {
    return demoMode ? DEMO_SLOTS : (data?.slots || [])
  }, [data, demoMode])

  const trainerRoster = useMemo(() => {
    return demoMode ? DEMO_TRAINER_ROSTER : (data?.bookings || [])
  }, [data, demoMode])

  // Render role indicator color
  const roleColor = isSuperadmin ? "from-red-600 to-rose-500 bg-rose-600/10 text-rose-600 border-rose-600/20" :
    isAdmin ? "from-amber-600 to-orange-500 bg-orange-600/10 text-orange-600 border-orange-600/20" :
      "from-emerald-600 to-teal-500 bg-emerald-600/10 text-emerald-600 border-emerald-600/20"

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ----------------------------------------------------
          HEADER SECTION WITH DEMO MODE TOGGLE
          ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
              <LayoutDashboard className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
              {isSuperadmin && "Superadmin Command"}
              {isAdmin && "Branch Operations Panel"}
              {isTrainer && "Trainer Performance"}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${roleColor.split(" ").slice(2).join(" ")}`}>
              {role}
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {isSuperadmin && "Centralized monitoring system logs, audit trails, and financials."}
            {isAdmin && "Gym branch status, schedules, member count, and trainer directories."}
            {isTrainer && `Performance analytics for ${trainerProfile.name} (${trainerProfile.specialization}).`}
          </p>
        </div>

        {/* Demo Mode Switcher */}
        <div className="flex items-center gap-3 bg-zinc-100/80 dark:bg-zinc-900/80 p-2.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-sm self-start md:self-auto">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200">Demonstration Mode</span>
            <span className="text-[10px] text-zinc-500">
              {isRealDataEmpty ? "Forced: DB is empty" : "Show simulated entries"}
            </span>
          </div>
          <button
            onClick={() => {
              if (!isRealDataEmpty) {
                setDemoMode(!demoMode)
              }
            }}
            disabled={isRealDataEmpty}
            className={`transition-colors focus:outline-none ${isRealDataEmpty ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            title={isRealDataEmpty ? "Database is empty. Mock data is forced." : "Toggle demo data"}
          >
            {demoMode ? (
              <ToggleRight className="w-9 h-9 text-orange-600 dark:text-orange-500" />
            ) : (
              <ToggleLeft className="w-9 h-9 text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          SUPERADMIN DASHBOARD VIEW
          ---------------------------------------------------- */}
      {isSuperadmin && (
        <div className="space-y-8">

          {/* Superadmin Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">

            {/* Revenue Gold Gradient Card */}
            <Card className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 dark:from-zinc-900 dark:via-black dark:to-zinc-950 text-white border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-[1.01]">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-zinc-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-orange-500" /> Total Platform Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-end gap-2 pb-6">
                <div>
                  <div className="text-4xl font-extrabold tracking-tight text-white">
                    ${superadminMetrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> +14.2% increase this month
                  </p>
                </div>

                {/* SVG Revenue Sparkline */}
                <div className="w-[140px] h-[55px] opacity-85 hover:opacity-100 transition-opacity">
                  <svg className="w-full h-full" viewBox="0 0 300 80">
                    <defs>
                      <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M ${sparklinePoints} L 280,80 L 20,80 Z`}
                      fill="url(#sparkline-grad)"
                    />
                    <polyline
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sparklinePoints}
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Members registered</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">{superadminMetrics.totalUsers}</div>
                <p className="text-[10px] text-zinc-400 mt-1">Unique profiles across regions</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Active Branches</CardTitle>
                <MapPin className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">{superadminMetrics.totalBranches}</div>
                <p className="text-[10px] text-zinc-400 mt-1">Gym physical operations</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Staff Trainers</CardTitle>
                <UserCheck className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">{superadminMetrics.totalTrainers}</div>
                <p className="text-[10px] text-zinc-400 mt-1">Certified active coaches</p>
              </CardContent>
            </Card>
          </div>

          {/* Superadmin Audit Trail + Branch Breakdown */}
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Live Audit Trail Logs */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Database className="w-5 h-5 text-orange-500" /> Database Audit Log
                      </CardTitle>
                      <CardDescription className="text-xs">
                        System events recorded by PostgreSQL triggers.
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={logActionFilter}
                        onChange={(e) => setLogActionFilter(e.target.value)}
                        className="h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs px-2 focus:outline-none focus:ring-1 focus:ring-orange-600"
                      >
                        <option value="all">All Operations</option>
                        <option value="INSERT">INSERT</option>
                        <option value="UPDATE">UPDATE</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative mt-4 flex items-center">
                    <Search className="absolute left-2.5 text-zinc-400 h-3.5 w-3.5" />
                    <input
                      type="text"
                      placeholder="Search log user, table name, record ID..."
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      className="w-full h-8 bg-zinc-50 dark:bg-zinc-900 text-xs pl-8 pr-3 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-600"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800/50 pb-2 text-zinc-500">
                          <th className="py-2 font-semibold">User</th>
                          <th className="py-2 font-semibold">Operation</th>
                          <th className="py-2 font-semibold">Table</th>
                          <th className="py-2 font-semibold">Record ID</th>
                          <th className="py-2 font-semibold text-right">Timestamp</th>
                          <th className="py-2 font-semibold text-center">Inspect</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/30">
                        {superadminAuditLogs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-zinc-400 font-medium">
                              No log events found matching query.
                            </td>
                          </tr>
                        ) : (
                          superadminAuditLogs.map((log: any) => {
                            const actionColors: Record<string, string> = {
                              INSERT: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                              UPDATE: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                              DELETE: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                            }
                            return (
                              <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors">
                                <td className="py-2.5 font-bold text-zinc-800 dark:text-zinc-200">{log.user_name}</td>
                                <td className="py-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider ${actionColors[log.action] || "bg-zinc-100"}`}>
                                    {log.action}
                                  </span>
                                </td>
                                <td className="py-2.5 font-mono text-zinc-500">{log.table_name}</td>
                                <td className="py-2.5 text-zinc-600 dark:text-zinc-400 font-bold">#{log.record_id}</td>
                                <td className="py-2.5 text-right text-zinc-400">
                                  {mounted ? new Date(log.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--"}
                                </td>
                                <td className="py-2.5 text-center">
                                  <button
                                    onClick={() => setSelectedAuditLog(log)}
                                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
                                    title="View Record Payload"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Branches Breakdown */}
            <div className="lg:col-span-1">
              <Card className="h-full shadow-lg border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" /> Branch Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Staffing & enrollment statistics by branch.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {superadminBranches.map((branch: any) => {
                      const totalMembersBranch = branch.membersCount || 0
                      const totalTrainersBranch = branch.trainersCount || 0
                      return (
                        <div key={branch.id} className="space-y-2 border-b border-zinc-100 dark:border-zinc-800/30 pb-4 last:border-none last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50">{branch.name}</p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{branch.address}</p>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                              {branch.country?.name || "Global"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-1">
                            <div className="bg-zinc-50 dark:bg-zinc-950/50 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/20">
                              <span className="text-[10px] font-bold text-zinc-400 block uppercase">Members</span>
                              <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">{totalMembersBranch}</span>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-950/50 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/20">
                              <span className="text-[10px] font-bold text-zinc-400 block uppercase">Trainers</span>
                              <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100">{totalTrainersBranch}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          ADMIN DASHBOARD VIEW
          ---------------------------------------------------- */}
      {isAdmin && (
        <div className="space-y-8">

          {/* Admin Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Active Memberships</CardTitle>
                <Activity className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">{adminMetrics.activeMemberships}</div>
                <p className="text-[10px] text-zinc-400 mt-1">Paid and currently unexpired memberships</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Members</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">{adminMetrics.totalMembers}</div>
                <p className="text-[10px] text-zinc-400 mt-1">User profiles in database</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Gym Branches</CardTitle>
                <MapPin className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">{adminMetrics.totalBranches}</div>
                <p className="text-[10px] text-zinc-400 mt-1">Operational hubs</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Staff Trainers</CardTitle>
                <Award className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">{adminMetrics.totalTrainers}</div>
                <p className="text-[10px] text-zinc-400 mt-1">Coaches across branches</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Schedule Bookings & Trainers List */}
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" /> Live Class Bookings
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Latest student reservations across branches.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800/50 pb-2 text-zinc-500">
                          <th className="py-2 font-semibold">User</th>
                          <th className="py-2 font-semibold">Class / Activity</th>
                          <th className="py-2 font-semibold">Branch</th>
                          <th className="py-2 font-semibold">Class Date</th>
                          <th className="py-2 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/30">
                        {adminBookings.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-zinc-400 font-medium">
                              No recent booking reservations.
                            </td>
                          </tr>
                        ) : (
                          adminBookings.map((booking: any) => {
                            const isConfirmed = booking.status === "CONFIRMED"
                            return (
                              <tr key={booking.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors">
                                <td className="py-3 font-bold text-zinc-800 dark:text-zinc-200">{booking.user_name}</td>
                                <td className="py-3 font-semibold">{booking.slot?.activity?.name || "General Session"}</td>
                                <td className="py-3 text-zinc-500">{booking.slot?.branch?.name || "Main Club"}</td>
                                <td className="py-3 text-zinc-400">
                                  {booking.slot?.start_time && mounted ? new Date(booking.slot.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : (booking.slot?.start_time ? "..." : "N/A")}
                                </td>
                                <td className="py-3 text-right">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${isConfirmed
                                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                      : "bg-red-500/10 text-red-600 border-red-500/20"
                                    }`}>
                                    {booking.status}
                                  </span>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trainers directory widget */}
            <div className="lg:col-span-1">
              <Card className="h-full shadow-lg border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-orange-500" /> Trainer Roster
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Instructors and specializations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {adminTrainers.map((trainer: any) => (
                      <div key={trainer.id} className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/30 pb-3 last:border-none last:pb-0">
                        <div className="w-9 h-9 rounded-full bg-orange-600/10 text-orange-600 font-extrabold flex items-center justify-center text-xs uppercase border border-orange-600/10">
                          {trainer.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-zinc-900 dark:text-zinc-50 truncate">{trainer.name}</p>
                          <p className="text-[10px] text-zinc-400 truncate mt-0.5">{trainer.specialization}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded block whitespace-nowrap">
                            {trainer.branch?.name?.split(" ")[0] || "Global"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          TRAINER DASHBOARD VIEW
          ---------------------------------------------------- */}
      {isTrainer && (
        <div className="space-y-8">

          {/* Trainer Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Scheduled Classes</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">{trainerMetrics.totalSlots}</div>
                <p className="text-[10px] text-zinc-400 mt-1">Class slots assigned to you</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Bookings</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">{trainerMetrics.totalBookings}</div>
                <p className="text-[10px] text-zinc-400 mt-1">Total student reservations</p>
              </CardContent>
            </Card>

            {/* Specialization Badge */}
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Specialty Focus</CardTitle>
                <Trophy className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50 truncate mt-1">{trainerProfile.specialization}</div>
                <p className="text-[10px] text-zinc-400 mt-1">Branch: {trainerProfile.branch_name}</p>
              </CardContent>
            </Card>

            {/* Next class schedule card */}
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Next Class</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-extrabold text-zinc-950 dark:text-zinc-50 truncate mt-1">
                  {trainerSlots.length > 0 ? trainerSlots[0].activity?.name : "No upcoming classes"}
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  {trainerSlots.length > 0 ? (mounted ? new Date(trainerSlots[0].start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "...") : "Relax day"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trainer's Schedules & Students */}
          <div className="grid gap-8 lg:grid-cols-3">

            {/* Class Schedule Grid */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-orange-500" /> My Class Schedule
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Your scheduled classes and student capacity meters.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {trainerSlots.length === 0 ? (
                      <p className="text-center text-zinc-400 text-xs py-6">You have no slots scheduled yet.</p>
                    ) : (
                      trainerSlots.map((slot: any) => {
                        const filledPercent = Math.min(100, (slot.current_bookings / slot.max_capacity) * 100)
                        const isFull = slot.current_bookings >= slot.max_capacity
                        const progressColor = isFull ? "bg-red-500" : filledPercent >= 80 ? "bg-amber-500" : "bg-orange-500"
                        return (
                          <div key={slot.id} className="border border-zinc-100 dark:border-zinc-800/30 rounded-xl p-4 bg-zinc-50/50 dark:bg-zinc-950/20 hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50">{slot.activity?.name}</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{slot.activity?.description}</p>
                              </div>
                              <span className="text-[10px] font-black uppercase text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                                {slot.branch?.name}
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 gap-4 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/20">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                {mounted ? (
                                  <>
                                    {new Date(slot.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    {" "}({new Date(slot.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })})
                                  </>
                                ) : "..."}
                              </span>

                              <div className="w-full sm:w-[150px] space-y-1">
                                <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                                  <span>Enrollment</span>
                                  <span>{slot.current_bookings} / {slot.max_capacity}</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <div className={`h-full ${progressColor} transition-all duration-500`} style={{ width: `${filledPercent}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Roster */}
            <div className="lg:col-span-1">
              <Card className="h-full shadow-lg border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" /> Booked Students
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Roster profile summaries for slots you coach.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {trainerRoster.length === 0 ? (
                      <p className="text-center text-zinc-400 text-xs py-6">No students have booked your classes yet.</p>
                    ) : (
                      trainerRoster.map((rosterItem: any) => {
                        const userProfile = rosterItem.user || {}
                        const hasMetrics = userProfile.height || userProfile.weight
                        return (
                          <div key={rosterItem.id} className="border-b border-zinc-100 dark:border-zinc-800/30 pb-3 last:border-none last:pb-0 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-xs text-zinc-900 dark:text-zinc-50">{userProfile.full_name}</p>
                                <p className="text-[9px] text-zinc-400">{rosterItem.slot?.activity?.name || "Class Reservation"}</p>
                              </div>
                              <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                Age: {userProfile.age || "N/A"}
                              </span>
                            </div>

                            {hasMetrics && (
                              <div className="flex gap-4 text-[9px] text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 p-1.5 rounded border border-zinc-100 dark:border-zinc-800/20">
                                {userProfile.height && (
                                  <span><strong>Height:</strong> {userProfile.height} cm</span>
                                )}
                                {userProfile.weight && (
                                  <span><strong>Weight:</strong> {userProfile.weight} kg</span>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          AUDIT LOG payload INSPECTION MODAL (Drawer style overlay)
          ---------------------------------------------------- */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  <Database className="w-4 h-4 text-orange-500" /> System Audit Payload Inspection
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Record #{selectedAuditLog.record_id} in table <span className="font-mono text-zinc-500 font-bold">{selectedAuditLog.table_name}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">

              {/* Event Metadata Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/40">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase">Operator</span>
                  <span className="font-extrabold text-zinc-800 dark:text-zinc-100">{selectedAuditLog.user_name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase">Operation</span>
                  <span className="font-black text-orange-600 uppercase tracking-widest">{selectedAuditLog.action}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase">Table Name</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-300 font-semibold">{selectedAuditLog.table_name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 block uppercase">Timestamp</span>
                  <span className="text-zinc-500">
                    {mounted ? new Date(selectedAuditLog.created_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' }) : "..."}
                  </span>
                </div>
              </div>

              {/* JSON Payload Diff View */}
              <div className="grid gap-6 sm:grid-cols-2">

                {/* Old Data */}
                <div className="space-y-2">
                  <h4 className="font-bold text-zinc-500 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" /> Pre-Event state (OLD_DATA)
                  </h4>
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 rounded-xl p-4 font-mono overflow-auto max-h-[250px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {selectedAuditLog.old_data ? (
                      <pre className="text-[11px] whitespace-pre-wrap">{JSON.stringify(selectedAuditLog.old_data, null, 2)}</pre>
                    ) : (
                      <span className="text-zinc-400 italic block py-4 text-center">No previous record state (Newly inserted)</span>
                    )}
                  </div>
                </div>

                {/* New Data */}
                <div className="space-y-2">
                  <h4 className="font-bold text-zinc-500 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Post-Event state (NEW_DATA)
                  </h4>
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 rounded-xl p-4 font-mono overflow-auto max-h-[250px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {selectedAuditLog.new_data ? (
                      <pre className="text-[11px] whitespace-pre-wrap text-emerald-600 dark:text-emerald-400">{JSON.stringify(selectedAuditLog.new_data, null, 2)}</pre>
                    ) : (
                      <span className="text-red-500 dark:text-red-400 italic block py-4 text-center">Record destroyed (Deleted)</span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-end">
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-lg hover:opacity-90 transition-all text-xs"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

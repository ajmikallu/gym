"use client"

import { useMemo, useState } from "react"
import { Search, Award, ShieldAlert, UserCheck, Users } from "lucide-react"

interface UserTableClientProps {
  initialUsers: any[]
}

const ROLE_ICONS: Record<string, any> = {
  superadmin: ShieldAlert,
  admin: Award,
  trainer: UserCheck,
  customer: Users,
}

export function UserTableClient({ initialUsers }: UserTableClientProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const assignedRole = user.app_metadata?.assigned_role || "customer"
      const matchesRole = roleFilter === "all" || assignedRole === roleFilter

      const fullName = (user.user_metadata?.full_name || "").toLowerCase()
      const email = (user.email || "").toLowerCase()
      const searchLower = search.toLowerCase()
      const matchesSearch = fullName.includes(searchLower) || email.includes(searchLower)

      return matchesRole && matchesSearch
    })
  }, [initialUsers, roleFilter, search])

  return (
    <div className="space-y-4">
      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm flex items-center">
          <Search className="absolute left-3 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap">Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="flex h-10 w-[160px] items-center justify-between rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-600"
          >
            <option value="all">All Roles</option>
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
            <option value="trainer">Trainer</option>
            <option value="customer">Customer</option>
          </select>
        </div>
      </div>

      {/* Dynamic Count Display */}
      <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pl-1">
        Showing {filteredUsers.length} of {initialUsers.length} Users
      </div>

      {/* Users Table */}
      <div className="relative w-full overflow-auto rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <table className="w-full caption-bottom text-sm bg-white dark:bg-zinc-900">
          <thead className="[&_tr]:border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-semibold text-zinc-500 dark:text-zinc-400">Name</th>
              <th className="h-12 px-4 text-left align-middle font-semibold text-zinc-500 dark:text-zinc-400">Email</th>
              <th className="h-12 px-4 text-left align-middle font-semibold text-zinc-500 dark:text-zinc-400">Role</th>
              <th className="h-12 px-4 text-left align-middle font-semibold text-zinc-500 dark:text-zinc-400">Created At</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0 divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="h-24 text-center text-zinc-400 dark:text-zinc-500 font-medium">
                  No users match your criteria.
                </td>
              </tr>
            )}
            {filteredUsers.map((user) => {
              const role = user.app_metadata?.assigned_role || "customer"
              const RoleIcon = ROLE_ICONS[role] || Users

              return (
                <tr key={user.id} className="border-b transition-all duration-200 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30">
                  <td className="p-4 align-middle font-semibold text-zinc-900 dark:text-zinc-100">
                    {user.user_metadata?.full_name || "N/A"}
                  </td>
                  <td className="p-4 align-middle text-zinc-600 dark:text-zinc-300">
                    {user.email}
                  </td>
                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-600/10 bg-orange-600/5 px-2.5 py-1 text-xs font-bold text-orange-600 transition-colors uppercase tracking-wider">
                      <RoleIcon className="w-3.5 h-3.5" />
                      {role}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-zinc-400 dark:text-zinc-500 font-medium">
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

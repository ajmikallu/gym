"use client"

import { LayoutDashboard, Users, Dumbbell, Settings, User2, ChevronUp, MapPin, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/app/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import Link from "next/link"
import { logout } from "@/app/(auth)/actions"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users & Members",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Branches",
    url: "/admin/branches",
    icon: MapPin,
  },
  {
    title: "Activities & Pricing",
    url: "/admin/exercises",
    icon: Dumbbell,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

/**
 * AdminSidebar Component
 * 
 * Renders the main collapsible sidebar navigation for administrative users.
 * Includes quick links to the admin dashboard, user management, class management, and settings.
 * 
 * @returns {JSX.Element} The rendered Sidebar component
 */
export function AdminSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-xs font-bold text-zinc-500 mb-2 mt-4">Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<Link href={item.url} />}>
                    <item.icon className="w-5 h-5 mr-2" />
                    <span className="font-medium text-base">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="mb-2">
            <SidebarMenuButton render={<Link href="/dashboard" />} className="h-11 border border-orange-200 dark:border-orange-950 bg-orange-600/10 hover:bg-orange-600/20 text-orange-600 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 dark:text-orange-400 font-bold transition-all">
              <User className="w-5 h-5 mr-2" />
              <span className="truncate flex-1 text-left">Switch to User View</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <SidebarMenuButton className="h-12 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" />
              }>
                <User2 className="w-5 h-5 mr-2" />
                <span className="font-semibold text-sm truncate flex-1 text-left">Admin Account</span>
                <ChevronUp className="ml-auto w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <form action={logout}>
                  <DropdownMenuItem render={
                    <button type="submit" className="w-full text-left text-red-600 font-medium">
                      Sign out
                    </button>
                  } />
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

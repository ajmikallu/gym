"use client"

import { useMemo } from "react"
import { Calendar, Home, Inbox, Search, Settings, Dumbbell, User2, ChevronUp, Award, LayoutDashboard } from "lucide-react"
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

/**
 * AppSidebar Component
 * 
 * Renders the main collapsible sidebar navigation for authenticated users.
 * Includes quick links to the dashboard, workouts, schedule, inbox, and settings.
 * Also features a user dropdown menu at the bottom for profile management and logging out.
 * 
 * @returns {JSX.Element} The rendered Sidebar component
 */
export function AppSidebar({ role = "customer" }: { role?: string }) {
  const items = useMemo(() => {
    const baseItems = [
      {
        title: "Overview",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ]

    // Only expose Membership to customers
    if (role === "customer") {
      baseItems.push({
        title: "Membership",
        url: "/dashboard/membership",
        icon: Award,
      })
    }

    baseItems.push({
      title: "Settings",
      url: "/settings",
      icon: Settings,
    })

    return baseItems
  }, [role])

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-xs font-bold text-zinc-500 mb-2 mt-4">ApexFit Panel</SidebarGroupLabel>
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
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <SidebarMenuButton className="h-12 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <User2 className="w-5 h-5 mr-2" />
                  <span className="font-semibold text-sm truncate flex-1 text-left">My Account</span>
                  <ChevronUp className="ml-auto w-4 h-4" />
                </SidebarMenuButton>
              } />
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem render={<Link href="/user/profile">Account Profile</Link>} />
                <DropdownMenuItem render={<Link href="/settings">Billing</Link>} />
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

import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { AdminSidebar } from "@/app/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // 1. Always fetch the user securely from the server
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Extract role from user app_metadata (populated securely by Supabase server-side)
  // This avoids manually decoding the JWT in your layout again
  const role = user.app_metadata?.assigned_role;

  const allowedRoles = ["ADMIN", "SUPERADMIN", "TRAINER", "BLOGGER"];

  if (!role || typeof role !== 'string' || !allowedRoles.includes(role.toUpperCase())) {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex flex-col">
        <div className="flex items-center h-14 border-b border-zinc-200 dark:border-zinc-800 px-4 bg-white dark:bg-zinc-900 shrink-0">
          <SidebarTrigger />
        </div>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
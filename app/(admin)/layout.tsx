import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { AdminSidebar } from "@/app/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Authentication Check
  if (!user) {
    redirect("/login");
  }

  // Authorization Check using Custom Claims in JWT
  const { data: { session } } = await supabase.auth.getSession();
  
  let role = null;
  if (session?.access_token) {
    try {
      const payload = JSON.parse(Buffer.from(session.access_token.split('.')[1], 'base64').toString());
      role = payload.user_role || payload.app_metadata?.user_role;
    } catch (e) {
      // Ignore token parse error
    }
  }

  const allowedRoles = ["ADMIN", "SUPERADMIN", "TRAINER", "BLOGGER"];
  if (!role || typeof role !== 'string' || !allowedRoles.includes(role.toUpperCase())) {
    // Redirect normal customers back to their dashboard
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
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/user/app-sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = user?.app_metadata?.assigned_role || user?.role || "customer";

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
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
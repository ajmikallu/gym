import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { createClient } from "@/app/lib/supabase/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
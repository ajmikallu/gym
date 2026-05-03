import Image from "next/image";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-zinc-50 dark:bg-zinc-950">
      {/* Left side: Image/Branding (Hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden">
        <Image
          src="/images/auth/bg.png"
          alt="Gym environment"
          fill
          className="object-cover opacity-80"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80" />
        
        {/* Branding overlay */}
        <Link href="/" className="absolute top-10 left-12 flex items-center gap-2 hover:opacity-80 transition-opacity z-10">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
            <Dumbbell className="w-6 h-6" />
          </div>
          <span className="text-white text-2xl font-black italic tracking-tighter uppercase">ApexFit</span>
        </Link>

        <div className="absolute bottom-16 left-12 max-w-md z-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Push your limits. <br />
            Define your legacy.
          </h2>
          <p className="text-zinc-300 text-lg">
            Join the elite community of athletes dedicated to continuous improvement.
          </p>
        </div>
      </div>

      {/* Right side: Auth forms */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 relative">
        {/* Mobile Logo (Visible only on small screens) */}
        <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-zinc-900 dark:text-white text-xl font-black italic tracking-tighter uppercase">ApexFit</span>
        </Link>
        
        <div className="w-full max-w-md mt-12 lg:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
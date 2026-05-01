import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Trainers | ApexFit",
  description: "Meet the elite coaching staff at ApexFit.",
};

export default function TrainersPage() {
  const trainers = [
    {
      name: "Marcus Thorne",
      role: "Head Strength Coach",
      specialty: "Powerlifting & Hypertrophy",
      bio: "Former competitive powerlifter with over 10 years of coaching experience. Marcus specializes in helping athletes break through plateaus and build raw, functional strength.",
      image: "/images/about/about_3.jpg",
    },
    {
      name: "Sarah Jenkins",
      role: "Functional Performance Lead",
      specialty: "Mobility & Conditioning",
      bio: "Sarah combines biomechanics with high-intensity conditioning. Her programs are designed to keep athletes moving pain-free while performing at their absolute peak.",
      image: "/images/about/about_2.jpg", 
    },
    {
      name: "David Chen",
      role: "Nutrition Specialist",
      specialty: "Body Composition & Prep",
      bio: "A registered dietitian and competitive bodybuilder. David creates sustainable, science-based protocols that fuel performance and radically alter body composition.",
      image: "/images/about/about_1.jpg", 
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pb-24">
      {/* Header Banner */}
      <div className="w-full bg-zinc-900 py-16 md:py-24 border-b border-zinc-800">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white uppercase italic mb-4">
              Meet The <span className="text-orange-600">Coaches</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 font-medium">
              Elite standards demand elite leadership. Our coaching staff represents the pinnacle of fitness education and practical experience.
            </p>
          </div>
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {trainers.map((trainer, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl group">
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-1">{trainer.name}</h3>
                  <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest">{trainer.role}</p>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-widest rounded-full text-zinc-600 dark:text-zinc-300 mb-4">
                    {trainer.specialty}
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                    {trainer.bio}
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  <Link href="#" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-orange-600 hover:text-white transition-colors" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                  </Link>
                  <Link href="#" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-orange-600 hover:text-white transition-colors" aria-label="Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-orange-600 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white mb-4">Train with the best</h2>
            <p className="text-white/90 text-lg">Stop guessing. Get a scientifically backed training program and the accountability you need to finally hit your goals.</p>
          </div>
          <Link
            href="/consultation"
            className="relative z-10 inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 hover:bg-zinc-100 font-bold uppercase tracking-widest rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl shrink-0"
          >
            Book Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

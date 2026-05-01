import * as React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Our Story | ApexFit",
  description: "Learn about the history, mission, and core values of ApexFit.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-end pb-16 md:pb-24">
        <Image
          src="/images/about/about_1.jpg"
          alt="ApexFit Facility and Athletes"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-900/50 to-zinc-900/30 dark:from-zinc-950 dark:via-black/60 dark:to-black/30 transition-colors duration-500" />
        
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic mb-4 transition-colors duration-500">
              Our <span className="text-orange-600">Story</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-800 dark:text-zinc-300 font-medium max-w-2xl transition-colors duration-500">
              Forging elite fitness through science, community, and unrelenting dedication.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-bold uppercase tracking-tight mb-6">The Genesis of ApexFit</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors duration-500 mb-4">
                  ApexFit was founded on a simple premise: standard commercial gyms fail their members. We grew tired of seeing rows of unused treadmills, predatory contracts, and an environment that prioritized membership volume over actual results.
                </p>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors duration-500">
                  In 2020, we opened our doors with one goal—to build an elite training facility where every piece of equipment serves a purpose, and every member is treated like an athlete. Today, we are proud to host a community of dedicated individuals who push their limits every single day.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-6">Our Core Values</h2>
                <ul className="flex flex-col gap-4">
                  {[
                    "No Ego, Just Hard Work",
                    "Science-Backed Training Methods",
                    "Community Over Competition",
                    "Uncompromising Standards"
                  ].map((value, idx) => (
                    <li key={idx} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300">
                      <div className="w-10 h-10 rounded-full bg-orange-600/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-bold uppercase tracking-wider text-sm">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about/about_2.jpg"
                alt="Athletes training at ApexFit"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
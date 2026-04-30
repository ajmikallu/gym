import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PersonalTraining() {
  return (
    <section className="w-full py-24 bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 md:gap-16 lg:gap-12 items-center">

          {/* Left Side: Text Panel */}
          <div className="flex flex-col justify-center order-2 lg:order-1 relative z-10 lg:col-span-5">
            <div className="bg-gray-50 dark:bg-zinc-900 pt-16 pb-6 px-6 md:p-8 lg:p-8 rounded-3xl shadow-none dark:shadow-xl md:shadow-xl border border-gray-200 dark:border-white/10 transition-colors duration-500">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic mb-4 leading-tight transition-colors duration-500">
                Apex Personal Training: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">Unlock Your Elite Potential</span>
              </h2>

              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-medium transition-colors duration-500">
                Transform your physique and elevate your performance with our world-class personal training. We don't just count reps; we engineer complete athletic transformations.
              </p>

              <Link
                href="/consultation"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-orange-600 hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 rounded-sm uppercase tracking-wider shadow-lg shadow-orange-600/30"
              >
                Schedule Your Free Consultation
              </Link>
            </div>
          </div>

          {/* Right Side: Artistic Composition */}
          <div className="relative order-1 lg:order-2 w-full pt-0 md:pt-12 md:pb-20 lg:py-0 flex justify-center md:justify-end lg:col-span-7 -mb-12 md:mb-0 z-20">

            {/* Main Background Image (Deadlift) */}
            <div className="hidden md:block relative w-full aspect-square rounded-3xl overflow-hidden  z-10">
              <Image
                src="/images/home/deadlift.png"
                alt="Trainer guiding client on deadlift form"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center hover:scale-105 transition-transform duration-1000 ease-in-out"
                quality={95}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-black/50 via-transparent to-transparent transition-colors duration-500" />
            </div>

            {/* Overlapping Image (Box Jump) */}
            <div className="relative md:absolute md:-bottom-8 lg:-bottom-16 md:-left-4 lg:-left-16 w-full md:w-[45%] lg:w-[45%] aspect-[4/5] md:aspect-[9/16] rounded-t-3xl rounded-b-none md:rounded-b-3xl overflow-hidden shadow-2xl border-0 md:border-4 border-white dark:border-zinc-950 transition-colors duration-500 z-20 group">
              <Image
                src="/images/home/boxjump.png"
                alt="Female athlete performing explosive box jump"
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                quality={95}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-black/80 via-white/10 dark:via-black/10 to-transparent opacity-70 transition-colors duration-500" />
              {/* Mobile merging fade */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50 dark:from-zinc-900 to-transparent md:hidden transition-colors duration-500 pointer-events-none" />
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}

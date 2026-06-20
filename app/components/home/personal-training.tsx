"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PersonalTraining() {
  const [isVisible, setIsVisible] = useState(false);
  const [compositionMouse, setCompositionMouse] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const compositionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compositionRef.current) return;
    const rect = compositionRef.current.getBoundingClientRect();
    // Calculate percentage offset from center (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCompositionMouse({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCompositionMouse({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 bg-white dark:bg-black transition-colors duration-700 overflow-hidden"
    >
      {/* Scoped CSS Keyframes for self-contained animations */}
      <style jsx>{`
        @keyframes shine-sweep {
          0% { transform: skewX(-20deg) translateX(-150%); }
          50% { transform: skewX(-20deg) translateX(250%); }
          100% { transform: skewX(-20deg) translateX(250%); }
        }
      `}</style>

      {/* Subtle ambient gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 dark:bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Side: Text Panel */}
          <div 
            className={`flex flex-col justify-center order-2 lg:order-1 lg:col-span-5 transition-all duration-1000 transform ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <div className="bg-zinc-50 dark:bg-zinc-900/40 pt-16 pb-10 px-6 md:p-12 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg shadow-zinc-100/50 dark:shadow-none transition-colors duration-500 relative overflow-hidden group/panel">
              
              {/* Soft glow indicator at the top corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full pointer-events-none" />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-500 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                1-on-1 Coaching
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic mb-6 leading-tight transition-colors duration-500">
                Apex Personal Training: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-600">
                  Unlock Your Elite Potential
                </span>
              </h2>

              <p className="text-base md:text-lg text-gray-600 dark:text-zinc-400 mb-8 leading-relaxed font-light transition-colors duration-500">
                Transform your physique and elevate your performance with our world-class personal training. We don't just count reps; we engineer complete athletic transformations.
              </p>

              <div className="relative group/btn overflow-hidden inline-flex">
                <Link
                  href="/consultation"
                  className="relative overflow-hidden inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-orange-600 hover:bg-orange-700 hover:-translate-y-0.5 transition-all duration-300 rounded-sm uppercase tracking-wider shadow-lg shadow-orange-600/30 dark:shadow-orange-600/10"
                >
                  Schedule Your Free Consultation
                  {/* Button Reflection Sweep */}
                  <span 
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                    style={{
                      animation: "shine-sweep 3s infinite ease-in-out"
                    }}
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Artistic Composition */}
          <div 
            ref={compositionRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className={`relative order-1 lg:order-2 w-full pt-6 pb-16 md:py-16 lg:py-0 flex justify-center md:justify-end lg:col-span-7 z-20 transition-all duration-1000 delay-200 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
          >
            {/* Main Background Image (Deadlift) */}
            <div 
              className="hidden md:block relative w-full aspect-square rounded-3xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800 z-10"
              style={{
                transform: `translate3d(${compositionMouse.x * 20}px, ${compositionMouse.y * 20}px, 0)`,
                transition: isHovered ? "transform 0.08s ease-out" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <Image
                src="/images/home/deadlift.png"
                alt="Trainer guiding client on deadlift form"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center scale-105 group-hover/comp:scale-108 transition-all duration-1000 ease-out"
                quality={95}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Overlapping Image (Box Jump) */}
            <div 
              className="relative md:absolute md:-bottom-8 lg:-bottom-12 md:-left-4 lg:-left-12 w-full md:w-[46%] lg:w-[46%] aspect-[4/5] md:aspect-[9/16] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-950 transition-colors duration-500 z-20 group"
              style={{
                transform: `translate3d(${compositionMouse.x * -25}px, ${compositionMouse.y * -25}px, 0)`,
                transition: isHovered ? "transform 0.08s ease-out" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <Image
                src="/images/home/boxjump.png"
                alt="Female athlete performing explosive box jump"
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover object-center group-hover:scale-108 transition-transform duration-1000 ease-out"
                quality={95}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 dark:from-black/70 via-white/5 dark:via-black/5 to-transparent opacity-80 pointer-events-none" />
              
              {/* Mobile merging fade */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent md:hidden transition-colors duration-500 pointer-events-none" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

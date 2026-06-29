"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BoxingSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [absMousePos, setAbsMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    
    // Absolute position within section for spotlight
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    setAbsMousePos({ x: relativeX, y: relativeY });
    
    // Percentage position from center (-0.5 to 0.5) for parallax shift
    const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
    const yPercent = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: xPercent, y: yPercent });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const headerWords = ["Elite", "Boxing", "Club"];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full py-28 bg-zinc-950 text-white overflow-hidden"
    >
      {/* Scoped CSS Keyframe animation for CTA shine */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine-sweep-red {
          0% { transform: skewX(-20deg) translateX(-150%); }
          50% { transform: skewX(-20deg) translateX(250%); }
          100% { transform: skewX(-20deg) translateX(250%); }
        }
      `}} />

      {/* Dynamic Background Image with Smooth Parallax */}
      <div 
        className="absolute inset-0 z-0 scale-108"
        style={{
          transform: `scale(1.08) translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Image
          src="/images/home/boxing-hero.png"
          alt="Boxer hitting a heavy bag"
          fill
          className="object-cover object-center opacity-30 mix-blend-overlay"
          quality={100}
          priority
        />
      </div>

      {/* Left to right dark transition overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-10" />

      {/* Interactive mouse spotlight glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
        style={{
          background: `radial-gradient(800px circle at ${absMousePos.x}px ${absMousePos.y}px, rgba(220, 38, 38, 0.045), transparent 75%)`,
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content panel with slide entrance reveal */}
          <div 
            className={`flex flex-col justify-center transition-all duration-1000 transform ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Heavy Bag & Ring Training
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter uppercase italic mb-6 leading-tight flex flex-wrap gap-x-3">
              {headerWords.map((word, i) => (
                <span
                  key={i}
                  className={`inline-block transition-all duration-750 transform ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {word === "Club" ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 dark:from-red-400 dark:to-red-600">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </span>
              ))}
            </h2>

            <p className={`text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed font-light transition-all duration-1000 delay-400 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}>
              Step into the ring and experience high-intensity boxing training. Whether you are a beginner learning the basics or an advanced fighter honing your technique, our expert coaches will push you to your limits. Build power, speed, and unstoppable endurance.
            </p>

            <div 
              className={`transition-all duration-1000 delay-500 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <Link
                href="/boxing"
                className="relative overflow-hidden inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-red-600 hover:bg-red-700 hover:-translate-y-0.5 transition-all duration-300 rounded-sm uppercase tracking-wider shadow-lg shadow-red-600/30 dark:shadow-red-600/10"
              >
                Explore Boxing Programs
                {/* Sweep reflection */}
                <span 
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                  style={{
                    animation: "shine-sweep-red 3.2s infinite ease-in-out"
                  }}
                />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

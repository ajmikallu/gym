"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Target, Eye, Flame } from "lucide-react";

// Sub-component for individual card logic (tilt, spotlight, magnet)
interface CardProps {
  index: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  delayClass: string;
  isVisible: boolean;
}

function MissionVisionCard({ index, icon, title, description, delayClass, isVisible }: CardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate center point of the card
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Rotate card max 10 degrees based on offset
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setMousePos({ x, y });
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.03, 1.03, 1.03)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.4s, box-shadow 0.4s",
      }}
      className={`group relative p-8 md:p-10 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-red-500/40 dark:hover:border-red-500/40 shadow-sm hover:shadow-2xl hover:shadow-red-500/5 flex flex-col justify-between overflow-hidden ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      } ${delayClass}`}
    >
      {/* Cursor spotlight effect overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(220, 38, 38, 0.08), transparent 80%)`,
        }}
      />

      {/* Decorative Corner Ambient Glow */}
      <div className="absolute -right-24 -top-24 w-48 h-48 bg-gradient-to-br from-red-600/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          {/* Magnetic Icon Container */}
          <div
            className="w-14 h-14 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl flex items-center justify-center shadow-md group-hover:border-red-500/30 transition-all duration-300"
            style={{
              transform: isHovered
                ? `translate3d(${(mousePos.x - 56) * 0.1}px, ${(mousePos.y - 56) * 0.1}px, 0)`
                : "translate3d(0,0,0)",
              transition: isHovered ? "transform 0.05s ease-out" : "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
            }}
          >
            <span className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] transition-all duration-300">
              {icon}
            </span>
          </div>

          <span className="text-sm font-mono font-extrabold text-zinc-400 dark:text-zinc-700 select-none">
            {index}
          </span>
        </div>

        <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-wider mb-4 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base font-normal group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Slide-under border highlight line */}
      <div className="w-0 group-hover:w-full h-[3px] bg-red-600 dark:bg-red-500 absolute bottom-0 left-0 transition-all duration-500 rounded-b-2xl" />
    </div>
  );
}

export default function MissionVision() {
  const [isVisible, setIsVisible] = useState(false);
  const [sectionMouse, setSectionMouse] = useState({ x: 0, y: 0 });
  const [isSectionHovered, setIsSectionHovered] = useState(false);
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

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setSectionMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const headerWords = ["Our", "Core", "Purpose"];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => setIsSectionHovered(false)}
      className="relative w-full py-28 bg-white dark:bg-black overflow-hidden transition-colors duration-700 group/section"
    >
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-red-600/5 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-zinc-400/5 dark:bg-zinc-800/15 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

      {/* Interactive mouse grid highlight effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover/section:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${sectionMouse.x}px ${sectionMouse.y}px, rgba(239, 68, 68, 0.035), transparent 75%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 z-10">

        {/* Header Block with staggered word-by-word reveal */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-500 text-xs font-bold uppercase tracking-widest mb-4 transition-all duration-700 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            ApexFit Philosophy
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic transition-colors duration-500 flex flex-wrap justify-center gap-x-4">
            {headerWords.map((word, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-700 transform ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {word === "Core" || word === "Purpose" ? (
                  <span className="text-red-600 dark:text-red-500">{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </h2>

          <div className={`w-20 h-1 bg-red-600 dark:bg-red-500 mx-auto my-6 rounded-full transition-all duration-1000 delay-400 transform ${
            isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          }`} />

          <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-1000 delay-500 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          } font-light leading-relaxed`}>
            We exist to help you unlock your highest potential. Discover the driving force behind everything we do.
          </p>
        </div>

        {/* Staggered Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <MissionVisionCard
            index="01"
            icon={<Target className="w-7 h-7 text-red-600 dark:text-red-500" />}
            title="Our Mission"
            description="To provide an elite training environment equipped with state-of-the-art facilities and world-class coaching, empowering individuals to achieve their ultimate fitness goals."
            delayClass="delay-100"
            isVisible={isVisible}
          />

          <MissionVisionCard
            index="02"
            icon={<Eye className="w-7 h-7 text-red-600 dark:text-red-500" />}
            title="Our Vision"
            description="To be the globally recognized benchmark for premium fitness, cultivating a community where relentless dedication meets unparalleled physical and mental transformation."
            delayClass="delay-300"
            isVisible={isVisible}
          />

          <MissionVisionCard
            index="03"
            icon={<Flame className="w-7 h-7 text-red-600 dark:text-red-500" />}
            title="Core Values"
            description="Discipline, innovation, resilience, and community. We believe in pushing boundaries, supporting one another, and never settling for average fitness standards."
            delayClass="delay-500"
            isVisible={isVisible}
          />

        </div>
      </div>
    </section>
  );
}

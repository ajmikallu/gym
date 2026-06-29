"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, Dumbbell, Apple } from "lucide-react";

// Sub-component to isolate mouse event state and prevent unnecessary parent re-renders
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  slug: string;
  index: number;
  isVisible: boolean;
}

function FeatureCard({ title, description, icon: Icon, image, slug, index, isVisible }: FeatureCardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const delayClass = index === 0 ? "delay-100" : index === 1 ? "delay-300" : "delay-500";

  return (
    <Link
      ref={cardRef}
      href={`/training/${slug}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-8px)" : "translateY(0px)",
        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s",
      }}
      className={`relative bg-white dark:bg-black/60 border border-gray-200/80 dark:border-zinc-850 rounded-2xl flex flex-col group hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-600/5 transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-orange-600 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      } ${delayClass}`}
    >
      {/* Radial spotlight follow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249, 115, 22, 0.08), transparent 80%)`,
        }}
      />

      <div className="relative w-full h-48 overflow-hidden">
        {/* Hardware-accelerated image scaling and translation parallax */}
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover scale-105 group-hover:scale-112 group-hover:-translate-y-1 transition-all duration-700 ease-out"
        />
        {/* Gradient backdrop layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-white/40 dark:via-black/40 to-transparent opacity-100 z-10" />
      </div>

      <div className="p-8 flex flex-col items-center text-center relative z-20 -mt-16">
        
        {/* Magnetic Badge - moves towards cursor on hover */}
        <div
          className="p-4 bg-white dark:bg-zinc-950 rounded-full mb-6 border border-gray-200/80 dark:border-zinc-800 group-hover:border-orange-500/30 group-hover:scale-110 shadow-lg transition-all"
          style={{
            transform: isHovered
              ? `translate3d(${(mousePos.x - 72) * 0.06}px, ${(mousePos.y - 72) * 0.06}px, 0)`
              : "translate3d(0,0,0)",
            transition: isHovered ? "transform 0.05s ease-out" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Icon className="w-8 h-8 text-orange-600 group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.5)] transition-all" />
        </div>

        <h3 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-sm group-hover:text-zinc-950 dark:group-hover:text-zinc-200 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Slide border line highlight */}
      <div className="w-0 group-hover:w-full h-[3px] bg-orange-600 dark:bg-orange-500 absolute bottom-0 left-0 transition-all duration-500" />
    </Link>
  );
}

export default function FeaturesPrograms() {
  const [isVisible, setIsVisible] = useState(false);
  const [sectionMouse, setSectionMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "Functional Movement",
      description: "Build a foundation of strength with movements that enhance your daily life and athletic performance.",
      icon: Activity,
      image: "/images/home/functional_movement.png",
      slug: "functional-movement"
    },
    {
      title: "Elite Coaching",
      description: "Train with industry-leading professionals who provide personalized guidance and unrelenting accountability.",
      icon: Dumbbell,
      image: "/images/home/elite_coaching.png",
      slug: "elite-coaching"
    },
    {
      title: "Nutritional Planning",
      description: "Fuel your body with customized macronutrient strategies designed to optimize recovery and results.",
      icon: Apple,
      image: "/images/home/nutrition_planning.png",
      slug: "nutrition-planning"
    },
  ];

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

  const headerWords = ["Our", "Core", "Pillars"];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="relative w-full py-28 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-900 transition-colors duration-700 group/section overflow-hidden"
    >
      {/* Decorative ambient blobs */}
      <div className="absolute top-1/3 right-1/12 w-80 h-80 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/12 w-80 h-80 bg-zinc-300/10 dark:bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />

      {/* Orange themed mouse grid glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover/section:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${sectionMouse.x}px ${sectionMouse.y}px, rgba(249, 115, 22, 0.025), transparent 75%)`,
        }}
      />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 z-10">
        
        {/* Header Block with staggered word reveal */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic transition-colors duration-500 flex flex-wrap justify-center gap-x-4">
            {headerWords.map((word, i) => (
              <span
                key={i}
                className={`inline-block transition-all duration-700 transform ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {word === "Pillars" ? (
                  <span className="text-orange-600 dark:text-orange-500">{word}</span>
                ) : (
                  word
                )}
              </span>
            ))}
          </h2>
          
          <div className={`w-20 h-1 bg-orange-600 dark:bg-orange-500 mx-auto my-6 rounded-full transition-all duration-1000 delay-400 transform ${
            isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
          }`} />

          <p className={`text-base md:text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto transition-all duration-1000 delay-500 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          } font-medium leading-relaxed`}>
            We don't believe in quick fixes. We build unbreakable bodies through a systematic approach to training, coaching, and nutrition.
          </p>
        </div>

        {/* Staggered features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              image={feature.image}
              slug={feature.slug}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

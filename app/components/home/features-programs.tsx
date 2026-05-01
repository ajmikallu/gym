import * as React from "react";
import Image from "next/image";
import { Activity, Dumbbell, Apple } from "lucide-react";

export default function FeaturesPrograms() {
  const features = [
    {
      title: "Functional Movement",
      description: "Build a foundation of strength with movements that enhance your daily life and athletic performance.",
      icon: Activity,
      image: "/images/home/functional_movement.png"
    },
    {
      title: "Elite Coaching",
      description: "Train with industry-leading professionals who provide personalized guidance and unrelenting accountability.",
      icon: Dumbbell,
      image: "/images/home/elite_coaching.png"
    },
    {
      title: "Nutritional Planning",
      description: "Fuel your body with customized macronutrient strategies designed to optimize recovery and results.",
      icon: Apple,
      image: "/images/home/nutrition_planning.png"
    },
  ];

  return (
    <section className="w-full py-24 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic mb-4 transition-colors duration-500">
            Our <span className="text-orange-600">Core Pillars</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium transition-colors duration-500">
            We don't believe in quick fixes. We build unbreakable bodies through a systematic approach to training, coaching, and nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white dark:bg-black/60 border border-gray-200 dark:border-zinc-800 rounded-2xl flex flex-col group hover:-translate-y-2 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-600/10 transition-all duration-300 overflow-hidden"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image 
                    src={feature.image} 
                    alt={feature.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black to-transparent opacity-90" />
                </div>
                <div className="p-8 flex flex-col items-center text-center relative z-10 -mt-16">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-200 dark:border-zinc-800 group-hover:border-orange-500/50 shadow-lg">
                    <Icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-black dark:text-white uppercase tracking-wider mb-3 transition-colors duration-500">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-zinc-400 leading-relaxed transition-colors duration-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

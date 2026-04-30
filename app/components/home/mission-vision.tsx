import * as React from "react";
import { Target, Eye, Flame } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="w-full py-24 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic mb-4 transition-colors duration-500">
            Our <span className="text-red-600">Core</span> Purpose
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-500">
            We exist to help you unlock your highest potential. Discover the driving force behind everything we do at ApexFit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="p-8 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 hover:border-red-600 dark:hover:border-red-600 transition-all duration-300 group">
            <div className="w-14 h-14 bg-red-600/10 dark:bg-red-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white uppercase tracking-wide mb-3 transition-colors duration-500">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-500">
              To provide an elite training environment equipped with state-of-the-art facilities and world-class coaching, empowering individuals to achieve their ultimate fitness goals.
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 hover:border-red-600 dark:hover:border-red-600 transition-all duration-300 group">
            <div className="w-14 h-14 bg-red-600/10 dark:bg-red-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Eye className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white uppercase tracking-wide mb-3 transition-colors duration-500">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-500">
              To be the globally recognized benchmark for premium fitness, cultivating a community where relentless dedication meets unparalleled physical and mental transformation.
            </p>
          </div>

          {/* Values */}
          <div className="p-8 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/10 hover:border-red-600 dark:hover:border-red-600 transition-all duration-300 group">
            <div className="w-14 h-14 bg-red-600/10 dark:bg-red-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Flame className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white uppercase tracking-wide mb-3 transition-colors duration-500">Core Values</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-500">
              Discipline, innovation, resilience, and community. We believe in pushing boundaries, supporting one another, and never settling for average.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BoxingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home/boxing-hero.png"
            alt="Boxing Training"
            fill
            className="object-cover object-center opacity-60"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </div>
        
        <div className="relative z-10 text-center px-6 mt-20">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
            Boxing <span className="text-red-600">Academy</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-medium">
            Master the sweet science. Train like a champion, build unshakeable confidence, and get in the best shape of your life.
          </p>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold uppercase italic mb-6">
              Why Box With Us?
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              Our boxing programs are designed for all levels, from absolute beginners to competitive fighters. You&apos;ll learn proper technique, footwork, and combinations from experienced coaches who have stepped in the ring themselves.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300 text-lg">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-4"></span>
                High-intensity cardio & strength conditioning
              </li>
              <li className="flex items-center text-gray-300 text-lg">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-4"></span>
                Real technique & tactical training
              </li>
              <li className="flex items-center text-gray-300 text-lg">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-4"></span>
                Stress relief & mental toughness
              </li>
              <li className="flex items-center text-gray-300 text-lg">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-4"></span>
                Supportive & motivating community
              </li>
            </ul>
            <Link
              href="/consultation"
              className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 rounded-sm uppercase tracking-wider shadow-lg shadow-red-600/30"
            >
              Start Free Trial
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-900 group">
                <Image
                  src={`/images/home/boxing_${num}.jpg`}
                  alt={`Boxing Training ${num}`}
                  fill
                  className="object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

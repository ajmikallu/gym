import * as React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BoxingSection() {
  return (
    <section className="w-full py-24 bg-zinc-950 text-white overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/boxing-hero.png"
          alt="Boxer hitting a heavy bag"
          fill
          className="object-cover object-center opacity-40 mix-blend-overlay"
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter uppercase italic mb-6 leading-tight">
              Elite Boxing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Club</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-medium">
              Step into the ring and experience high-intensity boxing training. Whether you are a beginner learning the basics or an advanced fighter honing your technique, our expert coaches will push you to your limits. Build power, speed, and unstoppable endurance.
            </p>

            <div>
              <Link
                href="/boxing"
                className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-red-600 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 rounded-sm uppercase tracking-wider shadow-lg shadow-red-600/30"
              >
                Explore Boxing Programs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

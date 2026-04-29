"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface HeroBannerProps {
  imageIndex?: number;
}

export default function HeroBanner({ imageIndex = 1 }: HeroBannerProps) {
  // Fix: Ensure index is always a valid number within your 1-7 range
  const safeIndex = Math.min(Math.max(imageIndex, 1), 7);

  // Define the available images (1 through 7)
  const images = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <section className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden group bg-zinc-900">
      <Carousel
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        className="w-full h-full"
        opts={{
          loop: true,
          startIndex: safeIndex - 1,
        }}
      >
        <CarouselContent className="h-full -ml-0">
          {images.map((index) => (
            <CarouselItem key={index} className="relative w-full h-[60vh] md:h-[85vh] pl-0">
              {/* Background Image */}
              <Image
                src={`/images/hero/hero-banner-${index}.png`}
                alt={`Premium gym environment with modern equipment - Slide ${index}`}
                fill
                priority={index === safeIndex} // Ensure the initial slide loads immediately
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1920px) 100vw, 2560px"
                className="object-cover object-center transition-transform duration-1000 ease-in-out group-hover:scale-105"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full text-white pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 uppercase italic">
            Elevate Your <span className="text-red-600">Performance</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl font-medium leading-relaxed">
            Experience world-class equipment, elite coaching, and a driven community that pushes you beyond your limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex justify-center items-center px-10 py-4 text-base font-bold text-white bg-red-600 hover:bg-red-700 transition-all rounded-sm uppercase tracking-wider"
            >
              Start Free Trial
            </Link>
            <Link
              href="/about"
              className="inline-flex justify-center items-center px-10 py-4 text-base font-bold text-white bg-transparent border-2 border-white hover:bg-white hover:text-black transition-all rounded-sm uppercase tracking-wider"
            >
              Our Memberships
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
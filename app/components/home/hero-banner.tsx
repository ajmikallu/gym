import Image from "next/image";
import Link from "next/link";

interface HeroBannerProps {
  imageIndex?: number;
}

export default function HeroBanner({ imageIndex = 1 }: HeroBannerProps) {
  // Fix: Ensure index is always a valid number within your 1-7 range
  const safeIndex = Math.min(Math.max(imageIndex, 1), 7);
  const imagePath = `/images/hero/hero-banner-${safeIndex}.png`;

  return (
    <section className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden group bg-zinc-900">
      {/* Background Image */}
      <Image
        src={imagePath}
        alt="Premium gym environment with modern equipment"
        fill
        priority // Fix: Ensures this loads immediately for LCP
        quality={90}
        // Fix: Added 2560px cap for large monitors
        sizes="(max-width: 768px) 100vw, (max-width: 1920px) 100vw, 2560px"
        className="object-cover object-[25%_center] transition-transform duration-1000 ease-in-out group-hover:scale-105"
      />

      {/* Fix: Slightly darker gradient for better white text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full text-white">
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
    </section>
  );
}
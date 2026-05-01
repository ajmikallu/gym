import * as React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Our Facility | ApexFit",
  description: "Tour the world-class ApexFit training facility.",
};

export default function FacilityPage() {
  const amenities = [
    {
      title: "Elite Strength Equipment",
      description: "Competition-grade barbells, calibrated plates, and specialized machines.",
    },
    {
      title: "Functional Turf Area",
      description: "A 50-yard indoor turf for sprints, sled pushes, and agility work.",
    },
    {
      title: "Recovery Zone",
      description: "Cold plunges, infrared saunas, and percussion therapy tools available.",
    },
    {
      title: "Cardio Suite",
      description: "High-end self-powered treadmills, assault bikes, and rowing ergometers.",
    },
    {
      title: "Private Showers & Lockers",
      description: "Premium locker rooms with complimentary towel service.",
    },
    {
      title: "Nutrition Bar",
      description: "On-site protein shakes, pre-workouts, and healthy meal preps.",
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500 pb-24">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-end pb-16 md:pb-24">
        <Image
          src="/images/about/about_4.jpg"
          alt="ApexFit Facility Overview"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-900/50 to-zinc-900/30 dark:from-zinc-950 dark:via-black/60 dark:to-black/30 transition-colors duration-500" />
        
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic mb-4 transition-colors duration-500">
              The <span className="text-orange-600">Facility</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-800 dark:text-zinc-300 font-medium max-w-2xl transition-colors duration-500">
              A 10,000 sq ft playground for the dedicated. Engineered for performance.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-16 md:py-24">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-3xl font-bold uppercase tracking-tight mb-6">World-Class Equipment</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed transition-colors duration-500 mb-8">
                  We don't do gimmicks. Our facility is outfitted exclusively with equipment that has been proven to drive results. Whether you're a competitive powerlifter, a functional athlete, or someone just starting their fitness journey, you'll find exactly what you need here.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {amenities.map((amenity, idx) => (
                  <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-orange-500/50 transition-colors duration-300">
                    <CheckCircle2 className="w-6 h-6 text-orange-600 mb-4" />
                    <h3 className="text-lg font-bold uppercase tracking-wider mb-2">{amenity.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{amenity.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/about_1.jpg"
                  alt="Strength training area"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/about_3.jpg"
                  alt="Functional training zone"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 mb-12">
        <div className="bg-zinc-900 text-white p-12 md:p-16 rounded-3xl text-center flex flex-col items-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-6">Experience It Yourself</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mb-10">Stop by for a tour of the facility and see the difference a premium training environment makes.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-orange-600 hover:bg-orange-700 transition-all duration-300 rounded-lg uppercase tracking-wider shadow-lg shadow-orange-600/30"
            >
              Join Now
            </Link>
            <Link
              href="/consultation"
              className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-transparent border-2 border-white hover:bg-white hover:text-black transition-all duration-300 rounded-lg uppercase tracking-wider"
            >
              Book a Tour
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}

import * as React from "react";
import Link from "next/link";
import { Dumbbell, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-950 text-zinc-400 border-t border-zinc-800">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 py-16 lg:py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Dumbbell className="h-8 w-8 text-orange-500 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                Apex<span className="text-orange-500">Fit</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Forging elite fitness through science-backed training, expert coaching, and an uncompromising commitment to your results.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-orange-600 hover:text-white transition-colors duration-300" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </Link>
              <Link href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-orange-600 hover:text-white transition-colors duration-300" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Link>
              <Link href="#" className="p-2 bg-zinc-900 rounded-full hover:bg-orange-600 hover:text-white transition-colors duration-300" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Link>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">Home</Link></li>
              <li><Link href="/about" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">About Us</Link></li>
              <li><Link href="/classes" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">Classes</Link></li>
              <li><Link href="/trainers" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">Trainers</Link></li>
              <li><Link href="/blog" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm">Our Services</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/services/personal-training" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">Personal Training</Link></li>
              <li><Link href="/services/group-classes" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">Group Classes</Link></li>
              <li><Link href="/services/nutrition" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">Nutrition Coaching</Link></li>
              <li><Link href="/services/online-coaching" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">Online Coaching</Link></li>
              <li><Link href="/services/recovery" className="text-sm hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:text-orange-500">Recovery & Rehab</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="text-sm leading-relaxed">
                  123 Elite Fitness Blvd.<br />
                  Metropolis, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500 shrink-0" />
                <a href="tel:+15551234567" className="text-sm hover:text-white transition-colors duration-300 focus:outline-none focus:text-white">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500 shrink-0" />
                <a href="mailto:info@apexfit.com" className="text-sm hover:text-white transition-colors duration-300 focus:outline-none focus:text-white">
                  info@apexfit.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {currentYear} ApexFit. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300 focus:outline-none focus:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300 focus:outline-none focus:text-white">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

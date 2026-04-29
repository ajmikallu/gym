"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Dumbbell } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <Dumbbell className="w-8 h-8 text-red-600 transition-transform group-hover:-rotate-12" />
          <span className="text-2xl font-extrabold tracking-tighter text-white uppercase italic">
            Apex<span className="text-red-600">Fit</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-white/10 text-gray-300 hover:text-white focus:bg-white/10 focus:text-white text-sm font-semibold uppercase tracking-wider"}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/10 text-gray-300 hover:text-white focus:bg-white/10 focus:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white text-sm font-semibold uppercase tracking-wider">
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-black/95 backdrop-blur-md border border-white/10">
                    <li className="row-span-3">
                      <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-red-600/50 to-red-900/50 p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Dumbbell className="h-6 w-6 text-white mb-2" />
                          <div className="mb-2 mt-4 text-lg font-bold text-white uppercase italic">
                            ApexFit
                          </div>
                          <p className="text-sm leading-tight text-gray-300">
                            Experience world-class equipment and elite coaching.
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10">
                          <div className="text-sm font-semibold leading-none text-white uppercase">Our Story</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-400 mt-1">
                            Learn about how we started and our mission to elevate performance.
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about/trainers" legacyBehavior passHref>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10">
                          <div className="text-sm font-semibold leading-none text-white uppercase">Trainers</div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-400 mt-1">
                            Meet our elite team of professional coaches.
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/blog" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-white/10 text-gray-300 hover:text-white focus:bg-white/10 focus:text-white text-sm font-semibold uppercase tracking-wider"}>
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-white hover:text-gray-300 transition-colors uppercase tracking-wider">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all rounded-sm uppercase tracking-wider">
            Join Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 flex flex-col px-6 py-4 gap-4 shadow-xl">
          <Link href="/" className="text-lg font-semibold text-gray-300 hover:text-white transition-colors uppercase" onClick={closeMenu}>
            Home
          </Link>
          <Link href="/about" className="text-lg font-semibold text-gray-300 hover:text-white transition-colors uppercase" onClick={closeMenu}>
            About
          </Link>
          <Link href="/blog" className="text-lg font-semibold text-gray-300 hover:text-white transition-colors uppercase" onClick={closeMenu}>
            Blog
          </Link>
          <hr className="border-white/10 my-2" />
          <Link href="/login" className="text-lg font-semibold text-white transition-colors uppercase" onClick={closeMenu}>
            Login
          </Link>
          <Link href="/register" className="px-6 py-3 text-center text-base font-bold text-white bg-red-600 rounded-sm uppercase tracking-wider mt-2" onClick={closeMenu}>
            Join Now
          </Link>
        </div>
      )}
    </header>
  );
}

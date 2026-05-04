"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Dumbbell } from "lucide-react";
import { ThemeToggle } from "@/app/components/shared/theme-toggle";
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
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <Dumbbell className="w-8 h-8 text-red-600 transition-transform group-hover:-rotate-12" />
          <span className="text-2xl font-extrabold tracking-tighter text-black dark:text-white uppercase italic transition-colors duration-500">
            Apex<span className="text-red-600">Fit</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link href="/" />} className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white focus:bg-black/5 dark:focus:bg-white/10 focus:text-black dark:focus:text-white text-sm font-semibold uppercase tracking-wider transition-colors"}>
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white focus:bg-black/5 dark:focus:bg-white/10 focus:text-black dark:focus:text-white data-[state=open]:bg-black/5 dark:data-[state=open]:bg-white/10 data-[state=open]:text-black dark:data-[state=open]:text-white text-sm font-semibold uppercase tracking-wider transition-colors">
                  About
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-white dark:bg-black/95 backdrop-blur-md border border-gray-200 dark:border-white/10 transition-colors">
                    <li className="row-span-3">
                      <NavigationMenuLink render={<Link href="/about/facility" />} className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-red-600/50 to-red-900/50 p-6 no-underline outline-none focus:shadow-md">
                        <Dumbbell className="h-6 w-6 text-white mb-2" />
                        <div className="mb-2 mt-4 text-lg font-bold text-white uppercase italic">
                          ApexFit
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Experience world-class equipment and elite coaching.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink render={<Link href="/about" />} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10">
                        <div className="text-sm font-semibold leading-none text-black dark:text-white uppercase transition-colors">Our Story</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                          Learn about how we started and our mission to elevate performance.
                        </p>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink render={<Link href="/about/trainers" />} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10">
                        <div className="text-sm font-semibold leading-none text-black dark:text-white uppercase transition-colors">Trainers</div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                          Meet our elite team of professional coaches.
                        </p>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink render={<Link href="/blog" />} className={navigationMenuTriggerStyle() + " bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white focus:bg-black/5 dark:focus:bg-white/10 focus:text-black dark:focus:text-white text-sm font-semibold uppercase tracking-wider transition-colors"}>
                  Blog
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-semibold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors uppercase tracking-wider">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all rounded-sm uppercase tracking-wider">
            Join Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button 
            className="text-black dark:text-white p-2 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 flex flex-col px-6 py-4 gap-4 shadow-xl transition-colors duration-500">
          <Link href="/" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase" onClick={closeMenu}>
            Home
          </Link>
          <Link href="/about" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase" onClick={closeMenu}>
            About Us
          </Link>
          <Link href="/about/trainers" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase" onClick={closeMenu}>
            Trainers
          </Link>
          <Link href="/about/facility" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase" onClick={closeMenu}>
            Facility
          </Link>
          <Link href="/blog" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors uppercase" onClick={closeMenu}>
            Blog
          </Link>
          <hr className="border-gray-200 dark:border-white/10 my-2 transition-colors duration-500" />
          <Link href="/login" className="text-lg font-semibold text-black dark:text-white transition-colors uppercase" onClick={closeMenu}>
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

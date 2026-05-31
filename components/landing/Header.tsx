"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Resource", href: "#resources" },
    { name: "Alumni", href: "#alumni" },
  ];

  return (
    <>
      <header
        className={`
          fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] lg:w-[70%] z-50
          transition-all duration-300 ease-in-out px-6 py-2.5 rounded-full border
          ${isScrolled 
            ? "bg-sky-950/80 backdrop-blur-md shadow-lg border-white/10" 
            : "bg-white/5 backdrop-blur-sm border-white/10"
          }
        `}
      >
        <div className="flex items-center justify-between mx-auto">
          
          {/* Logo - With Image */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Eva<span className="text-sky-600 font-extrabold uppercase">SUE</span>
            </h1>
          </Link>

          {/* Desktop Navigation - Minimalist with Dropdown */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[10px] font-bold text-slate-300 hover:text-white uppercase tracking-widest transition-colors"
              >
                {item.name}
              </Link>
            ))}
          
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link 
              href="https://evasue.net/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block px-5 py-1.5 text-[10px] font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-full transition-all uppercase tracking-widest shadow-sm shadow-sky-500/20"
            >
              Donate
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-white/70 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Simplified */}
      <div
        className={`
          fixed inset-0 z-[60] md:hidden transition-all duration-500
          ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
      >
        <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" />
        <div className="relative h-full flex flex-col items-center justify-center p-8 gap-8">
          {navItems.map((item, idx) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-black text-white hover:text-sky-500 uppercase tracking-tighter transition-all"
            >
              {item.name}
            </Link>
          ))}
          
          {/* Mobile Donate Button */}
          <Link
            href="https://evasue.net/donate"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 px-8 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-full transition-all uppercase tracking-widest shadow-lg shadow-sky-500/20"
          >
            Donate
          </Link>
          
          <button 
             onClick={() => setIsMobileMenuOpen(false)}
             className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
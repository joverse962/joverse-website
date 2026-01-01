import React, { useState, useEffect } from "react";
import HeaderControls from "./HeaderControls";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center transition-all duration-300 ease-in-out bg-Woodsmoke backdrop-blur-md shadow-lg border-cool-sky/30
        ${isScrolled 
            ? "w-full rounded-none border-b py-2 px-6" // Scrolled state
            : "w-[calc(100%-2rem)] max-w-screen-2xl top-4 mx-4 md:mx-auto rounded-2xl border px-6 py-3" // Top state
        }
      `}
    >
      {/* 1. Logo Section (Left) */}
      <a href="/" className="group flex items-center gap-3 text-icy-aqua hover:text-crail transition shrink-0">
        <img
          src="/joverse-logo.png"
          alt="Joverse Logo"
          className="w-10 h-10 rounded-full group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-all duration-300"
        />
        <span className="hidden sm:block text-2xl font-bold tracking-widest">
          JOVERSE
        </span>
      </a>

      {/* 2. Desktop Navigation (Pushed to Right via ml-auto) */}
      <div className="hidden md:flex items-center gap-8 font-semibold text-sm h-full ml-auto mr-8">
        <a href="/" className="hover:text-crail transition">
          Home
        </a>

        {/* Projects Dropdown */}
        <div className="relative group h-full flex items-center">
          <button className="flex items-center gap-1 hover:text-crail transition-colors py-4 cursor-pointer outline-none">
            <span>Projects</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute top-[80%] right-0 w-56 bg-ink-black border border-cool-sky/30 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
            <ul className="py-2 text-gray-300">
              <li>
                <a href="/drone962" className="block px-4 py-3 hover:bg-cool-sky/10 hover:text-crail transition-colors">
                  drone962
                </a>
              </li>
              <li>
                <a href="/tui" className="block px-4 py-3 hover:bg-cool-sky/10 hover:text-crail transition-colors">
                  esp-csi-tui-rs
                </a>
              </li>
              <li>
                <a href="/blind-cam" className="block px-4 py-3 hover:bg-cool-sky/10 hover:text-crail transition-colors">
                  blind-cam
                </a>
              </li>
            </ul>
          </div>
        </div>

        <a href="/about-us" className="hover:text-crail transition">
          About Us
        </a>
        <a href="/contact-us" className="hover:text-crail transition">
          Contact
        </a>
      </div>

      {/* 3. Controls (Far Right) */}
      <div className="ml-auto md:ml-0">
        <HeaderControls />
      </div>
    </header>
  );
};

export default Header;
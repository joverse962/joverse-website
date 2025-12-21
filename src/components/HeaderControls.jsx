import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, ChevronDown, X } from 'lucide-react';

export default function HeaderControls() {
  const [open, setOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // Close panel helper
  const closePanel = () => setOpen(false);

  // Handle clicking outside to close
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (panelRef.current && toggleRef.current && 
          !panelRef.current.contains(e.target) && 
          !toggleRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        ref={toggleRef}
        onClick={() => setOpen((s) => !s)}
        className="md:hidden p-2 text-icy-aqua hover:text-cool-sky transition-colors focus:outline-none"
        aria-controls="mobile-actions-panel"
        aria-expanded={open ? 'true' : 'false'}
        aria-label="Menu"
      >
        {open ? <X size={24} /> : <LayoutGrid size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      <div
        ref={panelRef}
        id="mobile-actions-panel"
        className={`
          absolute left-4 right-4 top-20 
          bg-ink-black/95 backdrop-blur-xl border border-cool-sky/30 
          rounded-2xl shadow-[0_0_30px_-5px_rgba(56,189,248,0.2)] 
          p-5 z-50 flex flex-col gap-2
          transition-all duration-300 origin-top
          ${open ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
        `}
      >
        <nav className="flex flex-col gap-1 text-left">
          {/* Home */}
          <a 
            href="/" 
            onClick={closePanel} 
            className="px-4 py-3 text-gray-200 hover:text-icy-aqua hover:bg-cool-sky/10 rounded-xl font-bold transition-all"
          >
            Home
          </a>

          {/* Projects Dropdown */}
          <div className="flex flex-col">
            <button 
              onClick={() => setProjectsOpen(!projectsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-200 hover:text-icy-aqua hover:bg-cool-sky/10 rounded-xl font-bold transition-all"
            >
              <span>Projects</span>
              <ChevronDown 
                size={18} 
                className={`transition-transform duration-300 ${projectsOpen ? 'rotate-180 text-icy-aqua' : 'text-gray-400'}`} 
              />
            </button>
            
            {/* Dropdown Content */}
            <div 
              className={`
                flex flex-col pl-4 ml-4 border-l border-cool-sky/20 gap-1 overflow-hidden transition-all duration-300
                ${projectsOpen ? 'max-h-60 opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}
              `}
            >
              <a href="/drone962" onClick={closePanel} className="py-2 px-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                drone962
              </a>
              {/* Monospace font for the tech project */}
              <a href="/tui" onClick={closePanel} className="py-2 px-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                esp-csi-tui-rs
              </a>
              <a href="/blind-cam" onClick={closePanel} className="py-2 px-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                blind-cam
              </a>
              <a href="/projects" onClick={closePanel} className="py-2 px-3 text-xs font-bold uppercase tracking-widest text-cool-sky hover:text-icy-aqua mt-1">
                View All Projects
              </a>
            </div>
          </div>

          {/* Other Links */}
          <a 
            href="/about-us" 
            onClick={closePanel} 
            className="px-4 py-3 text-gray-200 hover:text-icy-aqua hover:bg-cool-sky/10 rounded-xl font-bold transition-all"
          >
            About Us
          </a>
          
          <a 
            href="/contact-us" 
            onClick={closePanel} 
            className="px-4 py-3 text-gray-200 hover:text-icy-aqua hover:bg-cool-sky/10 rounded-xl font-bold transition-all"
          >
            Contact Us
          </a>
        </nav>
      </div>
    </>
  );
}
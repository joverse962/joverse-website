import React, { useCallback, useState, useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimation, AnimatePresence } from "framer-motion";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { twMerge } from "tailwind-merge";

// --- MAIN CONTROLLER COMPONENT ---
export default function ReactorLogo({ logoSrc }) {
  // State to track if intro is playing
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="relative w-full h-screen bg-slate-950 rounded-2xl overflow-hidden font-sans selection:bg-cyan-500/30">
      <AnimatePresence mode="wait">
        
        {/* 1. INTRO VIDEO LAYER */}
        {!introFinished && (
          <IntroSequence onComplete={() => setIntroFinished(true)} />
        )}

        {/* 2. MAIN INTERACTIVE SCENE LAYER */}
        {introFinished && (
          <MainScene logoSrc={logoSrc} />
        )}

      </AnimatePresence>
    </div>
  );
}

// --- INTRO SEQUENCE ---
function IntroSequence({ onComplete }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
    >
      <video
        src="/intro1.mp4" 
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
      />
      <button 
        onClick={onComplete}
        className="absolute bottom-8 right-8 text-white/40 hover:text-white text-xs tracking-widest border border-white/10 hover:border-white/50 px-4 py-2 rounded-full transition-all duration-300"
      >
        SKIP INITIALIZATION
      </button>
    </motion.div>
  );
}

// --- MAIN SCENE ---
function MainScene({ logoSrc }) {
  const containerRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    containerRef.current = container;
  }, []);

  // Mouse Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 20 });
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Auto-Pilot System (Ghost Mouse)
  useEffect(() => {
    let idleTimer;
    let animationFrame;
    let angle = 0;

    const startAutoPilot = () => {
      const animate = () => {
        if (containerRef.current) {
          angle += 0.03; 
          const radius = 200; 
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const fakeX = centerX + Math.cos(angle) * radius;
          const fakeY = centerY + Math.sin(angle) * radius;

          containerRef.current.interactivity.mouse.position = { x: fakeX, y: fakeY };
          containerRef.current.interactivity.status = "mousemove";

          // Tilt the logo slightly to match the ghost movement
          x.set(Math.cos(angle) * 0.4); 
          y.set(Math.sin(angle) * 0.4);
        }
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    };

    const resetIdle = () => {
      clearTimeout(idleTimer);
      cancelAnimationFrame(animationFrame);
      idleTimer = setTimeout(() => {
        startAutoPilot();
      }, 3000); // Wait 3 seconds before taking over
    };

    window.addEventListener("mousemove", resetIdle);
    resetIdle(); 

    return () => {
      window.removeEventListener("mousemove", resetIdle);
      clearTimeout(idleTimer);
      cancelAnimationFrame(animationFrame);
    };
  }, [x, y]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }
  
  function handleMouseLeave() {}

  // Glitch Effect Controller
  const [isClicking, setIsClicking] = useState(false);
  const handleClick = () => {
    setIsClicking(true);
    triggerGlitch();
    setTimeout(() => setIsClicking(false), 300);
  };

  const glitchControls = useAnimation();
  const triggerGlitch = async () => {
    await glitchControls.start({
      x: [0, -5, 5, -2, 2, 0],
      y: [0, 2, -2, 0],
      opacity: [0, 0.8, 0, 0.5, 0],
      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
      transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1] }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.60) triggerGlitch();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={fastParticleConfig}
        className="absolute inset-0 z-0"
      />

      <MachJet />
      <Drone />
      
      {/* EXPLOSION POSITION: Top-Leftish Area */}
      <div className="absolute top-40 left-[50%] -translate-x-1/2 md:left-[200px] md:translate-x-0 z-[4] pointer-events-none">
        <ComplexSpaceExplosion />
      </div>

      {/* MAIN INTERACTIVE TILT CONTAINER */}
      <motion.div
        className={twMerge(
          "relative z-10 flex flex-col items-center justify-center cursor-pointer perspective-1000",
          isClicking ? "brightness-125" : ""
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleClick}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: isClicking ? [0, -20, 0] : [0, -10, 0] }}
        transition={{ y: isClicking ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      >
        
        {/* 1. BACKGROUND TITLE (Parallax Depth: -100px) */}
        <motion.h1 
            className="absolute whitespace-nowrap text-5xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-900 to-violet-900 select-none opacity-20"
            style={{ transform: "translateZ(-100px) translateY(-50px)" }}
        >
            JOVERSE
        </motion.h1>

        {/* 2. REACTOR LOGO (Middle Layer: 0px) */}
        <div className="relative w-48 h-48 md:w-64 md:h-64" style={{ transform: "translateZ(0px)" }}>
            {/* Glow */}
            <motion.div
              className="absolute inset-10 rounded-full blur-2xl bg-cyan-500"
              style={{ transform: "translateZ(-40px)" }}
              animate={{
                  opacity: isClicking ? 0.9 : [0.3, 0.7, 0.3],
                  scale: isClicking ? 1.3 : [0.95, 1.1, 0.95],
              }}
              transition={{
                  opacity: isClicking ? { duration: 0.1 } : { duration: 5, ease: "easeInOut", repeat: Infinity },
                  scale: isClicking ? { type: "spring" } : { duration: 5, ease: "easeInOut", repeat: Infinity }, 
              }}
            />
            
            {/* Glitch Overlay Layers */}
            <motion.img src={logoSrc} alt="" className="absolute top-0 left-0 w-full h-full opacity-0 mix-blend-screen pointer-events-none" style={{ transform: "translateZ(30px)", filter: "sepia(100%) saturate(300%) hue-rotate(-50deg)" }} animate={glitchControls} />
            <motion.img src={logoSrc} alt="" className="absolute top-0 left-0 w-full h-full opacity-0 mix-blend-screen pointer-events-none" style={{ transform: "translateZ(30px)", filter: "sepia(100%) saturate(300%) hue-rotate(180deg)" }} animate={glitchControls} transition={{ delay: 0.05 }} />

            {/* Actual Logo */}
            <motion.img
              src={logoSrc}
              alt="Reactor Logo"
              className={twMerge(
                  "relative w-full h-full transition-all duration-100 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]",
                  isClicking ? "drop-shadow-[0_0_50px_rgba(255,255,255,0.9)] brightness-110" : ""
              )}
              style={{ transform: "translateZ(30px)" }}
            />

            {/* Scanline Effect */}
            <div className="absolute inset-0 z-20 pointer-events-none rounded-full overflow-hidden opacity-30" style={{ transform: "translateZ(31px)" }}>
                <motion.div 
                    className="w-full h-[10px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20"
                    animate={{ top: ["-10%", "110%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>
        </div>

        {/* 3. FOREGROUND TEXT (HUD Layer: +60px) */}
        <div 
            className="mt-12 text-center pointer-events-none px-4" 
            style={{ transform: "translateZ(60px)" }}
        >
             <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-violet-400">
                    JOVERSE
                </span>
             </h2>
             <p className="max-w-md text-xs md:text-base text-cyan-100/80 font-light tracking-wide leading-relaxed mx-auto bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-xl">
                Bridging hardware and software to create an innovative ecosystem. 
                <span className="block mt-2 text-cyan-400 font-medium">Focused on embedded systems and intelligent robotics.</span>
             </p>
        </div>

      </motion.div>
    </motion.div>
  );
}

// --- PARTICLES CONFIG ---
const fastParticleConfig = {
  fpsLimit: 120,
  interactivity: { events: { onHover: { enable: true, mode: "attract" }, onClick: { enable: true, mode: "push" }, resize: true }, modes: { attract: { distance: 200, duration: 0.4, factor: 5, speed: 2 }, push: { quantity: 4 } } },
  particles: { color: { value: ["#22d3ee", "#67e8f9", "#0ea5e9"] }, links: { color: "#22d3ee", distance: 150, enable: true, opacity: 0.2, width: 1 }, move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 2, straight: false }, number: { density: { enable: true, area: 800 }, value: 100 }, opacity: { value: 0.5 }, shape: { type: "circle" }, size: { value: { min: 1, max: 3 } } },
  detectRetina: true, fullScreen: { enable: false }, background: { color: "transparent" }
};

// --- SUB-COMPONENTS ---

function MachJet() {
  return (
    <motion.div
      className="absolute z-[5] pointer-events-none"
      initial={{ x: "110vw", y: "12vh", opacity: 0 }}
      animate={{ x: "-40vw", opacity: [0, 1, 1, 1, 0] }}
      transition={{ duration: 7, repeat: Infinity, repeatDelay: 3, ease: "linear", times: [0, 0.05, 0.8, 0.95, 1] }}
    >
       <img src="/F35.png" alt="F-35" className="w-[120px] md:w-[200px] relative z-10 drop-shadow-2xl sepia-100 saturate-200 hue-rotate-[170deg]" />
       <motion.div className="absolute right-2 top-[58%] -translate-y-1/2 w-28 h-6 bg-yellow-500 blur-xl opacity-80" animate={{ opacity: [0.7, 0.9, 0.7], scaleX: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.2 }} />
       <motion.div className="absolute right-4 top-[58%] -translate-y-1/2 w-16 h-3 bg-orange-500 blur-md opacity-90" animate={{ opacity: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 0.15 }} />
    </motion.div>
  )
}

// --- UPDATED DRONE COMPONENT ---
function Drone() {
  // Default wide Desktop Path
  const desktopPath = "M -100 900 C 300 700, 800 600, 600 -200";
  
  // State to hold the active path
  const [dronePath, setDronePath] = useState(desktopPath);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // If screen is smaller than tablet (mobile), generate a tighter path
      if (w < 768) {
        // Starts bottom-left, curves through middle, exits top-right within screen bounds
        setDronePath(`M -50 ${h + 100} C ${w * 0.3} ${h * 0.7}, ${w * 0.8} ${h * 0.4}, ${w * 0.6} -200`);
      } else {
        setDronePath(desktopPath);
      }
    };

    handleResize(); // Calculate on mount
    window.addEventListener("resize", handleResize); // Re-calculate on resize
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className="absolute z-[6] pointer-events-none"
      initial={{ offsetDistance: "0%", opacity: 0 }}
      animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
      style={{ 
        offsetPath: `path("${dronePath}")`, 
        offsetRotate: "auto 90deg" 
      }}
    >
       <div className="absolute -inset-10 bg-blue-500/40 blur-2xl rounded-full" />
       <img src="/drone2.png" alt="Drone" className="w-24 md:w-32 relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
    </motion.div>
  )
}



// --- ULTRA-REALISTIC EXPLOSION COMPONENT ---
function ComplexSpaceExplosion() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Retrigger explosion every 5 seconds
    const timer = setInterval(() => { setKey(prev => prev + 1); }, 5000);
    return () => clearInterval(timer);
  }, []);

  const debrisData = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
      id: i, 
      angle: Math.random() * 360, 
      distance: 100 + Math.random() * 300, 
      size: 4 + Math.random() * 10, 
      rotation: (Math.random() - 0.5) * 1800, 
      delay: Math.random() * 0.1,
      shape: `${30 + Math.random() * 40}% ${30 + Math.random() * 40}% ${30 + Math.random() * 40}% ${30 + Math.random() * 40}%`
  })), [key]);

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        <ExplosionEvent key={key} debris={debrisData} />
      </AnimatePresence>
    </div>
  );
}

function ExplosionEvent({ debris }) {
  return (
    <>
      {/* 1. THE CORE: RADIAL GRADIENT + ADDITIVE BLENDING */}
      <motion.div
        className="absolute z-[60] rounded-full"
        style={{ 
            mixBlendMode: "plus-lighter",
            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(67,229,247,1) 30%, rgba(30,58,138,0) 70%)"
        }}
        initial={{ width: 10, height: 10, scale: 0, opacity: 1 }}
        animate={{ 
            scale: [0, 1.5, 40], // Quick Suck-in check (not visible) then MASSIVE Expand
            opacity: [1, 1, 0],
        }}
        transition={{ duration: 1.2, times: [0, 0.1, 1], ease: "circOut" }}
      />

      {/* 2. PLASMA SHOCKWAVE (Inner Ring) */}
      <motion.div 
        className="absolute rounded-full border-4 border-cyan-200/80 z-[59]"
        style={{ mixBlendMode: "screen" }}
        initial={{ width: 0, height: 0, opacity: 1, borderWidth: "50px" }}
        animate={{ width: 500, height: 500, opacity: 0, borderWidth: "0px" }}
        transition={{ duration: 0.8, ease: "circOut" }}
      />

      {/* 3. DISTORTION SHOCKWAVE (Outer Ring - Subtle) */}
      <motion.div 
        className="absolute rounded-full border border-blue-500/30 z-[58]"
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: 700, height: 700, opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.0, delay: 0.1, ease: "easeOut" }}
      />

      {/* 4. ANAMORPHIC LENS FLARE (Sci-Fi Look) */}
      <motion.div 
        className="absolute h-[2px] w-[1000px] bg-gradient-to-r from-transparent via-cyan-100 to-transparent z-[65]"
        style={{ mixBlendMode: "screen" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1.5, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
      />

      {/* 5. NEBULA AFTERMATH (Volumetric Clouds) */}
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-violet-900 blur-[3rem] z-[30] opacity-0"
        animate={{ scale: [0.2, 4], opacity: [0, 0.6, 0] }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-blue-600 blur-[2rem] z-[31] opacity-0"
        style={{ mixBlendMode: "plus-lighter" }}
        animate={{ scale: [0.2, 3], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* 6. PHYSICAL DEBRIS (Dark rocks with cyan rim-light) */}
      {debris.map((rock) => {
          const rad = rock.angle * (Math.PI / 180);
          return (
            <motion.div
                key={`debris-${rock.id}`}
                className="absolute z-[35] bg-slate-900"
                style={{ 
                    width: rock.size, 
                    height: rock.size, 
                    borderRadius: rock.shape,
                    // The 'rim light' effect using inset shadow
                    boxShadow: "inset -1px -1px 2px rgba(0,0,0,0.8), inset 1px 1px 3px rgba(34,211,238,0.8)" 
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{ 
                    x: Math.cos(rad) * rock.distance,
                    y: Math.sin(rad) * rock.distance,
                    scale: [0, 1, 0], 
                    opacity: [1, 1, 0],
                    rotate: rock.rotation
                }}
                transition={{ duration: 1 + Math.random(), delay: rock.delay, ease: "easeOut" }}
            />
          );
      })}

      {/* 7. HIGH SPEED SPARKS */}
      {Array.from({ length: 40 }).map((_, i) => {
         const angle = Math.random() * 360; 
         const dist = 200 + Math.random() * 300;
         return (
           <motion.div
             key={`spark-${i}`}
             className="absolute w-[2px] h-[2px] bg-cyan-100 rounded-full z-[40]"
             initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
             animate={{ 
               x: Math.cos(angle * Math.PI / 180) * dist, 
               y: Math.sin(angle * Math.PI / 180) * dist, 
               scale: [2, 0], 
               opacity: [1, 0] 
             }}
             transition={{ duration: 0.5, ease: "circOut", delay: Math.random() * 0.1 }}
           />
         )
      })}
    </>
  );
}
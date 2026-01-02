import React, { useCallback, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimation } from "framer-motion";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { particleOptions } from "../config/particles";
import { twMerge } from "tailwind-merge";

export default function ReactorLogo({ logoSrc }) {
  // --- Particle Init ---
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // --- 3D Tilt Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // --- Click Logic ---
  const [isClicking, setIsClicking] = useState(false);
  const handleClick = () => {
    setIsClicking(true);
    triggerGlitch();
    setTimeout(() => setIsClicking(false), 300);
  };

  // --- Glitch Logic ---
  const glitchControls = useAnimation();
  
  const triggerGlitch = async () => {
    await glitchControls.start({
      x: [0, -5, 5, -2, 2, 0],
      y: [0, 2, -2, 0],
      opacity: [0, 0.8, 0, 0.5, 0],
      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
      transition: { duration: 0.2, times: [0, 0.2, 0.4, 0.6, 1] }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) triggerGlitch();
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="relative w-full h-screen flex items-center rounded-2xl justify-center overflow-hidden bg-slate-950">
      
      {/* 1. PARTICLES */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particleOptions}
        className="absolute inset-0 z-0"
      />

      {/* 2. THE JET (Corrected Path) */}
      <MachJet />

      {/* 3. TILT CONTAINER (LOGO) */}
      <motion.div
        className={twMerge(
          "relative z-10 w-64 h-64 cursor-pointer perspective-1000 transition-all duration-300",
          isClicking ? "brightness-125" : ""
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleClick}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: isClicking ? [0, -20, 0] : [0, -10, 0] }}
        transition={{ y: isClicking ? { duration: 0.3 } : { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      >
        {/* Glow Blob */}
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

        {/* Glitch Layers */}
        <motion.img
          src={logoSrc} alt=""
          className="absolute top-0 left-0 w-full h-full opacity-0 mix-blend-screen pointer-events-none"
          style={{ transform: "translateZ(30px)", filter: "sepia(100%) saturate(300%) hue-rotate(-50deg)" }}
          animate={glitchControls}
        />
        <motion.img
          src={logoSrc} alt=""
          className="absolute top-0 left-0 w-full h-full opacity-0 mix-blend-screen pointer-events-none"
          style={{ transform: "translateZ(30px)", filter: "sepia(100%) saturate(300%) hue-rotate(180deg)" }}
          animate={glitchControls}
          transition={{ delay: 0.05 }}
        />

        {/* Main Logo */}
        <motion.img
          src={logoSrc}
          alt="Reactor Logo"
          className={twMerge(
             "relative w-full h-full transition-all duration-100 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]",
             isClicking ? "drop-shadow-[0_0_50px_rgba(255,255,255,0.9)] brightness-110" : ""
          )}
          style={{ transform: "translateZ(30px)" }}
        />

        {/* Scanline */}
        <div 
            className="absolute inset-0 z-20 pointer-events-none rounded-full overflow-hidden opacity-30"
            style={{ transform: "translateZ(31px)" }}
        >
            <motion.div 
                className="w-full h-[10px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20"
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
        </div>
      </motion.div>
    </div>
  );
}

// --- UPDATED SUB-COMPONENT: REALISTIC F-35 JET ---
function MachJet() {
  return (
    <motion.div
      className="absolute z-[5] pointer-events-none"
      initial={{ 
        x: "110vw", // Start off-screen RIGHT
        y: "1vh",  // Position near TOP (approx 12% down)
        opacity: 0, 
      }}
      animate={{
        x: "-30vw", // Fly to off-screen LEFT
        opacity: [0, 1, 1, 0], // Fade in start, Fade out end
      }}
      transition={{
        duration: 5, // 5 seconds for a realistic flyby speed
        repeat: Infinity,
        repeatDelay: 4, 
        ease: "linear", 
      }}
    >
       {/* Ensure you save your transparent image as f35.png in public folder */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[80%] bg-crail blur-[60px] opacity-60" />

       {/* [UPDATED] THE PLANE IMAGE */}
       <img 
         src="/F35.png" 
         alt="F-35 Stealth Fighter" 
         // [UPDATED CLASSES] 
         // brightness-150: Makes it much brighter
         // sepia + saturate + hue-rotate: Tints the grey image to cyan/blue energy color
         className="relative w-80 drop-shadow-2xl brightness-100 contrast-125 sepia saturate-200 hue-rotate-[170deg]"
       />
       
       {/* Engine Afterburner (Blue/Cyan Flame) - Kept these as they were good */}
       <div className="absolute right-2 top-[55%] -translate-y-1/2 w-24 h-3 bg-cyan-400 blur-xl opacity-70" />
       <div className="absolute right-4 top-[55%] -translate-y-1/2 w-10 h-1 bg-white blur-md opacity-90" />
        </motion.div>
  )
}
import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function InteractiveLogo() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Create smooth spring physics for the tilt interaction
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Map mouse position to rotation degrees (max 20 degrees tilt)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    // Calculate mouse position as a percentage (-0.5 to 0.5) from center
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  function handleMouseLeave() {
    // Reset to center on leave
    x.set(0);
    y.set(0);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <motion.div
        className="relative w-64 h-64 cursor-pointer perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d", // Crucial for 3D effect
        }}
        // Add a gentle floating animation when idle
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* The Glow Effect behind the logo */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl opacity-40 bg-cyan-400"
          style={{
            transform: "translateZ(-50px)", // Push glow behind
          }}
          whileHover={{ opacity: 0.8, scale: 1.2 }}
        />

        {/* The Actual Logo */}
        <motion.img
          src="/joverseLogo.png" // Ensure this path is correct in your public folder
          alt="Joverse Logo"
          className="relative w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          style={{
            transform: "translateZ(20px)", // Pop logo forward
          }}
        />
      </motion.div>
    </div>
  );
}
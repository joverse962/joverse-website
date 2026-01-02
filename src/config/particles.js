// src/config/particles.js
export const particleOptions = {
  fpsLimit: 120,
  interactivity: {
    events: {
      // Interactivity 1: Mouse hover attracts particles
      onHover: {
        enable: true,
        mode: "attract", 
      },
      // Interactivity 2: Click creates a burst
      onClick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      attract: {
        distance: 200,
        duration: 0.4,
        easing: "ease-out-quad",
        factor: 5, // How strong the pull is
        maxSpeed: 50,
        speed: 3
      },
      push: {
        quantity: 10, // How many particles explode on click
      },
    },
  },
  particles: {
    color: {
      value: ["#22d3ee", "#67e8f9", "#0ea5e9"], // Varying shades of Cyan
    },
    links: {
      color: "#22d3ee",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: true,
      speed: 1, // Slow ambient movement
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 100, // Number of particles
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
  fullScreen: { enable: false }, // Important: keeps particles inside our container
  background: {
    color: "transparent",
  }
};
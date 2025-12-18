import React, { useState, useEffect, useCallback } from 'react';

const TuiCarousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto group flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* --- Image Container --- */}
      {/* We use aspect-video (16:9) to keep a consistent shape. 
          bg-black ensures 'black bars' blend with the theme if image is narrow. */}
      <div className="relative w-full aspect-video bg-black rounded-t-3xl border border-cool-sky/20 overflow-hidden shadow-2xl">
        
        <img 
          src={slides[currentIndex].img} 
          alt={slides[currentIndex].title}
          className="w-full h-full object-contain transition-transform duration-700"
        />

        {/* --- Navigation Arrows --- */}
        {/* Left Arrow */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white border border-white/10 backdrop-blur-md transition-all duration-300
                     opacity-0 group-hover:opacity-50 hover:!opacity-100 hover:scale-110"
          aria-label="Previous Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white border border-white/10 backdrop-blur-md transition-all duration-300
                     opacity-0 group-hover:opacity-50 hover:!opacity-100 hover:scale-110"
          aria-label="Next Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Slide Counter (Optional Visual Flair) */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono text-white/70">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>

      {/* --- Text Container (Card) --- */}
      {/* This is the same width as the image container above */}
      <div className="w-full bg-ink-black border-x border-b border-cool-sky/20 p-6 md:p-8 rounded-b-3xl shadow-lg relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-bold text-white font-mono tracking-wide uppercase flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-icy-aqua shadow-[0_0_10px_rgba(0,255,255,0.8)]"></span>
              {slides[currentIndex].title}
            </h3>
            <p className="text-azure-mist text-base font-sans leading-relaxed pl-5 border-l-2 border-cool-sky/20">
              {slides[currentIndex].desc}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2 self-start md:self-end pt-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentIndex 
                    ? 'w-8 bg-icy-aqua shadow-[0_0_8px_rgba(0,255,255,0.6)]' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuiCarousel;
import React, { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      // ----------------------------------------------------------------------
      // TODO: Replace 'YOUR_FORMSPREE_ID' with the code you get from step 1
      // Example: https://formspree.io/f/mqazqozr
      // ----------------------------------------------------------------------
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mpqarnyl';

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 
          'Content-Type': 'application/json', // <--- This was missing
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus('success');
        e.target.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div>
        <label className="block text-icy-aqua font-bungee mb-1 text-sm">Name</label>
        <input
          type="text"
          name="name"
          required
          className="w-full p-3 bg-azure-mist border-2 border-cool-sky text-ink-black focus:outline-none focus:ring-2 focus:ring-icy-aqua transition-all"
          placeholder="Your Name"
        />
      </div>

      <div>
        <label className="block text-icy-aqua font-bungee mb-1 text-sm">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full p-3 bg-azure-mist border-2 border-cool-sky text-ink-black focus:outline-none focus:ring-2 focus:ring-icy-aqua transition-all"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-icy-aqua font-bungee mb-1 text-sm">Message</label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full p-3 bg-azure-mist border-2 border-cool-sky text-ink-black focus:outline-none focus:ring-2 focus:ring-icy-aqua transition-all"
          placeholder="How can we help?"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-2 bg-cool-sky hover:bg-icy-aqua text-ink-black font-bungee py-3 px-6 transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && (
        <p className="text-green-400 font-bold font-sans mt-2">Message sent successfully to Joverse!</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 font-bold font-sans mt-2">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
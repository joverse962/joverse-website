/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
		extend: {
			colors: {
                // These define the custom classes used in the HTML
				'ink-black': '#091D28',
				'icy-aqua': '#C1FEFF',
				'cool-sky': '#61ADFD',
				'azure-mist': '#E9FEFC',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			}
		},
	},
	plugins: [],
}


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
				'Woodsmoke': '#13161b',
				'crail': '#c46541',
				'minsk': '#443096',
				'hippie-blue': '#4d9da6'
			},
			fontFamily: {
				alfa: ['"Alfa Slab One"', 'serif'],
				spice: ['"Bungee Spice"', 'cursive'],
				bungee: ['"Bungee"', 'cursive'],
			}
		},
	},
	plugins: [],
}


// $mauve-shadow: rgba(72, 37, 49, 1);
// $ink-black: rgba(13, 17, 23, 1);
// $onyx: rgba(8, 10, 14, 1);
// $deep-twilight: rgba(39, 32, 96, 1);
// $prussian-blue: rgba(15, 26, 51, 1);


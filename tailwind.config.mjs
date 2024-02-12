/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'dark-blue': {
					'50': '#ecf2ff',
					'100': '#dce6ff',
					'200': '#c0d1ff',
					'300': '#9ab1ff',
					'400': '#7286ff',
					'500': '#515cff',
					'600': '#3532f9',
					'700': '#2c26dc',
					'800': '#2522b4',
					'900': '#24258b',
					'950': '#171551',
				},				
			},
		},
	},
	plugins: [],
}

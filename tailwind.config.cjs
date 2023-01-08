/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: ["dark"],
	},
	daisyui: {
		themes: [
			{
				dark: {
					primary: "hsl(280,100%,60%)",
					secondary: "#378AA9",
					accent: "#95006E",
					neutral: "#dcdcdc",
					"base-100": "#2C2F33",
					info: "#1192e8",
					success: "#198038",
					warning: "#b28600",
					error: "#fa4d56",
				},
			},
		],
	},
	plugins: [require("daisyui"), require("@tailwindcss/typography")],
};

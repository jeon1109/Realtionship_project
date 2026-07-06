import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#24231f",
        paper: "#fbf8f1",
        meadow: "#607d68",
        clay: "#b66f52",
        mist: "#e7ece4",
        linen: "#f2eadc",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(67, 62, 51, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

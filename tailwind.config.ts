import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#2563EB",
                    dark: "#1d4ed8",
                    light: "#3b82f6",
                },
                background: {
                    light: "#f8fafc",
                    dark: "#101622",
                },
                surface: {
                    light: "#ffffff",
                    dark: "#1a202c",
                },
            },
            fontFamily: {
                display: ["Inter", "system-ui", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                "2xl": "1rem",
            },
            boxShadow: {
                card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                "card-hover": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};

export default config;

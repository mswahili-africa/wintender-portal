import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "1rem",
                lg: "2rem",
                "2xl": "2rem",
            },
        },
        extend: {
            fontFamily: {
                inter: ["Inter", "sans-serif"],
            },

            colors: {
                "main-color": "#00A651",
            },
        },
    },

    plugins: [
        aspectRatio,
        forms,
    ],
};
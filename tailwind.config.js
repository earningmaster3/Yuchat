
import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
    // ✅ which files tailwind should scan for classes
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    // ✅ dark mode
    darkMode: "class", // or "media" for system preference

    theme: {
        extend: {},
    },

    // ✅ plugins
    plugins: [daisyui],
};
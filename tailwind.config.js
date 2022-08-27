export default {
    plugins: [],
    theme: {
        extend: {
            colors: {
                primary: "#110620",
                secondary: "#190b2d",
                tertiary: "#2a0a50",
                gradien1: "#ff56f6",
                gradien2: "#b936ee",
                gradien3: "#3bace2",
                gradien4: "#3c79d4",
                gradien5: "#ffa6fa"
            }
        },
    },
    purge: ["./index.html", './src/**/*.{svelte,js,ts}'], // for unused CSS
    variants: {
        extend: {},
    },
    darkMode: false, // or 'media' or 'class'
}
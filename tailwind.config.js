/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,ts,scss}'],
    corePlugins: {
        preflight: true
    },
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            backgroundColor: {
                'archencil-blue': '#334783',
                'sky-inspiration': '#9BADFF',
                'deep-midnight': '#27263B',
                'passionate-red': '#D62C2C'
            },
            textColor: {
                'archencil-blue': '#334783',
                'sky-inspiration': '#9BADFF',
                'deep-midnight': '#27263B',
                'passionate-red': '#D62C2C'
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: []
};

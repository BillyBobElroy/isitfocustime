import typography from '@tailwindcss/typography'; // 🆕

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#d4d4d8', // softer white (zinc-300)
            a: {
              color: '#22c55e', // green-500 links
              '&:hover': {
                color: '#16a34a', // darker green on hover
              },
              textDecoration: 'none',
              borderBottom: '1px solid #22c55e',
            },
            h1: { color: '#ffffff', fontWeight: '700', fontSize: '2.25rem' },
            h2: { color: '#ffffff', fontWeight: '700', fontSize: '1.75rem' },
            h3: { color: '#e4e4e7', fontWeight: '600', fontSize: '1.5rem' },
            h4: { color: '#e4e4e7', fontWeight: '600' },
            p: { marginTop: '1rem', marginBottom: '1rem' },
            li: { marginTop: '0.5rem', marginBottom: '0.5rem' },
            blockquote: {
              color: '#9ca3af',
              borderLeftColor: '#22c55e',
              fontStyle: 'italic',
              paddingLeft: '1rem',
            },
            strong: { color: '#ffffff' },
            code: {
              backgroundColor: '#27272a',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
          },
        },
      },
    }    
  },
  plugins: [typography], // 🆕
};

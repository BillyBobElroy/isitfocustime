import typography from '@tailwindcss/typography'; // 🆕

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		typography: {
  			DEFAULT: {
  				css: {
  					color: '#d4d4d8',
  					a: {
  						color: '#22c55e',
  						'&:hover': {
  							color: '#16a34a'
  						},
  						textDecoration: 'none',
  						borderBottom: '1px solid #22c55e'
  					},
  					h1: {
  						color: '#ffffff',
  						fontWeight: '700',
  						fontSize: '2.25rem'
  					},
  					h2: {
  						color: '#ffffff',
  						fontWeight: '700',
  						fontSize: '1.75rem'
  					},
  					h3: {
  						color: '#e4e4e7',
  						fontWeight: '600',
  						fontSize: '1.5rem'
  					},
  					h4: {
  						color: '#e4e4e7',
  						fontWeight: '600'
  					},
  					p: {
  						marginTop: '1rem',
  						marginBottom: '1rem'
  					},
  					li: {
  						marginTop: '0.5rem',
  						marginBottom: '0.5rem'
  					},
  					blockquote: {
  						color: '#9ca3af',
  						borderLeftColor: '#22c55e',
  						fontStyle: 'italic',
  						paddingLeft: '1rem'
  					},
  					strong: {
  						color: '#ffffff'
  					},
  					code: {
  						backgroundColor: '#27272a',
  						padding: '0.2rem 0.4rem',
  						borderRadius: '0.25rem',
  						fontWeight: '500'
  					}
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [typography, require("tailwindcss-animate")], // 🆕
};

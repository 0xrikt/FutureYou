import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ['var(--font-primary)', 'system-ui', '-apple-system', 'sans-serif'],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(55 65 81)',
            '--tw-prose-headings': 'rgb(31 41 55)',
            '--tw-prose-links': 'rgb(59 130 246)',
            lineHeight: '1.75',
            fontFamily: 'var(--font-primary)',
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
              letterSpacing: '0.01em',
              fontWeight: '300',
              fontFamily: 'var(--font-primary)',
            },
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: 'var(--font-primary)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
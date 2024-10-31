// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // 基础配置，会覆盖 Tailwind 默认值
    fontFamily: {
      sans: ['var(--font-primary)', 'system-ui', '-apple-system', 'sans-serif'],
    },
    // 扩展配置，添加到默认值中
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
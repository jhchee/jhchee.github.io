const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        "9/16": "56.25%",
      },
      fontFamily: {
        sans: ['sohne', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['charter', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      colors: {
        gray: colors.gray,
        github: "#333333",
        twitter: "#1da1f2",
        linkedin: "#0a66c2",
        themeToggler: "#2795e9",
        blue: colors.sky,
        code: {
          green: "#b5f4a5",
          yellow: "#ffe484",
          purple: "#d9a9ff",
          red: "#ff8383",
          blue: "#93ddfd",
          white: "#fff",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: 'charter, Georgia, Cambria, "Times New Roman", Times, serif',
            fontSize: '1.25rem',
            lineHeight: '1.8',
            fontWeight: '400',
            letterSpacing: '-0.003em',
            color: theme("colors.gray.800"),
            maxWidth: '680px',
            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },
            a: {
              color: theme("colors.blue.600"),
              textDecoration: 'underline',
              textDecorationColor: theme("colors.blue.300"),
              textUnderlineOffset: '2px',
              fontWeight: '500',
              "&:hover": {
                color: theme("colors.blue.700"),
                textDecorationColor: theme("colors.blue.500"),
              },
              code: { 
                color: theme("colors.blue.600"),
                textDecoration: 'none',
              },
            },
            br: {
              height: "1rem",
            },
            h1: {
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '2.75rem',
              fontWeight: "800",
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              color: theme("colors.gray.900"),
              marginTop: '0',
              marginBottom: '1rem',
            },
            h2: {
              fontFamily: 'sohne, Inter, sans-serif',
              fontSize: '2rem',
              fontWeight: "700",
              lineHeight: '1.3',
              letterSpacing: '-0.015em',
              color: theme("colors.gray.900"),
              marginTop: '2.5em',
              marginBottom: '1em',
            },
            h3: {
              fontFamily: 'sohne, Inter, sans-serif',
              fontSize: '1.5rem',
              fontWeight: "700",
              lineHeight: '1.4',
              letterSpacing: '-0.01em',
              color: theme("colors.gray.900"),
              marginTop: '2em',
              marginBottom: '0.75em',
            },
            "h4,h5,h6": {
              fontFamily: 'sohne, Inter, sans-serif',
              fontWeight: "600",
              letterSpacing: '-0.005em',
              color: theme("colors.gray.900"),
            },
            code: {
              color: theme("colors.gray.800"),
              backgroundColor: theme("colors.gray.100"),
              fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
              fontSize: '0.9em',
              fontWeight: '500',
              paddingLeft: "6px",
              paddingRight: "6px",
              paddingTop: "3px",
              paddingBottom: "3px",
              borderRadius: "0.25rem",
              border: `1px solid ${theme("colors.gray.200")}`,
            },
            "code:before": {
              content: "none",
            },
            "code:after": {
              content: "none",
            },
            pre: {
              fontSize: '0.875rem',
              lineHeight: '1.7',
              marginTop: '2em',
              marginBottom: '2em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              border: 'none',
              padding: '0',
              fontSize: 'inherit',
              fontWeight: '400',
            },
            hr: { 
              borderColor: theme("colors.gray.200"),
              marginTop: '3em',
              marginBottom: '3em',
            },
            "ol li:before": {
              fontWeight: "700",
              color: theme("colors.gray.600"),
            },
            "ul li:before": {
              backgroundColor: theme("colors.gray.600"),
            },
            'li': {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            strong: { 
              color: theme("colors.gray.900"),
              fontWeight: '700',
            },
            em: {
              fontStyle: 'italic',
              color: theme("colors.gray.800"),
            },
            blockquote: {
              fontStyle: 'italic',
              fontSize: '1.125rem',
              lineHeight: '1.75',
              color: theme("colors.gray.800"),
              borderLeftColor: theme("colors.gray.300"),
              borderLeftWidth: '3px',
              paddingLeft: '1.5em',
              marginTop: '2em',
              marginBottom: '2em',
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

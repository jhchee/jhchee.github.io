// const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    // enabled: false,
    content: [
      "./pages/**/*.tsx",
      "./components/**/*.tsx",
      "./layouts/**/*.js",
      "./lib/**/*.js",
    ],
    options: {
      safelist: ["type"], // [type='checkbox']
    },
  },
  theme: {

    extend: {
      spacing: {
        "9/16": "56.25%",
      },
      // fontSize: {
      //   "font-normal": "1rem",
      // },
      
      fontFamily: {
        // sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: colors.neutral,
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
            color: theme("colors.gray.700"),
            a: {
              color: theme("colors.blue.500"),
              "&:hover": {
                color: theme("colors.blue.600"),
              },
              code: { color: theme("colors.blue.400") },
            },
            h1: {
              fontWeight: "800",
              letterSpacing: theme("letterSpacing.tight"),
              color: theme("colors.gray.900"),
            },
            h2: {
              fontWeight: "800",
              letterSpacing: theme("letterSpacing.tight"),
              color: theme("colors.gray.900"),
            },
            h3: {
              fontWeight: "700",
              color: theme("colors.gray.900"),
            },
            "h4,h5,h6": {
              color: theme("colors.gray.900"),
            },
            hr: { borderColor: theme("colors.gray.200") },
            "ol li:before": {
              fontWeight: "600",
              color: theme("colors.gray.500"),
            },
            "ul li:before": {
              backgroundColor: theme("colors.gray.500"),
            },
            strong: { color: theme("colors.gray.600") },
            blockquote: {
              color: theme("colors.gray.900"),
              borderLeftColor: theme("colors.gray.200"),
            },
          },
        },
      }),
    },
  },
  variants: {
    typography: ["dark"],
    extend: {
      translate: ["group-hover"],
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

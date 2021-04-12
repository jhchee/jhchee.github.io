import { useState, useEffect } from "react";
import { useTheme } from 'next-themes'
import { ThemeProvider } from 'next-themes'

import "../styles/global.css";
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'

function MyApp({ Component, pageProps }) {
  const {theme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)

  const toggleTheme = () => {
    console.log(theme);
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-50">
        <div className="bg-gradient-to-br from-green-400 via-cyan-400 to-blue-200 h-1 w-auto"/>
        <Component {...pageProps} theme={theme} toggleTheme={toggleTheme} />
      </div>
    </ThemeProvider>
  );
}

export default MyApp;

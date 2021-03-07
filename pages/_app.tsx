import { useState } from "react";

import "../styles/global.css";
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'

function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={theme}>
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-50">
        <div className="bg-gradient-to-br from-green-400 via-cyan-400 to-blue-200 h-1 w-auto"/>
        <Component {...pageProps} theme={theme} toggleTheme={toggleTheme} />
      </div>
    </div>
  );
}

export default MyApp;

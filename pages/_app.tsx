import { useState, useEffect } from "react";

import "../styles/global.css";
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'

function MyApp({ Component, pageProps }) {

  return (
    <div className="min-h-screen bg-white">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

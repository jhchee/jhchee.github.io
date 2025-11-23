// used for rendering equations (optional)
import "katex/dist/katex.min.css";
import "@/styles/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-white">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

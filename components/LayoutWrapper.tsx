import Head from "next/head";
import Link from "next/link";
import siteMetadata from "@/data/siteMetadata.json";
import Footer from "@/components/Footer";
import headerNavLinks from "@/data/headerNavLinks";

interface LayoutProps {
  // pass across all layout
  home?: boolean;
  children?: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutProps> = ({ children, home }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-6 lg:px-0">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Vincent Chee Jia Hong Blog" />
        <meta name="og:title" content={siteMetadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header>
        <div className="flex items-center justify-between sm:py-12 py-10 ">
          <Link href="/" className="flex items-center justify-between">
            <div className="font-bold md:text-2xl">
              About me
            </div>
          </Link>
          <div className="flex space-x-5 md:space-x-10 md:text-xl">
            {headerNavLinks.map((link) => (
              <div key={link.title}>
                <Link
                  href={link.href}
                  className="font-semibold text-basetext-gray-900 sm:p-4"
                >
                  {link.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </header>
      <main className="mb-auto w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;

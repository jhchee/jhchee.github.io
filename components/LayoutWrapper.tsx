import Head from "next/head";
import Link from "next/link";
import siteMetadata from "@/data/siteMetadata.json";
import Footer from "@/components/Footer";
import headerNavLinks from "@/data/headerNavLinks";

interface LayoutProps {
  // pass across all layout
  home?: boolean;
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
          <Link href="/">
            <a className="flex items-center justify-between">
              <div className="font-bold text-sm md:text-3xl">
                {siteMetadata.author}
              </div>
            </a>
          </Link>
          <div className="flex space-x-5 md:space-x-10 text-xs md:text-xl">
            {headerNavLinks.map((link) => (
              <div key="{link}">
                <Link key={link.title} href={link.href}>
                  <a className="font-semibold text-basetext-gray-900 sm:p-4">{link.title}</a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </header>
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;

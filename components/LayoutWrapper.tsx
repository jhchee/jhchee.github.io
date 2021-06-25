import Head from "next/head";
import Link from "next/link";
import { FaGithub, FaMoon, FaSun, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import siteMetadata from '@/data/siteMetadata.json'
import Footer from "@/components/Footer";
import headerNavLinks from '@/data/headerNavLinks';

interface LayoutProps { // pass across all layout
  home?: boolean;
}

const LayoutWrapper: React.FC<LayoutProps> = ({
  children,
  home,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-6 lg:px-0">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Vincent Chee Jia Hong Blog"
        />
        <meta name="og:title" content={siteMetadata.title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header>
        <div className="flex items-center justify-between sm:py-12 py-10 ">
          <Link href="/">
            <a className="flex items-center justify-between">
              <div className="font-bold xl:text-3xl text-xl">
                {siteMetadata.author}
              </div>
            </a>
          </Link>
          <div className="flex items-center space-x-10 md:space-x-7 text-3xl md:text-2xl">
            <div >
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                >
                  <a className="text-base font-medium text-gray-900 sm:p-4">
                    {link.title}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;

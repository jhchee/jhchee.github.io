import Head from "next/head";
import { getAboutData } from "@/lib/posts";
import LayoutWrapper from "@/components/LayoutWrapper";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import siteMetadata from "@/data/siteMetadata.json";
import { MDXRemote } from "next-mdx-remote";
import MDXComponents from "@/components/MDXComponents";

interface HomeProps {
  source: MDXRemoteSerializeResult;
}

const Home: React.FC<HomeProps> = ({ source }) => {
  return (
    <LayoutWrapper home>
      <Head>
        <title>{siteMetadata.title}</title>
      </Head>
      <article className="grid mt-10">
        <div className="prose text-s md:text-normal md:prose-lg place-self-center tracking-tight">
          <MDXRemote {...source} components={MDXComponents} />
        </div>
      </article>
    </LayoutWrapper>
  );
};

export async function getStaticProps() {
  const aboutData = await getAboutData();
  return {
    props: {
      source: aboutData.source,
    },
  };
}

export default Home;

import Head from "next/head";
import { getAboutData } from "../lib/posts";
import LayoutWrapper from "@/components/LayoutWrapper";
import { MdxRemote } from "next-mdx-remote/types"
import siteMetadata from '@/data/siteMetadata.json'
import hydrate from 'next-mdx-remote/hydrate'
import MDXComponents from '@/components/MDXComponents'

interface HomeProps {
  source: MdxRemote.Source;
}

const Home: React.FC<HomeProps> = ({
  source,
}) => {
  const jsx = hydrate(source, {
    components: MDXComponents,
  });

  return (
    <LayoutWrapper home>
      <Head>
        <title>{siteMetadata.title}</title>
      </Head>
      <article className="grid">
        <div className="pb-8 prose w-4/5 xl:w-3/5 place-self-center">
          {jsx}
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

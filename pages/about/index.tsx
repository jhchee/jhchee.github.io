import Head from "next/head";
import { getAboutData } from "@/lib/posts";
import { MdxRemote } from "next-mdx-remote/types"
import LayoutWrapper from "@/components/LayoutWrapper";
import siteMetadata from '@/data/siteMetadata.json'
import MDXComponents from '@/components/MDXComponents'
import hydrate from 'next-mdx-remote/hydrate'

interface AboutProps {
  source: MdxRemote.Source;
}

const About: React.FC<AboutProps> = ({
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

export default About;

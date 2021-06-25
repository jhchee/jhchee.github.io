import Head from "next/head";
import { getSortedPostsData, PostInfo } from "../lib/posts";
import LayoutWrapper from "@/components/LayoutWrapper";
import PostItems from "@/components/PostItems";
import siteMetadata from '@/data/siteMetadata.json'

interface HomeProps {
  allPostsData: PostInfo[];
}

const NUM_POST_IN_PAGE = 10

const Home: React.FC<HomeProps> = ({
  allPostsData,
}) => {
  return (
    <LayoutWrapper home>
      <Head>
        <title>{siteMetadata.title}</title>
      </Head>
      <section className="divide-y">
        <h2 className="text-3xl sm:text-5xl font-bold mt-10 sm:mt-12">Latest posts</h2>
        <PostItems posts={allPostsData.slice(0, NUM_POST_IN_PAGE)}/>
      </section>
    </LayoutWrapper>
  );
};

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default Home;

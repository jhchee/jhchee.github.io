import Head from "next/head";
import { getSortedPostsBySection, PostInfo } from "@/lib/posts";
import React, { useState } from "react";

import LayoutWrapper from "@/components/LayoutWrapper";
import PostItems from "@/components/PostItems";
import siteMetadata from '@/data/siteMetadata.json'

interface BlogProps {
  allPostsData: PostInfo[];
}


const About: React.FC<BlogProps> = ({
  allPostsData,
}) => {
  const [posts, setPosts] = useState(allPostsData);

  const search = ({target}) => {
    setPosts(allPostsData.filter(post => post.title.includes(target.value)))
  }

  return (
    <LayoutWrapper home>
      <Head>
        <title>{siteMetadata.title}</title>
      </Head>
      <section className="divide-y">
        <h2 className="text-3xl sm:text-5xl font-bold mt-10 sm:mt-12">Blogs</h2>
        <input type="text" onChange={search} /><br/>
        <PostItems posts={posts}/>
      </section>
    </LayoutWrapper>
  );
};

export async function getStaticProps() {
  const allPostsData = getSortedPostsBySection("blog");
  return {
    props: {
      allPostsData,
    },
  };
}

export default About;

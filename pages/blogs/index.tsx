import Head from "next/head";
import { getSortedPostsBySection } from "@/lib/posts";
import { PostInfo, searchPost } from "@/lib/searchPosts";
import React, { useState } from "react";

import LayoutWrapper from "@/components/LayoutWrapper";
import PostItems from "@/components/PostItems";
import siteMetadata from '@/data/siteMetadata.json'

interface BlogProps {
  allPostsData: PostInfo[];
}


const Blog: React.FC<BlogProps> = ({
  allPostsData,
}) => {

  const [posts, setPosts] = useState(allPostsData);

  const search = ({ target }) => {
    const filtered = searchPost(allPostsData, target.value)
    setPosts(filtered)
  }

  return (
    <LayoutWrapper home>
      <Head>
        <title>{siteMetadata.title}</title>
      </Head>
      <section className="divide-y">
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold mt-7 sm:mt-5">Blogs</h2>

          <div className="container flex items-center mt-10">
            <div className="relative">
              <input type="text" className="h-10 w-80 pr-8 pl-5 rounded focus:shadow focus:outline-none focus:ring-blue-400" onChange={search} placeholder="Search anything..." />
              <div className="absolute top-2 right-3"> <i className="fa fa-search text-gray-400 z-20 hover:text-gray-500"></i> </div>
            </div>
          </div>
        </div>

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

export default Blog;

import { getAllPostSlugs, getPostData, PostData } from "../../lib/posts";
import Date from "@/components/Date";
import PageTitle from "@/components/PageTitle";
import LayoutWrapper from "@/components/LayoutWrapper";
import Tag from "@/components/Tag";
import MDXComponents from '@/components/MDXComponents'
import hydrate from 'next-mdx-remote/hydrate'
import React from 'react'

interface PostProps {
  postData: PostData;
}

const Post: React.FC<PostProps> = ({
  postData,
}) => {

  const jsx = hydrate(postData.source, {
    components: MDXComponents,
  });

  return (
    <LayoutWrapper>
      <div className="xl:divide-y xl:divide-gray-200">
        <header className="xl:pb-6">
          <div className="space-y-1 text-center">
            <div>
              <PageTitle>{postData.title}</PageTitle>
            </div>
            <div className="flex flex-wrap space-x-1 justify-center align-middle">
              <Date dateString={postData.date} /><div className="text-base font-medium leading-6 text-gray-500"> · {Math.round(postData.readingTime)} mins</div>
            </div>
            <div className="flex-wrap space-x-2">
              {postData.tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </header>
        <article className="grid">
          <div className="pb-8 prose w-4/5 xl:w-3/5 place-self-center">
            {jsx}
          </div>
        </article>
      </div>
    </LayoutWrapper>
  );
};

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: process.env.node_env === 'development', // set fallback to true during development
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}

export default Post;

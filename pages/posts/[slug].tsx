import { getAllPostSlugs, getPostData, PostData } from "@/lib/posts";
import Date from "@/components/Date";
import DisqusComments from "@/components/DisqusComments";
import PageTitle from "@/components/PageTitle";
import LayoutWrapper from "@/components/LayoutWrapper";
import Tag from "@/components/Tag";
import MDXComponents from "@/components/MDXComponents";
import { MDXRemote } from "next-mdx-remote";
import React from "react";

interface PostProps {
  postData: PostData;
}

const Post: React.FC<PostProps> = ({ postData }) => {
  return (
    <LayoutWrapper>
      <div className="xl:divide-y xl:divide-gray-200">
        <header className="xl:pb-6">
          <div className="space-y-1 md:space-y-5 text-center">
            <div>
              <PageTitle>{postData.title}</PageTitle>
            </div>
            <div className="flex flex-wrap space-x-1 justify-center align-middle">
              <Date dateString={postData.date} />
              <div className="text-base font-medium leading-6 text-gray-500">
                {" "}
                · {Math.round(postData.readingTime)} mins
              </div>
            </div>
            <div className="flex-wrap space-x-4">
              {postData.tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </header>
        <article className="w-full flex justify-center">
          <div className="prose my-10 font-medium text-sm md:text-lg tracking-tight">
            <MDXRemote {...postData.source} components={MDXComponents} />
          </div>
        </article>
        <DisqusComments postData={postData} />
      </div>
    </LayoutWrapper>
  );
};

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: process.env.node_env === "development", // set fallback to true during development
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

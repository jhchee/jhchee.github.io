import { DiscussionEmbed } from "disqus-react";
import { PostData } from "@/lib/posts";
import siteMetadata from '@/data/siteMetadata.json'

export interface DisqusCommentsProps {
  postData: PostData;
}

const DisqusComments: React.FC<DisqusCommentsProps> = ({ postData }) => {
  const disqusShortname = "vincent-chee-github-blog";
  const disqusConfig = {
    url: `${siteMetadata.domain}/posts/${postData.slug}`,
    identifier: postData.id, // Single post id
    title: postData.title, // Single post title
  };
  return (
    <div>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default DisqusComments;

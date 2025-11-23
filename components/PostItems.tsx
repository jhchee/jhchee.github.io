import Tag from "@/components/Tag";
import Date from "@/components/Date";
import Link from "@/components/Link";
import { PostInfo } from "@/lib/searchPosts";

export interface PostItemsProps {
  posts: PostInfo[];
}

const PostItems: React.FC<PostItemsProps> = ({ posts }) => {
  return (
    <ul className="divide-y divide-gray-200 mt-10">
      {!posts.length && (
        <h1 className="text-xl md:text-2xl font-medium leading-normal mt-5">
          No posts found.
        </h1>
      )}
      {posts.map(({ slug, date, title, tags }) => (
        <li key={slug} className="py-10">
          <article className="w-full space-y-4">
            <Date dateString={date} />
            <div className="space-y-5">
              <div>
                <Link href={`/posts/${slug}`} className="group">
                  <h1 className="text-2xl md:text-3xl font-semibold leading-normal mb-1">
                    {title}
                  </h1>
                </Link>
                <div className="flex flex-wrap gap-4 mt-2">
                  {tags.map((tag) => (
                    <Tag key={tag} tag={tag} />
                  ))}
                </div>
              </div>
              <div className="text-base font-medium">
                <Link
                  href={`/posts/${slug}`}
                  className="text-blue-500 hover:text-blue-600"
                  aria-label={`Read "${title}"`}
                >
                  Read more &rarr;
                </Link>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
};

export default PostItems;

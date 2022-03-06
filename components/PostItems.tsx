import Tag from "@/components/Tag";
import Date from "@/components/Date";
import Link from "@/components/Link";
import { PostInfo } from "@/lib/posts";

export interface PostItemsProps {
    posts: PostInfo[]
}

const PostItems: React.FC<PostItemsProps> = ({
    posts
}) => {
    return (
        <ul className="space-y-1 divide-y divide-gray-200 mt-10">
            {!posts.length && 'No posts found.'}
            {posts.map(({ slug, date, title, tags }) => (
                <li key={slug} className="py-10">
                    <article>
                        <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                            <Date dateString={date} />
                            <div className="space-y-5 xl:col-span-3">
                                <div className="space-y-5">
                                    <div>
                                        <Link href={`/posts/${slug}`}>
                                            <a className="sm:w-min group">
                                                <h1 className="sm:w-max max-w-3xl text-2xl md:text-3xl font-medium leading-normal mb-1">
                                                    {title}
                                                </h1>
                                            </a>
                                        </Link>
                                        <div className="flex flex-wrap space-x-4">
                                            {tags.map((tag) => (
                                                <Tag key={tag} tag={tag} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-base font-medium leading-6">
                                        <Link
                                            href={`/posts/${slug}`}
                                            className="text-blue-500 hover:text-blue-600"
                                            aria-label={`Read "${title}"`}
                                        >
                                            Read more &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </li>
            ))}
        </ul>
    )
}

export default PostItems
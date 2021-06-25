import Head from "next/head";
import { getSortedPostsData, PostData } from "../lib/posts";

import LayoutWrapper from "@/components/LayoutWrapper";
import Tag from "@/components/Tag";
import Date from "@/components/Date";
import Link from "@/components/Link";
import siteMetadata from '@/data/siteMetadata.json'

interface HomeProps {
  allPostsData: PostData[];
}

// SETTINGS
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
        <ul className="space-y-1 divide-y divide-gray-200 mt-10">
          {!allPostsData.length && 'No posts found.'}
          {allPostsData.slice(0, NUM_POST_IN_PAGE).map(({ slug, date, title, tags, description }) => (
            <li key={slug} className="py-10">
              <article>
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                  <Date dateString={date} />
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-5">
                      <div>
                        <Link href={`/blogs/${slug}`}>
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
                      <div className="prose text-gray-500 max-w-none">
                        {description}
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blogs/${slug}`}
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

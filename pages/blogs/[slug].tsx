import { getAllPostSlugs, getSortedPostsData, getPostData, PostData } from "../../lib/posts";
import Date from "@/components/Date";
import PageTitle from "@/components/PageTitle";
import LayoutWrapper from "@/components/LayoutWrapper";
import Tag from "@/components/Tag";
import MDXComponents from '@/components/MDXComponents'
import hydrate from 'next-mdx-remote/hydrate'
import Link from 'next/link'
import throttle from 'lodash.throttle'
import React from 'react'

interface PostProps {
  postData: PostData;
  nextPost: PostData;
  previousPost: PostData;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Post: React.FC<PostProps> = ({
  postData,
  theme,
  previousPost,
  nextPost,
  toggleTheme,
}) => {

  const jsx = hydrate(postData.source, {
    components: MDXComponents,
  });
  const [activeSection, setActiveSection] = React.useState(null)

  const throttleMs = 100

  // this scrollspy logic was originally based on
  // https://github.com/Purii/react-use-scrollspy
  const actionSectionScrollSpy = throttle(() => {
    const sections = document.getElementsByClassName('header')

    let prevBBox: DOMRect = null
    let currentSectionId = activeSection

    for (let i = 0; i < sections.length; ++i) {
      const section = sections[i]
      if (!section || !(section instanceof Element)) continue

      if (!currentSectionId) {
        currentSectionId = section.getAttribute('header-ref')
      }
      const bbox = section.getBoundingClientRect()
      const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
      const offset = Math.max(150, prevHeight / 4)

      // GetBoundingClientRect returns values relative to viewport
      if (bbox.top - offset < 0) {
        currentSectionId = section.getAttribute('header-ref')
        prevBBox = bbox
        continue
      }

      // No need to continue loop, if last element has been detected
      break
    }

    setActiveSection(currentSectionId)
  }, throttleMs)

  React.useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)

    actionSectionScrollSpy()

    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])


  return (
    <LayoutWrapper theme={theme} toggleTheme={toggleTheme}>
      <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
        <header className="xl:pb-6">
          <div className="space-y-1 text-center">
            <div>
              <PageTitle>{postData.title}</PageTitle>
            </div>
            <div className="flex flex-wrap space-x-1 justify-center align-middle">
              <Date dateString={postData.date} /><div className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400"> · {Math.round(postData.readingTime)} mins</div>
            </div>
            <div className="flex-wrap space-x-2">
              {postData.tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </header>
        <article>
          <div className="pb-8 pt-10 flex flex-row xl:space-x-7 divide-gray-200 dark:divide-gray-700">
            <div className="pb-8 prose dark:prose-dark max-w-full xl:max-w-none">
              {jsx}
            </div>
            <aside className="hidden xl:block">
              <div className="sticky divide-y divide-gray-200 dark:divide-gray-700  w-0 xl:w-64" style={{ top: '50px' }}>
                <div className="xl:pb-5">
                  <nav className="space-y-2">
                    <p className="text-xs font-bold">ON THIS PAGE</p>
                    <div className="space-y-1">
                      {postData.toc.map((tocItem) => {
                        return (
                          <a
                            key={tocItem.headerRef}
                            href={tocItem.link}
                            className={`block hover:text-gray-900 dark:hover:text-gray-400 ${activeSection === tocItem.headerRef ? 'text-gray-900 dark:text-gray-400' : 'text-gray-500 dark:text-gray-600'}`}
                          >
                            <span
                              className="text-s transform transition-colors duration-200"
                              style={{
                                marginLeft: (tocItem.indentLevel - 1) * 16
                              }}
                            >
                              {tocItem.title}
                            </span>
                          </a>
                        )
                      })}
                    </div>
                  </nav>
                </div>
                {(nextPost || previousPost) && (
                  <div className="xl:block xl:space-y-4 py-5">
                    {previousPost && (
                      <div>
                        <h2 className="text-xs tracking-wide font-bold">
                          Previous article
                        </h2>
                        <div className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                          <Link href={`/blogs/${previousPost.slug}`}>{previousPost.title}</Link>
                        </div>
                      </div>
                    )}
                    {nextPost && (
                      <div>
                        <h2 className="text-xs tracking-wide font-bold">
                          Next article
                          </h2>
                        <div className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400">
                          <Link href={`/blogs/${nextPost.slug}`}>{nextPost.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="py-5">
                  <Link href="/">
                    <a className="text-s text-blue-500 hover:text-blue-600">
                      ← Back
                  </a>
                  </Link>
                </div>
              </div>
            </aside>
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
  const allPostsData = getSortedPostsData();
  const postData = await getPostData(params.slug);
  const postIndex = allPostsData.findIndex((post) => post.slug === params.slug)
  const previousPost = allPostsData[postIndex + 1] || null
  const nextPost = allPostsData[postIndex - 1] || null
  return {
    props: {
      postData,
      previousPost,
      nextPost
    },
  };
}

export default Post;

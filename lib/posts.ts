import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from 'reading-time'
import visit from 'unist-util-visit'
import renderToString from 'next-mdx-remote/render-to-string'
import MDXComponents from '../components/MDXComponents'
import imgToJsx from './img_to_jsx'
import { MdxRemote } from "next-mdx-remote/types";
import allPostInfo from '@/data/search.json'

const contentDirectory = path.join(process.cwd(), "content");

export interface PostData {
  readingTime: number;
  slug: string;
  date: string;
  description: string;
  tags: Array<string>;
  title: string;
  id: string;
  source: MdxRemote.Source;
}

// without source
export interface PostInfo {
  slug: string;
  date: string;
  tags: Array<string>;
  title: string;
  section: string;
}

// search post by its title, tags
export function searchPost(allPostsInfo: PostInfo[], keyword: string) {
  keyword = keyword.toLowerCase()
  const result = allPostsInfo.filter(post =>
    post.title.toLowerCase().includes(keyword) ||
    post.tags.some(tag => tag.toLowerCase().includes(keyword))
  )
  return result
}

export function getSortedPostsBySection(section: string) {
  // Sort posts by date
  return allPostInfo.filter(post => post.section == section).sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  return allPostInfo.filter((post) => post.section == 'blog' || post.section == 'project').map((post) => {
    return {
      params: {
        slug: post.slug
      }
    }
  });
}

const tokenClassNames = {
  tag: 'text-code-red',
  'attr-name': 'text-code-yellow',
  'attr-value': 'text-code-green',
  deleted: 'text-code-red',
  inserted: 'text-code-green',
  punctuation: 'text-code-white',
  keyword: 'text-code-purple',
  string: 'text-code-green',
  function: 'text-code-blue',
  boolean: 'text-code-red',
  comment: 'text-gray-400',
};

export async function getPostData(slug) {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require('remark-math'),
        imgToJsx,
      ],
      rehypePlugins: [
        require('rehype-katex'),
        [require('@mapbox/rehype-prism'), { ignoreMissing: true }],
        // () => {
        //   return (tree) => {
        //     visit(tree, 'element', (node, index, parent) => {
        //       let [token, type] = node.properties.className || []
        //       if (token === 'token') {
        //         node.properties.className = [tokenClassNames[type]]
        //       }
        //     })
        //   }
        // },
      ],
    },
  })

  return {
    slug: slug,
    source: mdxSource,
    wordCount: content.split(/\s+/gu).length,
    readingTime: Math.round(readingTime(content).minutes),
    ...data,
  };
}

export async function getAboutData() {
  const fullPath = path.join(contentDirectory, "about.md");

  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require('remark-math'),
        imgToJsx,
      ],
      rehypePlugins: [
        require('rehype-katex'),
        require('@mapbox/rehype-prism'),
        () => {
          return (tree) => {
            visit(tree, 'element', (node, index, parent) => {
              let [token, type] = node.properties.className || []
              if (token === 'token') {
                node.properties.className = [tokenClassNames[type]]
              }
            })
          }
        },
      ],
    },
  })

  return {
    source: mdxSource,
  };
}

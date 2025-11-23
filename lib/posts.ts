import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from 'reading-time'
import { visit } from 'unist-util-visit'
import { serialize } from 'next-mdx-remote/serialize'
import MDXComponents from '../components/MDXComponents'
import imgToJsx from './img_to_jsx'
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import allPostInfo from '@/data/search.json'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'

const contentDirectory = path.join(process.cwd(), "content");

export interface PostData {
  readingTime: number;
  slug: string;
  date: string;
  description: string;
  tags: Array<string>;
  title: string;
  id: string;
  source: MDXRemoteSerializeResult;
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

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkMath,
        imgToJsx,
      ],
      rehypePlugins: [
        rehypeKatex,
        [rehypePrettyCode as any, {
          theme: 'github-dark',
          keepBackground: true,
        }],
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

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkMath,
        imgToJsx,
      ],
      rehypePlugins: [
        rehypeKatex,
        [rehypePrettyCode as any, {
          theme: 'github-dark',
          keepBackground: true,
        }],
      ],
    },
  })

  return {
    source: mdxSource,
  };
}

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

const postsDirectory = path.join(process.cwd(), "content/post");
const aboutDirectory = path.join(process.cwd(), "content/about");

export interface PostData {
  readingTime: number;
  slug: string;
  date: string;
  description: string;
  tags: Array<string>;
  title: string;
  source: MdxRemote.Source;
}

// without source
export interface PostInfo {
  slug: string;
  date: string;
  description: string;
  tags: Array<string>;
  title: string;
  section: string;
}

// search post by its keyword, tags or description
export function searchPost(allPostsInfo: PostInfo[], keyword: string) {
  console.log(keyword)
  const result = allPostsInfo.filter(post =>
    post.title.toLowerCase().includes(keyword) || 
    post.tags.some(tag => tag.toLowerCase().includes(keyword)) || 
    post.description.toLowerCase().includes(keyword)
  )
  return result
}

export function getSortedPostsData() {
  // Sort posts by date
  return allPostInfo.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
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
  return allPostInfo.map((post) => {
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
  comment: 'text-gray-400 italic',
};

const headerTag = ['h1', 'h2', 'h3'];


export async function getPostData(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  const toc = [];
  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require('remark-slug'),
        require('remark-autolink-headings'), // must be included after `remark-slug`.
        require('remark-code-titles'),
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
        () => {
          return (tree) => { // this block requires remark autolink headings to work
            var count = 0;
            visit(tree, 'element', (node, index, parent) => {
              let tagName = node.tagName;
              let hType = headerTag.indexOf(tagName);
              if (hType != -1) {
                node.properties.className = "header"
                const headerRef = "h_" + count;
                const title = node.children[1].value;
                node.properties["header-ref"] = headerRef;
                count++;
                let link = node.children[0].properties.href;
                toc.push({ indentLevel: hType + 1, link: link, headerRef: headerRef, title: title });
              }
            })
          }
        },
      ],
    },
  })

  return {
    toc: toc,
    slug: slug,
    source: mdxSource,
    wordCount: content.split(/\s+/gu).length,
    readingTime: Math.round(readingTime(content).minutes),
    ...data,
  };
}

export async function getAboutData() {
  const fullPath = path.join(aboutDirectory, "about.md");
console.log(fullPath)
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  const mdxSource = await renderToString(content, {
    components: MDXComponents,
    mdxOptions: {
      remarkPlugins: [
        require('remark-slug'),
        require('remark-autolink-headings'), // must be included after `remark-slug`.
        require('remark-code-titles'),
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

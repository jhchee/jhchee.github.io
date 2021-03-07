import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from 'reading-time'
import visit from 'unist-util-visit'
import renderToString from 'next-mdx-remote/render-to-string'
import MDXComponents from '../components/MDXComponents'
import imgToJsx from './img_to_jsx'
import { MdxRemote } from "next-mdx-remote/types";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface PostData {
  readingTime: number;
  toc: Array<TOCComponent>;
  slug: string;
  date: string;
  description: string;
  tags: Array<string>;
  title: string;
  source: MdxRemote.Source;
}
export interface TOCComponent {
  title: string;
  indentLevel: number;
  link: string;
  headerRef: string;
}

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  var allPostsData: PostData[] = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const slug = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      slug: slug,
      ...matterResult.data,
    } as PostData;
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ""),
      },
    };
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
                count ++; 
                let link = node.children[0].properties.href;
                toc.push({indentLevel:hType+1, link:link, headerRef: headerRef, title: title});
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


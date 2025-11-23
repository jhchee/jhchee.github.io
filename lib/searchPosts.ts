// Client-safe utility for searching posts
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

import Link from 'next/link'
export default function Tag({ tag }: { tag: string }) {
  return (
    //   <Link href={`/tags/${tag}`}>
    //   <a className="text-sm font-medium text-blue-500 uppercase hover:text-blue-600 dark:hover:text-blue-400">
    //     {tag}
    //   </span>
    // </Link>
    <span className="text-sm font-medium text-blue-500 uppercase hover:text-blue-600">
      {tag}
    </span>
  )
}

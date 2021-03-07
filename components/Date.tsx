import { parseISO, format } from "date-fns";

export default function Date({ dateString }: { dateString: string }) {
  const date = parseISO(dateString);
  // return <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>;

  return (
    <dl>
      <dt className="sr-only">Published on</dt>
      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
        <time dateTime={dateString}>{format(date, "LLLL d, yyyy")}</time>
      </dd>
    </dl>
  );
}

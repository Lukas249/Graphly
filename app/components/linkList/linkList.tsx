import Link from "next/link";
import { linkTemplates } from "./linkTemplates";
import { LinkType, NavItem } from "./types";

export function LinkList({
  links,
  prefetch = false,
  slugPrefix,
  linkType,
}: {
  links: NavItem[];
  prefetch: boolean;
  slugPrefix: string;
  linkType: LinkType;
}) {
  return links.map((value) => {
    return (
      <Link
        key={value.title}
        href={slugPrefix + value.slug}
        prefetch={prefetch}
        className="cursor-pointer"
      >
        <div className="bg-gray-dark hover:border-primary my-2 flex h-10 items-center justify-between rounded-lg px-4 hover:border-2">
          {linkTemplates[linkType](value as any)}
        </div>
      </Link>
    );
  });
}

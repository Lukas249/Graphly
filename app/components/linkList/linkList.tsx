import Link from "next/link";
import { linkTemplates } from "./linkTemplates";
import { ArticleNavItem } from "@/app/lib/articles/types";
import { ProblemNavItem } from "@/app/lib/problems/types";
import { VisualizationNavItem } from "@/app/lib/visualizations/types";

type BaseLinkListProps = {
  prefetch?: boolean;
  slugPrefix: string;
};

type ArticleLinkListProps = BaseLinkListProps & {
  links: ArticleNavItem[];
  linkType: "learn";
};

type VisualizationLinkListProps = BaseLinkListProps & {
  links: VisualizationNavItem[];
  linkType: "visualize";
};

type ProblemLinkListProps = BaseLinkListProps & {
  links: ProblemNavItem[];
  linkType: "solve";
};

type LinkListProps =
  | ArticleLinkListProps
  | VisualizationLinkListProps
  | ProblemLinkListProps;

const linkTemplate = (
  linkType: "learn" | "visualize" | "solve",
  links: ArticleNavItem | VisualizationNavItem | ProblemNavItem,
) => {
  if (linkType === "learn") {
    return linkTemplates.learn(links);
  } else if (linkType === "visualize") {
    return linkTemplates.visualize(links);
  } else if (linkType === "solve" && "difficulty" in links) {
    return linkTemplates.solve(links);
  }
};

export function LinkList(props: LinkListProps) {
  const { prefetch = false, slugPrefix } = props;

  return props.links.map((value) => (
    <Link
      key={value.title}
      href={slugPrefix + value.slug}
      prefetch={prefetch}
      className="cursor-pointer"
    >
      <div className="bg-gray-dark hover:border-primary my-2 flex h-10 items-center justify-between rounded-lg px-4 hover:border-2">
        {linkTemplate(props.linkType, value)}
      </div>
    </Link>
  ));
}

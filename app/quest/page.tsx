import Link from "next/link";
import Menu from "@/app/menu";
import { getArticleBySlug } from "@/app/services/articlesService";
import {
  getVisualizationBySlug,
  getVisualizationChallengeBySlug,
} from "@/app/services/visualizationsService";

import "./quest.css";

import {
  getProblemBySlug,
  getProblemChallengeBySlug,
} from "../services/problemsService";
import {
  QuestContentData,
  QuestItemData,
  QuestStep,
  QuestTrack,
} from "./quest.types";
import { QUEST_PLAN } from "./questPlan";

function buildTracks(contentData: QuestContentData): QuestTrack[] {
  return QUEST_PLAN.map((topic, index) => {
    const contents = [
      contentData[topic.id]?.articles,
      contentData[topic.id]?.visualizations,
      contentData[topic.id]?.visualizationChallenges,
      contentData[topic.id]?.problemChallenges,
      contentData[topic.id]?.problems,
    ];

    const steps: QuestStep[] = [];

    for (let i = 0; i < contents.length; i++) {
      const stepData = contents[i];

      for (let j = 0; j < stepData?.data.length; j++) {
        const item = stepData.data[j];

        steps.push({
          id: crypto.randomUUID(),
          label: `${stepData.titlePrefix}: ${item.title}`,
          href: `${stepData.slugPrefix}/${item.slug}`,
        });
      }
    }

    if (index < QUEST_PLAN.length - 1) {
      steps.push({
        id: `${topic.id}-next-topic`,
        label: `Next Topic: ${QUEST_PLAN[index + 1].label}`,
        href: `#quest-${QUEST_PLAN[index + 1].id}`,
      });
    }

    return {
      id: topic.id,
      label: topic.label,
      steps,
    };
  });
}

async function fetchBySlugs(
  slugs: string[],
  fetcher: (slug: string) => Promise<QuestItemData>,
): Promise<QuestItemData[]> {
  const results = await Promise.allSettled(slugs.map((slug) => fetcher(slug)));
  const items: QuestItemData[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(result.value);
    }
  }

  return items;
}

export default async function QuestPage() {
  const contentData: QuestContentData = {};

  for (const topic of QUEST_PLAN) {
    const articleSlugs = topic.articleCandidates;
    const visualizationSlugs = topic.visualizationCandidates;
    const visualizationChallengeSlugs = topic.visualizationChallengeCandidates;
    const problemsSlugs = topic.problemCandidates;
    const problemChallengesSlugs = topic.problemChallengeCandidates;

    const [
      articles,
      visualizations,
      visualizationChallenges,
      problems,
      problemChallenges,
    ] = await Promise.all([
      fetchBySlugs(articleSlugs, (slug) =>
        getArticleBySlug(slug, { id: true, title: true, slug: true }),
      ),
      fetchBySlugs(visualizationSlugs, (slug) =>
        getVisualizationBySlug(slug, { id: true, title: true, slug: true }),
      ),
      fetchBySlugs(visualizationChallengeSlugs, (slug) =>
        getVisualizationChallengeBySlug(slug, {
          id: true,
          title: true,
          slug: true,
        }),
      ),
      fetchBySlugs(problemsSlugs, (slug) =>
        getProblemBySlug(slug, { id: true, title: true, slug: true }),
      ),
      fetchBySlugs(problemChallengesSlugs, (slug) =>
        getProblemChallengeBySlug(slug, { id: true, title: true, slug: true }),
      ),
    ]);

    contentData[topic.id] = {
      articles: {
        slugPrefix: "/learn",
        titlePrefix: "Article",
        data: articles,
      },
      visualizations: {
        slugPrefix: "/visualize",
        titlePrefix: "Visualization",
        data: visualizations,
      },
      visualizationChallenges: {
        slugPrefix: "/visualize/challenge",
        titlePrefix: "Visualization Challenge",
        data: visualizationChallenges,
      },
      problemChallenges: {
        slugPrefix: "/solve/challenge",
        titlePrefix: "Problem Challenge",
        data: problemChallenges,
      },
      problems: {
        slugPrefix: "/solve",
        titlePrefix: "Problem",
        data: problems,
      },
    };
  }

  const tracks = buildTracks(contentData);

  return (
    <div className="min-h-screen">
      <Menu />
      <div className="quest-shell">
        <section className="quest-header">
          <h1 className="text-3xl font-semibold">Quest</h1>
          <p className="mt-2 text-white/75">
            A learning path that starts with an article, moves on to challenges
            and visualisations, and ends with solving your first problem. Your
            journey starts with DFS, and from there the path leads on to further
            topics.
          </p>
        </section>

        {tracks.map((track) => (
          <section
            id={`quest-${track.id}`}
            key={track.id}
            className="quest-track"
          >
            <h2 className="quest-track-title">{track.label}</h2>

            {track.steps.map((step) => (
              <div key={step.id}>
                <Link className="quest-link" href={step.href} prefetch={false}>
                  <div key={step.id} className="quest-step">
                    <p className="quest-step-title">{step.label}</p>
                  </div>
                </Link>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

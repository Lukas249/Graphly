export type QuestItemData = {
  id: number;
  title: string;
  slug: string;
};

export type QuestContentData = {
  [topicId: string]: {
    [contentTypeId: string]: {
      slugPrefix: string;
      titlePrefix: string;
      data: QuestItemData[];
    };
  };
};

export type QuestPlan = {
  id: string;
  label: string;
  articleCandidates: string[];
  visualizationCandidates: string[];
  visualizationChallengeCandidates: string[];
  problemChallengeCandidates: string[];
  problemCandidates: string[];
};

export type QuestStep = {
  id: string;
  label: string;
  href: string;
};

export type QuestTrack = {
  id: string;
  label: string;
  steps: QuestStep[];
};

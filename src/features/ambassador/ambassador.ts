export type StudentMatch = {
  id: string;
  fullName: string;
  country: string;
  intendedMajor: string;
  interests: string[];
  avatarUrl: string;
};

export type AmbassadorHeaderData = {
  fullName: string | null;
  major: string | null;
  interests: string[];
};

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: "research" | "club" | "internship" | "event" | "campus_job";
  audience: "all" | "explorer" | "applicant" | "admitted" | "current_wildcat";
  region?: string;
  link?: string;
  tags: string[];
  isActive: boolean;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  level: "explorer" | "applicant" | "admitted" | "current_wildcat";
  estimatedMinutes: number;
  xpReward: number;
  tags: string[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  minXpRequired: number;
  category: "onboarding" | "quests" | "community" | "milestones";
  isActive: boolean;
};
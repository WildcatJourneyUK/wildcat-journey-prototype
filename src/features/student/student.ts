export const STUDENT_LEVELS = [
  "explorer",
  "applicant",
  "admitted",
  "current_wildcat",
] as const;

export type StudentLevel = (typeof STUDENT_LEVELS)[number];

export type AmbassadorCard = {
  id: string;
  fullName: string;
  major: string;
  minors: string[];
  interests: string[];
  languages: string[];
  avatarUrl: string;
};

export type Quest = {
  id: string;
  title: string;
  level: StudentLevel;
  xpReward: number;
  explanation: string;
  steps: string[];
  videoUrl?: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  };
  checklist: { id: string; label: string }[];
};

export type Opportunity = {
  id: string;
  title: string;
  type: "research" | "club" | "internship" | "event" | "campus_job";
  description: string;
  link?: string;
  tags: string[];
};
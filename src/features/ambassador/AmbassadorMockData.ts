import type { Badge, Opportunity, Quest, StudentMatch } from "./ambassador";

export const matchesMock: StudentMatch[] = [
  {
    id: "s1",
    fullName: "Camila Rodríguez",
    country: "Colombia",
    intendedMajor: "Biology",
    interests: ["Research", "Pre-med", "Campus jobs"],
    avatarUrl: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: "s2",
    fullName: "Aisha Khan",
    country: "Pakistan",
    intendedMajor: "Computer Science",
    interests: ["AI", "Research", "Entrepreneurship"],
    avatarUrl: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: "s3",
    fullName: "Thiago Almeida",
    country: "Brazil",
    intendedMajor: "Mechanical Engineering",
    interests: ["Robotics", "Research", "Internships"],
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "s4",
    fullName: "Mina Sato",
    country: "Japan",
    intendedMajor: "Computer Science",
    interests: ["Lab", "Student orgs", "Research"],
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  },
];

export const initialQuests: Quest[] = [
  {
    id: "q1",
    title: "Complete Your Profile",
    description:
      "Fill in your academic background, interests, and languages to unlock personalized quests and mentorship matching.",
    level: "explorer",
    estimatedMinutes: 5,
    xpReward: 100,
    tags: ["onboarding", "profile"],
  },
  {
    id: "q2",
    title: "Explore UK Programs & Majors",
    description:
      "Review your intended major, explore related programs, and bookmark questions to ask an advisor.",
    level: "applicant",
    estimatedMinutes: 20,
    xpReward: 150,
    tags: ["academics", "planning"],
  },
];

export const initialBadges: Badge[] = [
  {
    id: "profile_complete",
    name: "Profile Complete",
    description: "Completed the onboarding profile.",
    xpReward: 50,
    minXpRequired: 0,
    category: "onboarding",
    isActive: true,
  },
  {
    id: "xp_500",
    name: "Getting Started",
    description: "Reached 500 XP.",
    xpReward: 100,
    minXpRequired: 500,
    category: "milestones",
    isActive: true,
  },
];

export const initialOpportunities: Opportunity[] = [
  {
    id: "o1",
    title: "Undergraduate Research Open House",
    description:
      "Meet faculty and learn how international students can join research groups on campus.",
    type: "research",
    audience: "current_wildcat",
    link: "",
    tags: ["research", "networking"],
    isActive: true,
  },
  {
    id: "o2",
    title: "International Student Club Fair",
    description:
      "Explore cultural organizations and student-led communities. Great for building your network.",
    type: "event",
    audience: "admitted",
    link: "",
    tags: ["community", "clubs"],
    isActive: true,
  },
];
import type { AmbassadorCard, Opportunity, Quest } from "./student";

export const ambassadorMatchesMock: AmbassadorCard[] = [
  {
    id: "a1",
    fullName: "Sofia Ramos",
    major: "Biology",
    minors: ["Public Health"],
    interests: ["Pre-med", "Research", "Student life"],
    languages: ["Spanish", "English"],
    avatarUrl: "https://i.pravatar.cc/150?img=23",
  },
  {
    id: "a2",
    fullName: "Diego Rodriguez",
    major: "Computer Science",
    minors: ["Entrepreneurship"],
    interests: ["Hackathons", "AI", "Career prep"],
    languages: ["Spanish", "English"],
    avatarUrl: "https://i.pravatar.cc/150?img=53",
  },
  {
    id: "a3",
    fullName: "Alice Branco",
    major: "Business",
    minors: ["Marketing"],
    interests: ["Leadership", "Campus involvement", "Internships"],
    languages: ["Portuguese", "English"],
    avatarUrl: "https://i.pravatar.cc/150?img=44",
  },
];

export const availableQuestsMock: Quest[] = [
  {
    id: "q1",
    title: "Complete your onboarding profile",
    level: "explorer",
    xpReward: 100,
    explanation:
      "A complete profile helps personalize your quests and mentorship match.",
    steps: [
      "Add your intended major (free text).",
      "Select your interests and languages.",
      "Confirm your country and education level.",
      "Save and review your dashboard updates.",
    ],
    videoUrl: "https://www.youtube.com/embed/y6wlOGLDI6c?si=CvRuGlNuLp_IyLkt",
    quiz: {
      question: "Why does the platform ask for your interests and languages?",
      options: [
        "To personalize quests and mentorship matches",
        "To show ads",
        "To limit what you can access",
        "Just for decoration",
      ],
      correctIndex: 0,
    },
    checklist: [
      { id: "c1", label: "Added intended major" },
      { id: "c2", label: "Selected interests" },
      { id: "c3", label: "Selected languages" },
      { id: "c4", label: "Saved profile" },
    ],
  },
  {
    id: "q2",
    title: "Build your UK question list",
    level: "explorer",
    xpReward: 120,
    explanation:
      "Create a short, specific list of questions to ask during info sessions or to your ambassador.",
    steps: [
      "Write 2 academic questions.",
      "Write 2 campus-life questions.",
      "Write 1 logistics question.",
      "Save your list.",
    ],
    videoUrl: "https://www.youtube.com/embed/y6wlOGLDI6c?si=CvRuGlNuLp_IyLkt",
    quiz: {
      question: "Which question is the most specific and useful?",
      options: [
        "Is UK good?",
        "What clubs are there?",
        "How can international students join research in the first year?",
        "Do you like it?",
      ],
      correctIndex: 2,
    },
    checklist: [
      { id: "c1", label: "2 academic questions" },
      { id: "c2", label: "2 campus-life questions" },
      { id: "c3", label: "1 logistics question" },
      { id: "c4", label: "Saved your list" },
    ],
  },
  {
    id: "q3",
    title: "Explore programs connected to your intended major",
    level: "applicant",
    xpReward: 150,
    explanation:
      "Connect your interests to specific programs and opportunities at UK.",
    steps: [
      "Search for 2 departments/labs related to your major.",
      "List 2 opportunities you’d like to ask about.",
      "Save your notes to your profile.",
    ],
    videoUrl: "https://www.youtube.com/embed/y6wlOGLDI6c?si=CvRuGlNuLp_IyLkt",
    quiz: {
      question: "What is the goal of exploring programs early?",
      options: [
        "To prepare specific questions and goals",
        "To skip application steps",
        "To avoid meeting people",
        "To replace studying",
      ],
      correctIndex: 0,
    },
    checklist: [
      { id: "c1", label: "Found 2 departments/labs" },
      { id: "c2", label: "Listed 2 opportunities" },
      { id: "c3", label: "Saved notes" },
    ],
  },
  {
    id: "q4",
    title: "Plan your first-week checklist",
    level: "admitted",
    xpReward: 200,
    explanation:
      "Turn the transition into a clear plan with a checklist for your first week.",
    steps: [
      "Add arrival essentials (documents, ID).",
      "Add campus setup (student ID, portals).",
      "Add 2 community steps (club fair, meetups).",
      "Review it once.",
    ],
    videoUrl: "https://www.youtube.com/embed/y6wlOGLDI6c?si=CvRuGlNuLp_IyLkt",
    quiz: {
      question: "What’s the main benefit of a first-week checklist?",
      options: [
        "It makes the process structured and manageable",
        "It guarantees scholarships",
        "It skips orientation",
        "It replaces studying",
      ],
      correctIndex: 0,
    },
    checklist: [
      { id: "c1", label: "Arrival essentials listed" },
      { id: "c2", label: "Campus setup listed" },
      { id: "c3", label: "2 community steps added" },
      { id: "c4", label: "Reviewed the checklist" },
    ],
  },
  {
    id: "q5",
    title: "Prepare your mentorship message",
    level: "admitted",
    xpReward: 180,
    explanation:
      "Write a short, clear message introducing yourself and your goals to your ambassador.",
    steps: [
      "Introduce yourself in 2 lines.",
      "Share your intended major and 2 interests.",
      "Ask 1 specific question.",
      "Send it.",
    ],
    videoUrl: "https://www.youtube.com/embed/y6wlOGLDI6c?si=CvRuGlNuLp_IyLkt",
    quiz: {
      question: "A strong first message should be…",
      options: [
        "Short, specific, and friendly",
        "Very long and vague",
        "Only emojis",
        "Only one-word questions",
      ],
      correctIndex: 0,
    },
    checklist: [
      { id: "c1", label: "Wrote intro" },
      { id: "c2", label: "Added major + interests" },
      { id: "c3", label: "Added 1 specific question" },
      { id: "c4", label: "Sent message" },
    ],
  },
];

export const opportunityMatchesMock: Opportunity[] = [
  {
    id: "o1",
    title: "Undergraduate Research Open House",
    type: "research",
    description:
      "Meet faculty and learn how to join research groups on campus.",
    tags: ["research", "networking"],
  },
  {
    id: "o2",
    title: "International Student Club Fair",
    type: "event",
    description:
      "Explore cultural organizations and student-led communities.",
    tags: ["community", "clubs"],
  },
  {
    id: "o3",
    title: "On-campus Job Info Session",
    type: "campus_job",
    description: "Learn about campus jobs, eligibility, and how to apply.",
    tags: ["career", "campus jobs"],
  },
];
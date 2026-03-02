import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import Loading from "../../components/Loading";
import { getUser } from "../../services/AuthProvider";
import { ProfileService } from "../../services/ProfileService";

const STUDENT_LEVELS = ["explorer", "applicant", "admitted", "current_wildcat"] as const;
type StudentLevel = (typeof STUDENT_LEVELS)[number];

type AmbassadorCard = {
  id: string;
  fullName: string;
  major: string;
  minors: string[];
  interests: string[];
  languages: string[];
  avatarUrl: string;
};

type Quest = {
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

type Opportunity = {
  id: string;
  title: string;
  type: "research" | "club" | "internship" | "event" | "campus_job";
  description: string;
  link?: string;
  tags: string[];
};

function levelLabel(level: StudentLevel) {
  if (level === "explorer") return "Explorer";
  if (level === "applicant") return "Applicant";
  if (level === "admitted") return "Admitted";
  return "Current Wildcat";
}

function chip(text: string) {
  return (
    <span
      key={text}
      className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs"
    >
      {text}
    </span>
  );
}

function percent(done: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}

function normalizeStudentLevel(value: unknown): StudentLevel {
  const v = String(value ?? "");
  if (v === "explorer" || v === "applicant" || v === "admitted" || v === "current_wildcat") return v;
  return "explorer";
}

function levelIndex(level: StudentLevel) {
  // ✅ now STUDENT_LEVELS is used as a value, so eslint warning disappears
  return STUDENT_LEVELS.indexOf(level);
}

export default function StudentDashboard() {
  const nav = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [studentLevel, setStudentLevel] = useState<StudentLevel>("explorer");
  const [xp, setXp] = useState<number>(0);
  const [major, setMajor] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);

  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [checklistDone, setChecklistDone] = useState<Record<string, boolean>>({});

  // lock body scroll when modal open (optional but helps)
  useEffect(() => {
    if (!activeQuest) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeQuest]);

  // Load user + bundle
  useEffect(() => {
    (async () => {
      try {
        const u = await getUser();
        setUser(u);

        if (!u) return;

        const bundle = await ProfileService.getBundle(u);

        if (bundle.role !== "student") {
          nav("/dashboard", { replace: true });
          return;
        }

        const student = bundle.student;

        setOnboardingComplete(Boolean(student?.onboarding_completed));
        setStudentLevel(normalizeStudentLevel(student?.level));
        setXp(Number(student?.xp ?? 0));
        setMajor(student?.intended_major ?? null);
        setInterests(student?.interests ?? []);

        // mock badges for now (replace later with student_badges)
        setBadges(student?.onboarding_completed ? ["Profile Complete"] : []);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Something went wrong";
        console.error("StudentDashboard load error:", msg);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [nav]);

  // Reset quest UI when opening/closing
  useEffect(() => {
    if (!activeQuest) {
      setQuizAnswer(null);
      setChecklistDone({});
      return;
    }
    setQuizAnswer(null);
    setChecklistDone({});
  }, [activeQuest]);

  const ambassadorMatches: AmbassadorCard[] = useMemo(
    () => [
      {
        id: "a1",
        fullName: "Sofia Gomez",
        major: "Biology",
        minors: ["Public Health"],
        interests: ["Pre-med", "Research", "Student life"],
        languages: ["Spanish", "English"],
        avatarUrl: "https://i.pravatar.cc/150?img=14",
      },
      {
        id: "a2",
        fullName: "Diego Marroquin",
        major: "Computer Science",
        minors: ["Entrepreneurship"],
        interests: ["Hackathons", "AI", "Career prep"],
        languages: ["Spanish", "English"],
        avatarUrl: "https://i.pravatar.cc/150?img=52",
      },
      {
        id: "a3",
        fullName: "Fabiola Cadenas",
        major: "Business",
        minors: ["Marketing"],
        interests: ["Leadership", "Campus involvement", "Internships"],
        languages: ["Spanish", "English"],
        avatarUrl: "https://i.pravatar.cc/150?img=44",
      },
    ],
    []
  );

  const availableQuests: Quest[] = useMemo(
    () => [
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
    ],
    []
  );

  const orderedQuests = useMemo(() => {
    return [...availableQuests].sort(
      (a, b) => levelIndex(a.level) - levelIndex(b.level)
    );
  }, [availableQuests]);

  const opportunityMatches: Opportunity[] = useMemo(
    () => [
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
        description:
          "Learn about campus jobs, eligibility, and how to apply.",
        tags: ["career", "campus jobs"],
      },
    ],
    []
  );

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ?? "Student";

  const checklistTotal = activeQuest?.checklist.length ?? 0;
  const checklistCompleted = activeQuest
    ? activeQuest.checklist.filter((c) => checklistDone[c.id]).length
    : 0;
  const progress = percent(checklistCompleted, checklistTotal);

  const quizCorrect =
    activeQuest && quizAnswer !== null
      ? quizAnswer === activeQuest.quiz.correctIndex
      : null;

  if (loading) return <Loading />;
  if (!user) return <div className="mainContent p-6">No user found</div>;

  return (
    <div className="mainContent bg-[url('/speckled-texture-bg.png')] bg-cover bg-center">
      <div className="mx-auto w-full max-w-6xl p-6">
        {/* Header */}
        <div className="rounded-2xl border border-primary bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-primary">
                Welcome, {fullName.split(" ")[0]}!
              </h1>

              {onboardingComplete ? (
                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-3 py-1">
                      Level: <span className="font-semibold">{levelLabel(studentLevel)}</span>
                    </span>
                    <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-3 py-1">
                      XP: <span className="font-semibold">{xp}</span>
                    </span>
                  </div>

                  {major ? (
                    <p className="text-black/80">
                      <span className="font-semibold text-primary">Intended major:</span>{" "}
                      {major}
                    </p>
                  ) : null}

                  {interests.length > 0 ? (
                    <div>
                      <p className="text-sm text-black/60">Interests</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {interests.map((i) => chip(i))}
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-sm text-black/60">Badges</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {badges.length > 0 ? badges.map((b) => chip(b)) : <span className="text-black/50">—</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-black/70">
                  Complete your profile to unlock mentorship matching and your quest board.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                className="rounded-xl border border-black/10 bg-white px-4 py-2 hover:opacity-80 transition"
                onClick={() => nav("/profile")}
              >
                Profile
              </button>
            </div>
          </div>

          {!onboardingComplete && (
            <div className="mt-6 rounded-2xl border border-black/10 bg-[#d9edf8] p-4 text-primary">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="font-semibold">
                  Complete your profile to unlock your personalized journey!
                </p>
                <button
                  className="rounded-2xl bg-primary px-6 py-3 text-white hover:bg-secondary transition"
                  onClick={() => nav("/profile")}
                >
                  Go to Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mentorship Matches (only if onboarding complete) */}
        {onboardingComplete && (
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-xl font-semibold text-primary">Mentorship Matches</h2>
            <p className="text-sm text-black/70 mt-1">
              Suggested ambassadors based on your profile.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ambassadorMatches.map((a) => (
                <div key={a.id} className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={a.avatarUrl}
                      alt={a.fullName}
                      className="h-12 w-12 rounded-full border border-black/10 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-primary truncate">{a.fullName}</p>
                      <p className="text-sm text-black/60">{a.major}</p>
                      {a.minors.length > 0 ? (
                        <p className="text-xs text-black/50">Minors: {a.minors.join(", ")}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-black/60">Interests</p>
                    <div className="mt-1 flex flex-wrap gap-2">{a.interests.map(chip)}</div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-black/60">Languages</p>
                    <div className="mt-1 flex flex-wrap gap-2">{a.languages.map(chip)}</div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="w-full rounded-xl bg-primary px-3 py-2 text-white hover:bg-secondary transition"
                      onClick={() => console.log("Request mentorship:", a.id)}
                    >
                      Request mentorship
                    </button>
                    <button
                      type="button"
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 hover:opacity-80 transition"
                      onClick={() => console.log("View ambassador:", a.id)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main: quests OR opportunities (only if onboarding complete) */}
        {onboardingComplete && (
          <>
            {studentLevel !== "current_wildcat" ? (
              <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
                <h2 className="text-xl font-semibold text-primary">Quest Board</h2>
                <p className="text-sm text-black/70 mt-1">
                  Clear objectives with step-by-step guidance, short videos, mini quizzes, and interactive checklists.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  {orderedQuests.map((q) => {
                    const unlocked = levelIndex(q.level) <= levelIndex(studentLevel);

                    return (
                      <button
                        key={q.id}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => {
                          if (!unlocked) return;
                          setActiveQuest(q);
                        }}
                        className={[
                          "text-left rounded-2xl border border-black/10 bg-white p-4 transition",
                          unlocked ? "hover:opacity-90" : "opacity-60 cursor-not-allowed",
                        ].join(" ")}
                        title={
                          unlocked
                            ? "Open"
                            : `Locked — reach ${levelLabel(q.level)} to unlock`
                        }
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {!unlocked ? <span className="text-base">🔒</span> : null}
                              <p className="font-semibold text-primary">{q.title}</p>
                            </div>

                            <p className="text-sm text-black/70 mt-1">
                              Level: {levelLabel(q.level)} • Reward: +{q.xpReward} XP
                              {!unlocked ? (
                                <span className="ml-2 text-xs text-black/60">
                                  (Locked)
                                </span>
                              ) : null}
                            </p>
                          </div>

                          <div className="rounded-xl bg-[#e8f0fe] px-3 py-2 text-sm border border-black/10">
                            {unlocked ? "Open" : "Locked"}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {orderedQuests.length === 0 && (
                    <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/70">
                      No quests available yet.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
                <h2 className="text-xl font-semibold text-primary">Opportunity Matches</h2>
                <p className="text-sm text-black/70 mt-1">
                  Based on your major and interests, here are opportunities you may want to explore on campus.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {opportunityMatches.map((o) => (
                    <div key={o.id} className="rounded-2xl border border-black/10 bg-white p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-primary">{o.title}</p>
                        <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs">
                          {o.type}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-black/70">{o.description}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {o.tags.map(chip)}
                      </div>

                      {o.link ? (
                        <a
                          className="mt-4 inline-block rounded-2xl bg-primary px-4 py-2 text-white hover:bg-secondary transition"
                          href={o.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-2 hover:opacity-80 transition"
                          onClick={() => console.log("Open opportunity:", o.id)}
                        >
                          View details
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Quest modal */}
        {activeQuest && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setActiveQuest(null)}
            />

            <div className="relative h-full w-full overflow-y-auto p-4">
              <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white border border-black/10">
                <div className="z-10 flex items-start justify-between gap-3 border-b border-black/10 bg-white p-6 rounded-t-2xl">
                  <div>
                    <h3 className="text-2xl font-semibold text-primary">
                      {activeQuest.title}
                    </h3>
                    <p className="mt-1 text-sm text-black/70">
                      Level: {levelLabel(activeQuest.level)} • Reward: +{activeQuest.xpReward} XP
                    </p>
                  </div>

                  <button
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 hover:opacity-80 transition"
                    onClick={() => setActiveQuest(null)}
                  >
                    Close
                  </button>
                </div>

                <div className="p-6">
                  {/* Explanation */}
                  <div className="mt-2">
                    <p className="text-sm text-black/60">Clear explanation</p>
                    <p className="mt-1 text-black/80">{activeQuest.explanation}</p>
                  </div>

                  {/* Steps */}
                  <div className="mt-5">
                    <p className="text-sm text-black/60">Step-by-step instructions</p>
                    <ol className="mt-2 list-decimal pl-5 space-y-1 text-black/80">
                      {activeQuest.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Video */}
                  {activeQuest.videoUrl ? (
                    <div className="mt-5">
                      <p className="text-sm text-black/60">Short explainer video</p>
                      <div className="mt-2 aspect-video w-full overflow-hidden rounded-2xl border border-black/10 bg-black">
                        <iframe
                          className="h-full w-full"
                          src={activeQuest.videoUrl}
                          title={activeQuest.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Quiz */}
                  <div className="mt-5">
                    <p className="text-sm text-black/60">Mini fun quiz</p>
                    <p className="mt-1 font-medium text-black/80">
                      {activeQuest.quiz.question}
                    </p>

                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {activeQuest.quiz.options.map((opt, idx) => {
                        const selected = quizAnswer === idx;
                        const showFeedback = quizCorrect !== null;

                        const border = selected ? "border-primary" : "border-black/10";
                        const bg =
                          showFeedback && selected
                            ? quizCorrect
                              ? "bg-green-50"
                              : "bg-red-50"
                            : "bg-white";

                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`rounded-2xl border ${border} ${bg} px-4 py-3 text-left hover:opacity-90 transition`}
                            onClick={() => setQuizAnswer(idx)}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizCorrect !== null && (
                      <div
                        className={`mt-3 rounded-2xl p-3 text-sm font-medium ${
                          quizCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {quizCorrect
                          ? "Correct! Nice work."
                          : `Not quite. Correct answer: ${
                              activeQuest.quiz.options[activeQuest.quiz.correctIndex]
                            }`}
                      </div>
                    )}
                  </div>

                  {/* Checklist + progress */}
                  <div className="mt-5">
                    <div className="flex items-end justify-between">
                      <p className="text-sm text-black/60">Interactive checklist</p>
                      <p className="text-sm text-black/70">
                        Progress: <span className="font-semibold">{percent(checklistCompleted, checklistTotal)}%</span>
                      </p>
                    </div>

                    <div className="mt-2 h-3 w-full rounded-full bg-black/10 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="mt-3 space-y-2">
                      {activeQuest.checklist.map((c) => (
                        <label
                          key={c.id}
                          className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={Boolean(checklistDone[c.id])}
                            onChange={(e) =>
                              setChecklistDone((prev) => ({
                                ...prev,
                                [c.id]: e.target.checked,
                              }))
                            }
                          />
                          <span className="text-black/80">{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex flex-col gap-2 md:flex-row md:justify-end">
                    <button
                      type="button"
                      className="rounded-2xl bg-primary px-4 py-3 text-white hover:bg-secondary transition disabled:opacity-50"
                      disabled={progress < 100}
                      onClick={() => {
                        console.log("Complete quest:", activeQuest.id);
                        setActiveQuest(null);
                      }}
                    >
                      Mark as complete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { getUser } from "../../services/AuthProvider";
import { ProfileService } from "../../services/ProfileService";

type StudentMatch = {
  id: string;
  fullName: string;
  country: string;
  intendedMajor: string;
  interests: string[];
  avatarUrl: string;
};

type AmbassadorHeaderData = {
  fullName: string | null;
  major: string | null;
  interests: string[];
};

type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: "research" | "club" | "internship" | "event" | "campus_job";
  audience:
    | "all"
    | "explorer"
    | "applicant"
    | "admitted"
    | "current_wildcat";
  region?: string;    
  link?: string;        
  tags: string[];
  isActive: boolean;
};

type Quest = {
  id: string;
  title: string;
  description: string;
  level: "explorer" | "applicant" | "admitted" | "current_wildcat";
  estimatedMinutes: number;
  xpReward: number;         
  tags: string[];
};

type Badge = {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  minXpRequired: number;     
  category: "onboarding" | "quests" | "community" | "milestones";
  isActive: boolean;
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function normalizeArray(values: string[]) {
  return values
    .map((v) => v.trim())
    .filter(Boolean)
    .filter(
      (v, idx, arr) =>
        arr.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === idx
    );
}

function TagChips({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-black/50">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <h2 className="text-xl font-semibold text-primary">{title}</h2>
      {subtitle ? <p className="text-sm text-black/70">{subtitle}</p> : null}
    </div>
  );
}

export default function AmbassadorDashboard() {
  const [headerData, setHeaderData] = useState<AmbassadorHeaderData | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (!user) return;

      const bundle = await ProfileService.getBundle(user);

      if (bundle.role !== "ambassador") return;

      setHeaderData({
        fullName: bundle.base.full_name,
        major: bundle.ambassador?.major ?? null,
        interests: bundle.ambassador?.interests ?? [],
      });
    })();
  }, []);
  // -------------------------------
  // Mentorship matches (mock)
  // -------------------------------
  const matches: StudentMatch[] = useMemo(
    () => [
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
    ],
    []
  );

  // -------------------------------
  // Quests CRUD (mock)
  // -------------------------------
  const [quests, setQuests] = useState<Quest[]>([
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
  ]);

  const [questMode, setQuestMode] = useState<"create" | "edit" | null>(null);
  const [questEditingId, setQuestEditingId] = useState<string | null>(null);

  const [questTitle, setQuestTitle] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [questLevel, setQuestLevel] = useState<Quest["level"]>("explorer");
  const [questEstimatedMinutes, setQuestEstimatedMinutes] = useState<number>(10);
  const [questTagsInput, setQuestTagsInput] = useState("");
  const [questXpReward, setQuestXpReward] = useState<number>(100);

  function resetQuestForm() {
    setQuestTitle("");
    setQuestDescription("");
    setQuestLevel("explorer");
    setQuestEstimatedMinutes(10);
    setQuestTagsInput("");
    setQuestEditingId(null);
    setQuestXpReward(100);
  }

  function openCreateQuest() {
    resetQuestForm();
    setQuestMode("create");
  }

  function openEditQuest(q: Quest) {
    setQuestTitle(q.title);
    setQuestDescription(q.description);
    setQuestLevel(q.level);
    setQuestEstimatedMinutes(q.estimatedMinutes);
    setQuestTagsInput(q.tags.join(", "));
    setQuestEditingId(q.id);
    setQuestMode("edit");
    setQuestXpReward(q.xpReward);
  }

  function saveQuest() {
    const tags = normalizeArray(
      questTagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );

    const payload: Omit<Quest, "id"> = {
      title: questTitle.trim(),
      description: questDescription.trim(),
      level: questLevel,
      estimatedMinutes: Math.max(1, Number(questEstimatedMinutes) || 1),
      xpReward: Math.max(0, Number(questXpReward) || 0), // ✅
      tags,
    };

    if (!payload.title || !payload.description) return;

    if (questMode === "create") {
      setQuests((prev) => [{ id: uid("q"), ...payload }, ...prev]);
    }

    if (questMode === "edit" && questEditingId) {
      setQuests((prev) =>
        prev.map((q) => (q.id === questEditingId ? { id: q.id, ...payload } : q))
      );
    }

    setQuestMode(null);
    resetQuestForm();
  }

  function deleteQuest(id: string) {
    setQuests((prev) => prev.filter((q) => q.id !== id));
    if (questEditingId === id) {
      setQuestMode(null);
      resetQuestForm();
    }
  }

  // -------------------------------
  // Badges CRUD (mock)
  // -------------------------------
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "profile_complete",
      name: "Profile Complete",
      description: "Completed the onboarding profile.",
      xpReward: 50,
      minXpRequired: 0, // evento / onboarding
      category: "onboarding",
      isActive: true,
    },
    {
      id: "xp_500",
      name: "Getting Started",
      description: "Reached 500 XP.",
      xpReward: 100,
      minXpRequired: 500, // ✅ threshold
      category: "milestones",
      isActive: true,
    },
  ]);

  const [badgeMode, setBadgeMode] = useState<"create" | "edit" | null>(null);
  const [badgeEditingId, setBadgeEditingId] = useState<string | null>(null);

  const [badgeId, setBadgeId] = useState("");
  const [badgeName, setBadgeName] = useState("");
  const [badgeDescription, setBadgeDescription] = useState("");
  const [badgeXpReward, setBadgeXpReward] = useState<number>(50);
  const [badgeCategory, setBadgeCategory] = useState<Badge["category"]>("quests");
  const [badgeIsActive, setBadgeIsActive] = useState(true);
  const [badgeMinXpRequired, setBadgeMinXpRequired] = useState<number>(0);

  function resetBadgeForm() {
    setBadgeId("");
    setBadgeName("");
    setBadgeDescription("");
    setBadgeXpReward(50);
    setBadgeCategory("quests");
    setBadgeIsActive(true);
    setBadgeEditingId(null);
    setBadgeMinXpRequired(0);
  }

  function openCreateBadge() {
    resetBadgeForm();
    setBadgeMode("create");
  }

  function openEditBadge(b: Badge) {
    setBadgeId(b.id);
    setBadgeName(b.name);
    setBadgeDescription(b.description);
    setBadgeXpReward(b.xpReward);
    setBadgeCategory(b.category);
    setBadgeIsActive(b.isActive);
    setBadgeEditingId(b.id);
    setBadgeMode("edit");
    setBadgeMinXpRequired(b.minXpRequired);
  }

  function saveBadge() {
    const cleanId = badgeId.trim();
    const payload: Badge = {
      id: cleanId,
      name: badgeName.trim(),
      description: badgeDescription.trim(),
      xpReward: Math.max(0, Number(badgeXpReward) || 0),
      minXpRequired: Math.max(0, Number(badgeMinXpRequired) || 0), // ✅
      category: badgeCategory,
      isActive: badgeIsActive,
    };

    if (!payload.id || !payload.name) return;

    if (badgeMode === "create") {
      const exists = badges.some((b) => b.id === payload.id);
      if (exists) return;

      setBadges((prev) => [payload, ...prev]);
    }

    if (badgeMode === "edit" && badgeEditingId) {
      // mantém o id original (pra evitar “renomear PK” no mock)
      setBadges((prev) =>
        prev.map((b) =>
          b.id === badgeEditingId ? { ...payload, id: badgeEditingId } : b
        )
      );
    }

    setBadgeMode(null);
    resetBadgeForm();
  }

  function deleteBadge(id: string) {
    setBadges((prev) => prev.filter((b) => b.id !== id));
    if (badgeEditingId === id) {
      setBadgeMode(null);
      resetBadgeForm();
    }
  }

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
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
  ]);

  const [oppMode, setOppMode] = useState<"create" | "edit" | null>(null);
  const [oppEditingId, setOppEditingId] = useState<string | null>(null);

  const [oppTitle, setOppTitle] = useState("");
  const [oppDescription, setOppDescription] = useState("");
  const [oppType, setOppType] = useState<Opportunity["type"]>("event");
  const [oppAudience, setOppAudience] = useState<Opportunity["audience"]>("all");
  const [oppLink, setOppLink] = useState("");
  const [oppTagsInput, setOppTagsInput] = useState("");
  const [oppIsActive, setOppIsActive] = useState(true);

  function resetOppForm() {
    setOppTitle("");
    setOppDescription("");
    setOppType("event");
    setOppAudience("all");
    setOppLink("");
    setOppTagsInput("");
    setOppIsActive(true);
    setOppEditingId(null);
  }

  function openCreateOpp() {
    resetOppForm();
    setOppMode("create");
  }

  function openEditOpp(o: Opportunity) {
    setOppTitle(o.title);
    setOppDescription(o.description);
    setOppType(o.type);
    setOppAudience(o.audience);
    setOppLink(o.link ?? "");
    setOppTagsInput(o.tags.join(", "));
    setOppIsActive(o.isActive);
    setOppEditingId(o.id);
    setOppMode("edit");
  }

  function saveOpp() {
    const tags = normalizeArray(
      oppTagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    );

    const payload: Omit<Opportunity, "id"> = {
      title: oppTitle.trim(),
      description: oppDescription.trim(),
      type: oppType,
      audience: oppAudience,
      link: oppLink.trim() || undefined,
      tags,
      isActive: oppIsActive,
    };

    if (!payload.title || !payload.description) return;

    if (oppMode === "create") {
      setOpportunities((prev) => [{ id: uid("o"), ...payload }, ...prev]);
    } else if (oppMode === "edit" && oppEditingId) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === oppEditingId ? { id: o.id, ...payload } : o))
      );
    }

    setOppMode(null);
    resetOppForm();
  }

  function deleteOpp(id: string) {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    if (oppEditingId === id) {
      setOppMode(null);
      resetOppForm();
    }
  }

  return (
    <div className="mainContent bg-[url('/speckled-texture-bg.png')] bg-cover bg-center">
      <div className="mx-auto w-full max-w-6xl p-6">
        {/* Header */}
        <div className="rounded-2xl border border-primary bg-white p-6">
          {/* Header */}
          {headerData ? (
            <>
              <h1 className="text-3xl font-semibold text-primary">
                Hi, {headerData.fullName?.split(" ")[0]} 👋
              </h1>

              <div className="mt-2 space-y-1">
                {headerData.major && (
                  <p className="text-black/80 font-medium">
                    Major: {headerData.major}
                  </p>
                )}

                {headerData.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    <p>Interests: </p>
                    {headerData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="mt-4 text-black/70">
                Review mentorship matches and manage quests and badges that guide students through their Wildcat Journey.
              </p>
            </>
          ) : (
            <h1 className="text-3xl font-semibold text-primary">
              Ambassador Dashboard
            </h1>
          )}

          {/* Mentorship matches */}
          <div className="mt-8">
            <SectionTitle
              title="Mentorship Matches"
              subtitle="Suggested students based on country, language, interests, and intended major."
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {matches.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={s.avatarUrl}
                      alt={s.fullName}
                      className="h-12 w-12 rounded-full border border-black/10 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-primary truncate">{s.fullName}</p>
                      <p className="text-sm text-black/60">{s.country}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-xs text-black/60">Intended major</p>
                      <p className="font-medium">{s.intendedMajor}</p>
                    </div>

                    <div>
                      <p className="text-xs text-black/60">Interests</p>
                      <TagChips items={s.interests} />
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="w-full rounded-xl bg-primary px-3 py-2 text-white hover:bg-secondary transition"
                        onClick={() => console.log("Open student profile:", s.id)}
                      >
                        View profile
                      </button>
                      <button
                        type="button"
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 hover:opacity-80 transition"
                        onClick={() => console.log("Send message:", s.id)}
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quests CRUD */}
          <div className="mt-10">
            <div className="flex items-end justify-between gap-3">
              <SectionTitle
                title="Quest Management"
                subtitle="Create and update quests that guide students through milestones, checklists, and learning content."
              />
              <button
                type="button"
                onClick={openCreateQuest}
                className="rounded-xl bg-primary px-4 py-2 text-white hover:bg-secondary transition"
              >
                New quest
              </button>
            </div>

            {/* Create/Edit Quest Form */}
            {questMode && (
              <div className="mt-3 rounded-2xl border border-black/10 bg-white p-4">
                <p className="font-semibold text-primary">
                  {questMode === "create" ? "Create a new quest" : "Edit quest"}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-primary">Title</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      value={questTitle}
                      onChange={(e) => setQuestTitle(e.target.value)}
                      placeholder="e.g., Submit your application"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-primary">Description</label>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      value={questDescription}
                      onChange={(e) => setQuestDescription(e.target.value)}
                      rows={4}
                      placeholder="Explain the goal, steps, and what success looks like."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary">Recommended level</label>
                    <select
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      value={questLevel}
                      onChange={(e) => setQuestLevel(e.target.value as Quest["level"])}
                    >
                      <option value="explorer">Explorer</option>
                      <option value="applicant">Applicant</option>
                      <option value="admitted">Admitted</option>
                      <option value="current_wildcat">Current Wildcat</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary">XP reward</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      type="number"
                      min={0}
                      value={questXpReward}
                      onChange={(e) => setQuestXpReward(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary">Estimated minutes</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      type="number"
                      min={1}
                      value={questEstimatedMinutes}
                      onChange={(e) => setQuestEstimatedMinutes(Number(e.target.value))}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-primary">Tags (comma-separated)</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      value={questTagsInput}
                      onChange={(e) => setQuestTagsInput(e.target.value)}
                      placeholder="onboarding, academics, checklist"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 hover:opacity-80 transition"
                    onClick={() => {
                      setQuestMode(null);
                      resetQuestForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-xl bg-primary px-4 py-2 text-white hover:bg-secondary transition disabled:opacity-50"
                    disabled={!questTitle.trim() || !questDescription.trim()}
                    onClick={saveQuest}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Quest List */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              {quests.map((q) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-primary">{q.title}</p>
                      <p className="mt-1 text-sm text-black/70">{q.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1">
                          Level: {q.level}
                        </span>
                        <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1">
                          ~{q.estimatedMinutes} min
                        </span>
                        <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs">
                          +{q.xpReward} XP
                        </span>
                      </div>
                      <div className="mt-2">
                        <TagChips items={q.tags} />
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2 md:justify-end">
                      <button
                        type="button"
                        className="rounded-xl border border-black/10 bg-white px-3 py-2 hover:opacity-80 transition"
                        onClick={() => openEditQuest(q)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-600 hover:opacity-80 transition"
                        onClick={() => deleteQuest(q.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {quests.length === 0 && (
                <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/70">
                  No quests yet.
                </div>
              )}
            </div>
          </div>

          {/* Badges CRUD */}
          <div className="mt-10">
            <div className="flex items-end justify-between gap-3">
              <SectionTitle
                title="Badge Management"
                subtitle="Maintain the badge catalog that rewards student progress and milestones."
              />
              <button
                type="button"
                onClick={openCreateBadge}
                className="rounded-xl bg-primary px-4 py-2 text-white hover:bg-secondary transition"
              >
                New badge
              </button>
            </div>

            {/* Create/Edit Badge Form */}
            {badgeMode && (
              <div className="mt-3 rounded-2xl border border-black/10 bg-white p-4">
                <p className="font-semibold text-primary">
                  {badgeMode === "create" ? "Create a new badge" : "Edit badge"}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-primary">Badge ID</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                      placeholder="e.g., profile_complete"
                      disabled={badgeMode === "edit"} // evita “renomear PK” no mock
                    />
                    <p className="mt-1 text-xs text-black/50">
                      Use snake_case. This becomes the unique key.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary">Name</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      value={badgeName}
                      onChange={(e) => setBadgeName(e.target.value)}
                      placeholder="Profile Complete"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-primary">Description</label>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      value={badgeDescription}
                      onChange={(e) => setBadgeDescription(e.target.value)}
                      rows={3}
                      placeholder="What does the student achieve to earn this badge?"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary">Min XP required</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      type="number"
                      min={0}
                      value={badgeMinXpRequired}
                      onChange={(e) => setBadgeMinXpRequired(Number(e.target.value))}
                    />
                    <p className="mt-1 text-xs text-black/50">
                      Set 0 for event-based badges (earned by completing a specific action).
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary">XP reward</label>
                    <input
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      type="number"
                      min={0}
                      value={badgeXpReward}
                      onChange={(e) => setBadgeXpReward(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary">Category</label>
                    <select
                      className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                      value={badgeCategory}
                      onChange={(e) => setBadgeCategory(e.target.value as Badge["category"])}
                    >
                      <option value="onboarding">Onboarding</option>
                      <option value="quests">Quests</option>
                      <option value="community">Community</option>
                      <option value="milestones">Milestones</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      id="badge-active"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={badgeIsActive}
                      onChange={(e) => setBadgeIsActive(e.target.checked)}
                    />
                    <label htmlFor="badge-active" className="text-sm text-black/70">
                      Active (visible and earnable)
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 hover:opacity-80 transition"
                    onClick={() => {
                      setBadgeMode(null);
                      resetBadgeForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-xl bg-primary px-4 py-2 text-white hover:bg-secondary transition disabled:opacity-50"
                    disabled={!badgeId.trim() || !badgeName.trim()}
                    onClick={saveBadge}
                  >
                    Save
                  </button>
                </div>

                {badgeMode === "create" && badges.some((b) => b.id === badgeId.trim()) && (
                  <div className="mt-3 rounded-xl bg-red-200/50 p-3 text-red-700 font-medium">
                    A badge with this ID already exists. Choose a different ID.
                  </div>
                )}
              </div>
            )}

            {/* Badge List */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-primary">{b.name}</p>
                        <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs">
                          id: {b.id}
                        </span>
                        <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs">
                          {b.category}
                        </span>
                        <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs">
                          Requires {b.minXpRequired} XP
                        </span>
                        <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs">
                          Grants +{b.xpReward} XP
                        </span>
                        <span
                          className={`rounded-full border px-2 py-1 text-xs ${
                            b.isActive
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                          }`}
                        >
                          {b.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-black/70">{b.description}</p>
                    </div>

                    <div className="flex shrink-0 gap-2 md:justify-end">
                      <button
                        type="button"
                        className="rounded-xl border border-black/10 bg-white px-3 py-2 hover:opacity-80 transition"
                        onClick={() => openEditBadge(b)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-600 hover:opacity-80 transition"
                        onClick={() => deleteBadge(b.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {badges.length === 0 && (
                <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/70">
                  No badges yet.
                </div>
              )}
            </div>
            {/* Opportunity Management */}
            <div className="mt-10">
              <div className="flex items-end justify-between gap-3">
                <SectionTitle
                  title="Opportunity Management"
                  subtitle="Curate research positions, clubs, internships, events, and campus jobs to help students find the best fit."
                />
                <button
                  type="button"
                  onClick={openCreateOpp}
                  className="rounded-xl bg-primary px-4 py-2 text-white hover:bg-secondary transition"
                >
                  New opportunity
                </button>
              </div>

              {/* Create/Edit Opportunity Form */}
              {oppMode && (
                <div className="mt-3 rounded-2xl border border-black/10 bg-white p-4">
                  <p className="font-semibold text-primary">
                    {oppMode === "create" ? "Create a new opportunity" : "Edit opportunity"}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-primary">Title</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                        value={oppTitle}
                        onChange={(e) => setOppTitle(e.target.value)}
                        placeholder="e.g., Research Assistantship (Undergrad)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-primary">Description</label>
                      <textarea
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                        value={oppDescription}
                        onChange={(e) => setOppDescription(e.target.value)}
                        rows={4}
                        placeholder="Explain what it is, who it’s for, and how to apply."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-primary">Type</label>
                      <select
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                        value={oppType}
                        onChange={(e) => setOppType(e.target.value as Opportunity["type"])}
                      >
                        <option value="research">Research</option>
                        <option value="club">Club</option>
                        <option value="internship">Internship</option>
                        <option value="event">Event</option>
                        <option value="campus_job">Campus job</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-primary">Audience</label>
                      <select
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                        value={oppAudience}
                        onChange={(e) =>
                          setOppAudience(e.target.value as Opportunity["audience"])
                        }
                      >
                        <option value="all">All students</option>
                        <option value="explorer">Explorer</option>
                        <option value="applicant">Applicant</option>
                        <option value="admitted">Admitted</option>
                        <option value="current_wildcat">Current Wildcat</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-primary">Link (optional)</label>
                      <input
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                        value={oppLink}
                        onChange={(e) => setOppLink(e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-primary">
                        Tags (comma-separated)
                      </label>
                      <input
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                        value={oppTagsInput}
                        onChange={(e) => setOppTagsInput(e.target.value)}
                        placeholder="research, paid, networking"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-2">
                      <input
                        id="opp-active"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={oppIsActive}
                        onChange={(e) => setOppIsActive(e.target.checked)}
                      />
                      <label htmlFor="opp-active" className="text-sm text-black/70">
                        Active (visible and recommended)
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-black/10 bg-white px-4 py-2 hover:opacity-80 transition"
                      onClick={() => {
                        setOppMode(null);
                        resetOppForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-xl bg-primary px-4 py-2 text-white hover:bg-secondary transition disabled:opacity-50"
                      disabled={!oppTitle.trim() || !oppDescription.trim()}
                      onClick={saveOpp}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Opportunity List */}
              <div className="mt-4 grid grid-cols-1 gap-3">
                {opportunities.map((o) => (
                  <div key={o.id} className="rounded-2xl border border-black/10 bg-white p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-primary">{o.title}</p>
                        <p className="mt-1 text-sm text-black/70">{o.description}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1">
                            Type: {o.type}
                          </span>
                          <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1">
                            Audience: {o.audience}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-1 ${
                              o.isActive
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-gray-200 bg-gray-50 text-gray-600"
                            }`}
                          >
                            {o.isActive ? "Active" : "Inactive"}
                          </span>
                          {o.link ? (
                            <a
                              className="rounded-full border border-black/10 bg-white px-2 py-1 hover:opacity-80 transition"
                              href={o.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open link
                            </a>
                          ) : null}
                        </div>

                        <div className="mt-2">
                          <TagChips items={o.tags} />
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2 md:justify-end">
                        <button
                          type="button"
                          className="rounded-xl border border-black/10 bg-white px-3 py-2 hover:opacity-80 transition"
                          onClick={() => openEditOpp(o)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-600 hover:opacity-80 transition"
                          onClick={() => deleteOpp(o.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {opportunities.length === 0 && (
                  <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/70">
                    No opportunities yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
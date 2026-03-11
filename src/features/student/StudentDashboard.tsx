import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import Loading from "../../components/Loading";
import { getUser } from "../../services/AuthProvider";
import { ProfileService } from "../../services/ProfileService";

import {
  ambassadorMatchesMock,
  opportunityMatchesMock,
  availableQuestsMock,
} from "./StudentMockData";

import { levelIndex, normalizeStudentLevel } from "./studentHelpers";
import type { Quest, StudentLevel } from "./student";
import StudentHeader from "./sections/StudentHeader";
import OnboardingBanner from "./sections/OnboardingBanner";
import MentorshipMatches from "./sections/MentorshipMatches";
import OpportunityMatches from "./sections/OpportunityMatches";
import QuestBoard from "./sections/QuestBoard";
import QuestModal from "./sections/QuestModal";

export default function StudentDashboard() {
  const nav = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [studentLevel, setStudentLevel] = useState<StudentLevel>("explorer");
  const [xp, setXp] = useState(0);
  const [major, setMajor] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);

  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);

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

  const orderedQuests = useMemo(() => {
    return [...availableQuestsMock].sort(
      (a, b) => levelIndex(a.level) - levelIndex(b.level)
    );
  }, []);

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ?? "Student";

  if (loading) return <Loading />;
  if (!user) return <div className="mainContent p-6">No user found</div>;

  return (
    <div className="mainContent bg-[url('/speckled-texture-bg.png')] bg-cover bg-center">
      <div className="mx-auto w-full max-w-6xl p-6">
        <StudentHeader
          fullName={fullName}
          onboardingComplete={onboardingComplete}
          studentLevel={studentLevel}
          xp={xp}
          major={major}
          interests={interests}
          badges={badges}
        />

        {!onboardingComplete && <OnboardingBanner />}

        {onboardingComplete && (
          <MentorshipMatches ambassadors={ambassadorMatchesMock} />
        )}

        {onboardingComplete && studentLevel !== "current_wildcat" && (
          <QuestBoard
            quests={orderedQuests}
            studentLevel={studentLevel}
            onOpenQuest={setActiveQuest}
          />
        )}

        {onboardingComplete && studentLevel === "current_wildcat" && (
          <OpportunityMatches opportunities={opportunityMatchesMock} />
        )}

        <QuestModal
          key={activeQuest?.id ?? "closed"}
          quest={activeQuest}
          onClose={() => setActiveQuest(null)}
          onComplete={(questId) => {
            console.log("Complete quest:", questId);
            setActiveQuest(null);
          }}
        />
      </div>
    </div>
  );
}
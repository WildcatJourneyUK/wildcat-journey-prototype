import { useNavigate } from "react-router-dom";
import { levelLabel } from "../studentHelpers";
import type { StudentLevel } from "../student";

type Props = {
  fullName: string;
  onboardingComplete: boolean;
  studentLevel: StudentLevel;
  xp: number;
  major: string | null;
  interests: string[];
  badges: string[];
};

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

export default function StudentHeader({
  fullName,
  onboardingComplete,
  studentLevel,
  xp,
  major,
  interests,
  badges,
}: Props) {
  const nav = useNavigate();

  return (
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
                  <span className="font-semibold text-primary">Intended major:</span> {major}
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
            className="rounded-xl border border-black/10 bg-white px-4 py-2 transition hover:opacity-80"
            onClick={() => nav("/profile")}
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
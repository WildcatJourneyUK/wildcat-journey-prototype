import type { Quest, StudentLevel } from "../student";
import { levelIndex, levelLabel } from "../studentHelpers";

type Props = {
  quests: Quest[];
  studentLevel: StudentLevel;
  onOpenQuest: (quest: Quest) => void;
};

export default function QuestBoard({
  quests,
  studentLevel,
  onOpenQuest,
}: Props) {
  return (
    <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
      <h2 className="text-xl font-semibold text-primary">Quest Board</h2>
      <p className="mt-1 text-sm text-black/70">
        Clear objectives with step-by-step guidance, short videos, mini quizzes,
        and interactive checklists.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3">
        {quests.map((q) => {
          const unlocked = levelIndex(q.level) <= levelIndex(studentLevel);

          return (
            <button
              key={q.id}
              type="button"
              disabled={!unlocked}
              onClick={() => {
                if (!unlocked) return;
                onOpenQuest(q);
              }}
              className={[
                "rounded-2xl border border-black/10 bg-white p-4 text-left transition",
                unlocked ? "hover:opacity-90" : "cursor-not-allowed opacity-60",
              ].join(" ")}
              title={unlocked ? "Open" : `Locked — reach ${levelLabel(q.level)} to unlock`}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {!unlocked ? <span className="text-base">🔒</span> : null}
                    <p className="font-semibold text-primary">{q.title}</p>
                  </div>

                  <p className="mt-1 text-sm text-black/70">
                    Level: {levelLabel(q.level)} • Reward: +{q.xpReward} XP
                    {!unlocked ? (
                      <span className="ml-2 text-xs text-black/60">(Locked)</span>
                    ) : null}
                  </p>
                </div>

                <div className="rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2 text-sm">
                  {unlocked ? "Open" : "Locked"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
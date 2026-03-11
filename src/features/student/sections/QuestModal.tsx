import { useEffect, useMemo, useState } from "react";
import type { Quest } from "../student";
import { levelLabel, percent } from "../studentHelpers";

type Props = {
  quest: Quest | null;
  onClose: () => void;
  onComplete: (questId: string) => void;
};

export default function QuestModal({ quest, onClose, onComplete }: Props) {
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [checklistDone, setChecklistDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!quest) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [quest]);

  const checklistTotal = quest?.checklist.length ?? 0;
  const checklistCompleted = quest
    ? quest.checklist.filter((c) => checklistDone[c.id]).length
    : 0;

  const progress = useMemo(
    () => percent(checklistCompleted, checklistTotal),
    [checklistCompleted, checklistTotal]
  );

  const quizCorrect =
    quest && quizAnswer !== null ? quizAnswer === quest.quiz.correctIndex : null;

  if (!quest) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative h-full w-full overflow-y-auto p-4">
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-black/10 bg-white">
          <div className="flex items-start justify-between gap-3 rounded-t-2xl border-b border-black/10 bg-white p-6">
            <div>
              <h3 className="text-2xl font-semibold text-primary">{quest.title}</h3>
              <p className="mt-1 text-sm text-black/70">
                Level: {levelLabel(quest.level)} • Reward: +{quest.xpReward} XP
              </p>
            </div>

            <button
              className="rounded-xl border border-black/10 bg-white px-3 py-2 transition hover:opacity-80"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="p-6">
            <div className="mt-2">
              <p className="text-sm text-black/60">Clear explanation</p>
              <p className="mt-1 text-black/80">{quest.explanation}</p>
            </div>

            <div className="mt-5">
              <p className="text-sm text-black/60">Step-by-step instructions</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-black/80">
                {quest.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </div>

            {quest.videoUrl ? (
              <div className="mt-5">
                <p className="text-sm text-black/60">Short explainer video</p>
                <div className="mt-2 aspect-video w-full overflow-hidden rounded-2xl border border-black/10 bg-black">
                  <iframe
                    className="h-full w-full"
                    src={quest.videoUrl}
                    title={quest.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-5">
              <p className="text-sm text-black/60">Mini fun quiz</p>
              <p className="mt-1 font-medium text-black/80">{quest.quiz.question}</p>

              <div className="mt-2 grid grid-cols-1 gap-2">
                {quest.quiz.options.map((opt, idx) => {
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
                      className={`rounded-2xl border ${border} ${bg} px-4 py-3 text-left transition hover:opacity-90`}
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
                    : `Not quite. Correct answer: ${quest.quiz.options[quest.quiz.correctIndex]}`}
                </div>
              )}
            </div>

            <div className="mt-5">
              <div className="flex items-end justify-between">
                <p className="text-sm text-black/60">Interactive checklist</p>
                <p className="text-sm text-black/70">
                  Progress: <span className="font-semibold">{progress}%</span>
                </p>
              </div>

              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-black/10">
                <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-3 space-y-2">
                {quest.checklist.map((c) => (
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

            <div className="mt-6 flex flex-col gap-2 md:flex-row md:justify-end">
              <button
                type="button"
                className="rounded-2xl bg-primary px-4 py-3 text-white transition hover:bg-secondary disabled:opacity-50"
                disabled={progress < 100}
                onClick={() => onComplete(quest.id)}
              >
                Mark as complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import type { Quest } from "../ambassador";
import { normalizeArray, uid } from "../ambassadorHelpers";
import SectionTitle from "../components/SectionTitle";
import TagChips from "../components/TagChips";

type Props = {
  initialQuests: Quest[];
};

export default function QuestManagementSection({ initialQuests }: Props) {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);

  const [questMode, setQuestMode] = useState<"create" | "edit" | null>(null);
  const [questEditingId, setQuestEditingId] = useState<string | null>(null);

  const [questTitle, setQuestTitle] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [questLevel, setQuestLevel] = useState<Quest["level"]>("explorer");
  const [questEstimatedMinutes, setQuestEstimatedMinutes] = useState(10);
  const [questTagsInput, setQuestTagsInput] = useState("");
  const [questXpReward, setQuestXpReward] = useState(100);

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
      questTagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    );

    const payload: Omit<Quest, "id"> = {
      title: questTitle.trim(),
      description: questDescription.trim(),
      level: questLevel,
      estimatedMinutes: Math.max(1, Number(questEstimatedMinutes) || 1),
      xpReward: Math.max(0, Number(questXpReward) || 0),
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

  return (
    <div className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <SectionTitle
          title="Quest Management"
          subtitle="Create and update quests that guide students through milestones, checklists, and learning content."
        />
        <button
          type="button"
          onClick={openCreateQuest}
          className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-secondary"
        >
          New quest
        </button>
      </div>

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
              className="rounded-xl border border-black/10 bg-white px-4 py-2 transition hover:opacity-80"
              onClick={() => {
                setQuestMode(null);
                resetQuestForm();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-secondary disabled:opacity-50"
              disabled={!questTitle.trim() || !questDescription.trim()}
              onClick={saveQuest}
            >
              Save
            </button>
          </div>
        </div>
      )}

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
                  <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1">
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
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 transition hover:opacity-80"
                  onClick={() => openEditQuest(q)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-600 transition hover:opacity-80"
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
  );
}
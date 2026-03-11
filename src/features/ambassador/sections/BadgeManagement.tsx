import { useState } from "react";
import type { Badge } from "../ambassador";
import SectionTitle from "../components/SectionTitle";

type Props = {
  initialBadges: Badge[];
};

export default function BadgeManagementSection({ initialBadges }: Props) {
  const [badges, setBadges] = useState<Badge[]>(initialBadges);

  const [badgeMode, setBadgeMode] = useState<"create" | "edit" | null>(null);
  const [badgeEditingId, setBadgeEditingId] = useState<string | null>(null);

  const [badgeId, setBadgeId] = useState("");
  const [badgeName, setBadgeName] = useState("");
  const [badgeDescription, setBadgeDescription] = useState("");
  const [badgeXpReward, setBadgeXpReward] = useState(50);
  const [badgeCategory, setBadgeCategory] = useState<Badge["category"]>("quests");
  const [badgeIsActive, setBadgeIsActive] = useState(true);
  const [badgeMinXpRequired, setBadgeMinXpRequired] = useState(0);

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
      minXpRequired: Math.max(0, Number(badgeMinXpRequired) || 0),
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

  return (
    <div className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <SectionTitle
          title="Badge Management"
          subtitle="Maintain the badge catalog that rewards student progress and milestones."
        />
        <button
          type="button"
          onClick={openCreateBadge}
          className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-secondary"
        >
          New badge
        </button>
      </div>

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
                disabled={badgeMode === "edit"}
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
                Set 0 for event-based badges.
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
              className="rounded-xl border border-black/10 bg-white px-4 py-2 transition hover:opacity-80"
              onClick={() => {
                setBadgeMode(null);
                resetBadgeForm();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-secondary disabled:opacity-50"
              disabled={!badgeId.trim() || !badgeName.trim()}
              onClick={saveBadge}
            >
              Save
            </button>
          </div>

          {badgeMode === "create" && badges.some((b) => b.id === badgeId.trim()) && (
            <div className="mt-3 rounded-xl bg-red-200/50 p-3 font-medium text-red-700">
              A badge with this ID already exists. Choose a different ID.
            </div>
          )}
        </div>
      )}

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
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 transition hover:opacity-80"
                  onClick={() => openEditBadge(b)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-600 transition hover:opacity-80"
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
    </div>
  );
}
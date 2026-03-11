import { useState } from "react";
import type { Opportunity } from "../ambassador";
import { normalizeArray, uid } from "../ambassadorHelpers";
import SectionTitle from "../components/SectionTitle";
import TagChips from "../components/TagChips";

type Props = {
  initialOpportunities: Opportunity[];
};

export default function OpportunityManagementSection({
  initialOpportunities,
}: Props) {
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(initialOpportunities);

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
    }

    if (oppMode === "edit" && oppEditingId) {
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
    <div className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <SectionTitle
          title="Opportunity Management"
          subtitle="Curate research positions, clubs, internships, events, and campus jobs to help students find the best fit."
        />
        <button
          type="button"
          onClick={openCreateOpp}
          className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-secondary"
        >
          New opportunity
        </button>
      </div>

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
              className="rounded-xl border border-black/10 bg-white px-4 py-2 transition hover:opacity-80"
              onClick={() => {
                setOppMode(null);
                resetOppForm();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-secondary disabled:opacity-50"
              disabled={!oppTitle.trim() || !oppDescription.trim()}
              onClick={saveOpp}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3">
        {opportunities.map((o) => (
          <div
            key={o.id}
            className="rounded-2xl border border-black/10 bg-white p-4"
          >
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
                      className="rounded-full border border-black/10 bg-white px-2 py-1 transition hover:opacity-80"
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
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 transition hover:opacity-80"
                  onClick={() => openEditOpp(o)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-red-200 bg-white px-3 py-2 text-red-600 transition hover:opacity-80"
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
  );
}
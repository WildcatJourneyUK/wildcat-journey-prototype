import type { StudentMatch } from "../ambassador";
import SectionTitle from "../components/SectionTitle";
import TagChips from "../components/TagChips";

type Props = {
  matches: StudentMatch[];
};

export default function StudentMatchesSection({ matches }: Props) {
  return (
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
                <p className="truncate font-semibold text-primary">{s.fullName}</p>
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
                  className="w-full rounded-xl bg-primary px-3 py-2 text-white transition hover:bg-secondary"
                  onClick={() => console.log("Open student profile:", s.id)}
                >
                  View profile
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 transition hover:opacity-80"
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
  );
}
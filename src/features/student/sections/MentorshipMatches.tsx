import type { AmbassadorCard } from "../student";

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

type Props = {
  ambassadors: AmbassadorCard[];
};

export default function MentorshipMatches({ ambassadors }: Props) {
  return (
    <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
      <h2 className="text-xl font-semibold text-primary">Mentorship Matches</h2>
      <p className="mt-1 text-sm text-black/70">
        Suggested ambassadors based on your profile.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ambassadors.map((a) => (
          <div key={a.id} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex items-center gap-3">
              <img
                src={a.avatarUrl}
                alt={a.fullName}
                className="h-12 w-12 rounded-full border border-black/10 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-primary">{a.fullName}</p>
                {a.minors.length > 0 ? (
                  <p className="text-xs text-black/50">Minors: {a.minors.join(", ")}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-md text-black">{a.major}</p>
              <p className="text-xs text-black">Interests</p>
              <div className="mt-1 flex flex-wrap gap-2">{a.interests.map(chip)}</div>
            </div>

            <div className="mt-3">
              <p className="text-xs text-black/60">Languages</p>
              <div className="mt-1 flex flex-wrap gap-2">{a.languages.map(chip)}</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="w-full rounded-xl bg-primary px-3 py-2 text-white transition hover:bg-secondary"
                onClick={() => console.log("Request mentorship:", a.id)}
              >
                Request mentorship
              </button>
              <button
                type="button"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 transition hover:opacity-80"
                onClick={() => console.log("View ambassador:", a.id)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
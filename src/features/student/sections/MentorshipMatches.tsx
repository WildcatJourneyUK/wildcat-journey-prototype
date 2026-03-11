import type { AmbassadorCard } from "../student";
import { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

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
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  function toggleFavorite(id: string) {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

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
                <p className="truncate font-semibold text-primary text-lg">{a.fullName}</p>
                <div className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/24x18/${a.countryCode}.png`}
                    alt={a.country}
                    className="h-4 w-6 rounded-sm"
                    />
                  <span>{a.country}</span>
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(a.id)}
                className="ml-auto cursor-pointer"
              >
                {favorites[a.id] ? (
                  <BsStarFill className="h-6 w-6 text-secondary" />
                ) : (
                  <BsStar className="h-6 w-6 text-secondary" />
                )}
              </button>
            </div>

            <div className="mt-3">
              <p className="text-lg text-primary">{a.major}</p>
              {a.minors.length > 0 ? (
                  <p className="text-sm text-secondary mb-4">Minor: {a.minors.join(", ")}</p>
                ) : null}
              <p className="text-md text-black">Interests</p>
              <div className="mt-1 flex flex-wrap gap-2">{a.interests.map(chip)}</div>
            </div>

            <div className="mt-3">
              <p className="text-md text-black">Languages</p>
              <div className="mt-1 flex flex-wrap gap-2">{a.languages.map(chip)}</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 transition hover:opacity-80"
                onClick={() => console.log("View ambassador:", a.id)}
              >
                Profile
              </button>
              <button
                type="button"
                className="w-full rounded-xl bg-primary px-3 py-2 text-white transition hover:bg-secondary"
                onClick={() => console.log("Connect with ambassador:", a.id)}
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
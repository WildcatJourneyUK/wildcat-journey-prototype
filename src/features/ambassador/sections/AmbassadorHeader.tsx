import type { AmbassadorHeaderData } from "../ambassador";
import TagChips from "../components/TagChips";

type Props = {
  headerData: AmbassadorHeaderData | null;
};

export default function AmbassadorHeader({ headerData }: Props) {
  return (
    <div className="rounded-2xl border border-primary bg-white p-6">
      {headerData ? (
        <>
          <h1 className="text-3xl font-semibold text-primary">
            Hi, {headerData.fullName?.split(" ")[0]} 👋
          </h1>

          <div className="mt-2 space-y-1">
            {headerData.major && (
              <p className="font-medium text-black/80">Major: {headerData.major}</p>
            )}

            {headerData.interests.length > 0 && (
              <div className="mt-1">
                <p className="mb-2 text-sm text-black/60">Interests</p>
                <TagChips items={headerData.interests} />
              </div>
            )}
          </div>

          <p className="mt-4 text-black/70">
            Review mentorship matches and manage quests, opportunities, and badges that guide students through their Wildcat Journey.
          </p>
        </>
      ) : (
        <h1 className="text-3xl font-semibold text-primary">
          Ambassador Dashboard
        </h1>
      )}
    </div>
  );
}
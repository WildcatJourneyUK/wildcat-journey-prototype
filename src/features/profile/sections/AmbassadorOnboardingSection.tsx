import TagInput from "../components/TagInput";

type Props = {
  ambMajor: string;
  setAmbMajor: (value: string) => void;
  ambMinors: string[];
  setAmbMinors: (value: string[]) => void;
  ambInterests: string[];
  setAmbInterests: (value: string[]) => void;
  ambBio: string;
  setAmbBio: (value: string) => void;
  ambAvailable: boolean;
  setAmbAvailable: (value: boolean) => void;
};

export default function AmbassadorOnboardingSection({
  ambMajor,
  setAmbMajor,
  ambMinors,
  setAmbMinors,
  ambInterests,
  setAmbInterests,
  ambBio,
  setAmbBio,
  ambAvailable,
  setAmbAvailable,
}: Props) {
  return (
    <div className="rounded-2xl border border-black/10 p-4 space-y-4">
      <p className="font-semibold text-primary">Ambassador onboarding</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-primary">Major</label>
          <input
            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
            value={ambMajor}
            onChange={(e) => setAmbMajor(e.target.value)}
            placeholder="Biology, Computer Science..."
          />
        </div>

        <div className="flex items-end gap-3">
          <label className="flex items-center gap-2 text-sm text-primary">
            <input
              type="checkbox"
              checked={ambAvailable}
              onChange={(e) => setAmbAvailable(e.target.checked)}
              className="h-4 w-4"
            />
            Available for mentorship
          </label>
        </div>

        <div className="md:col-span-2">
          <TagInput
            label="Minors"
            values={ambMinors}
            setValues={setAmbMinors}
            placeholder="Psychology, Data Science..."
          />
        </div>

        <div className="md:col-span-2">
          <TagInput
            label="Interests"
            values={ambInterests}
            setValues={setAmbInterests}
            placeholder="lab research, clubs, scholarships..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium text-primary">Short bio</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
            value={ambBio}
            onChange={(e) => setAmbBio(e.target.value)}
            rows={4}
            placeholder="A short intro students will see when matched with you."
          />
        </div>
      </div>
    </div>
  );
}
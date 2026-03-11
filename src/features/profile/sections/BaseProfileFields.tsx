import TagInput from "../components/TagInput";

type Props = {
  fullName: string;
  setFullName: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  languages: string[];
  setLanguages: (value: string[]) => void;
};

export default function BaseProfileFields({
  fullName,
  setFullName,
  country,
  setCountry,
  languages,
  setLanguages,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-medium text-primary">Full name</label>
        <input
          className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Name Surname"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-primary">Country</label>
        <input
          className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Brazil, Colombia, ..."
        />
      </div>

      <div className="md:col-span-2">
        <TagInput
          label="Languages"
          values={languages}
          setValues={setLanguages}
          placeholder="English, Portuguese, Spanish..."
        />
      </div>
    </div>
  );
}
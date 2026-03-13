import TagInput from "../components/TagInput";

type Props = {
  educationLevel: string;
  setEducationLevel: (value: string) => void;
  intendedMajor: string;
  setIntendedMajor: (value: string) => void;
  studentInterests: string[];
  setStudentInterests: (value: string[]) => void;
};

export default function StudentOnboardingSection({
  educationLevel,
  setEducationLevel,
  intendedMajor,
  setIntendedMajor,
  studentInterests,
  setStudentInterests,
}: Props) {
  return (
    <div className="rounded-2xl border border-black/10 p-4 space-y-4">
      <p className="font-semibold text-primary">Student onboarding</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-primary">Education level</label>
          <input
            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
            placeholder="High school, Gap year, Transfer..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-primary">Intended major</label>
          <input
            className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
            value={intendedMajor}
            onChange={(e) => setIntendedMajor(e.target.value)}
            placeholder="Computer Science, Biology..."
          />
        </div>

        <div className="md:col-span-2">
          <TagInput
            label="Interests"
            values={studentInterests}
            setValues={setStudentInterests}
            placeholder="AI, research, entrepreneurship..."
          />
        </div>
      </div>
    </div>
  );
}
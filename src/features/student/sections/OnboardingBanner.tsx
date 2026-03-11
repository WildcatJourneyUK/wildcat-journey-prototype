import { useNavigate } from "react-router-dom";

export default function OnboardingBanner() {
  const nav = useNavigate();

  return (
    <div className="mt-6 rounded-2xl border border-black/10 bg-[#d9edf8] p-4 text-primary">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold">
          Complete your profile to unlock your personalized journey!
        </p>
        <button
          className="rounded-2xl bg-primary px-6 py-3 text-white transition hover:bg-secondary"
          onClick={() => nav("/profile")}
        >
          Go to Profile
        </button>
      </div>
    </div>
  );
}
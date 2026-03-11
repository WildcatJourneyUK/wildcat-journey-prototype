type Props = {
  onboardingCompleted: boolean;
  isAdmissionsOfficer: boolean;
  editMode: boolean;
  onToggleEdit: () => void;
};

export default function ProfileHeader({
  onboardingCompleted,
  isAdmissionsOfficer,
  editMode,
  onToggleEdit,
}: Props) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-primary">Profile</h1>
        <p className="mt-1 text-black/70">
          Fill in a few details so we can personalize quests, mentorship matches,
          and opportunities.
        </p>
      </div>

      {onboardingCompleted && !isAdmissionsOfficer && (
        <button
          type="button"
          onClick={onToggleEdit}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 transition hover:opacity-80"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      )}
    </div>
  );
}
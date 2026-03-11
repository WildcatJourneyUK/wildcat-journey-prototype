type Role = "student" | "ambassador" | "admissions_officer";

type Props = {
  role: Role;
  showInvite: boolean;
  setShowInvite: (value: boolean | ((prev: boolean) => boolean)) => void;

  inviteCode: string;
  setInviteCode: (value: string) => void;

  inviteBusy: boolean;
  inviteMsg: string | null;

  onRedeem: () => void;
};

function getRoleLabel(role: Role) {
  if (role === "student") return "Student";
  if (role === "ambassador") return "Ambassador";
  return "Admissions Officer";
}

export default function InviteCodeCard({
  role,
  showInvite,
  setShowInvite,
  inviteCode,
  setInviteCode,
  inviteBusy,
  inviteMsg,
  onRedeem,
}: Props) {
  const roleLabel = getRoleLabel(role);

  return (
    <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex flex-col gap-6">
        <div className="text-md text-black">
          <p className="font-semibold text-primary text-lg">Prototype Role Switch</p>

          <p>
            You are currently exploring the{" "}
            <span className="underline font-semibold">{roleLabel}</span> role.
          </p>

          <p>
            Enter <strong>"STUDENT"</strong>, <strong>"AMBASSADOR"</strong>, or{" "}
            <strong>"ADMISSION"</strong> to switch roles in this prototype. No validation is required, so feel free to explore.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setInviteCode("");
            setShowInvite((prev) => !prev);
          }}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 transition hover:opacity-80"
        >
          {showInvite ? "Close" : "Switch role"}
        </button>
      </div>

      {showInvite && (
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              className="w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
              placeholder='Enter code (e.g. AMBASSADOR)'
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />

            <button
              type="button"
              onClick={onRedeem}
              disabled={inviteBusy || !inviteCode.trim()}
              className="rounded-xl bg-primary px-4 py-2 text-white transition hover:bg-secondary disabled:opacity-50"
            >
              {inviteBusy ? "Switching..." : "Apply"}
            </button>
          </div>

          {inviteMsg && (
            <div className="mt-3 rounded-xl bg-green-100 p-3 font-medium text-green-800">
              {inviteMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
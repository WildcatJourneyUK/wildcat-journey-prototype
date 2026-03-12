import PasswordInput from "./PasswordInput";

type AuthFormProps = {
  mode: "signin" | "signup";
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  busy: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
};

export default function AuthForm({
  mode,
  fullName,
  email,
  password,
  confirmPassword,
  error,
  busy,
  showPassword,
  showConfirmPassword,
  onSubmit,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
  onToggleConfirmPassword,
}: AuthFormProps) {
  return (
    <form className="mt-6 space-y-3" onSubmit={onSubmit}>
      {mode === "signup" && (
        <div>
          <label className="text-sm text-primary sm:text-base">Full name</label>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-[#e8f0fe] px-3 py-2 text-sm sm:text-base"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Name Surname"
            required
          />
        </div>
      )}

      <div>
        <label className="text-sm text-primary sm:text-base">Email</label>
        <input
          className="mt-1 w-full rounded-xl border border-white/10 bg-[#e8f0fe] px-3 py-2 text-sm sm:text-base"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@email.com"
          type="email"
          required
        />
      </div>

      <PasswordInput
        label="Password"
        value={password}
        onChange={onPasswordChange}
        placeholder="••••••••"
        visible={showPassword}
        onToggleVisible={onTogglePassword}
      />

      {mode === "signup" && (
        <PasswordInput
          label="Confirm password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          placeholder="••••••••"
          visible={showConfirmPassword}
          onToggleVisible={onToggleConfirmPassword}
        />
      )}

      {error && (
        <div className="rounded-xl bg-red-200/50 p-3 text-sm font-semibold text-red-500 sm:text-md">
          * {error}
        </div>
      )}

      <button
        disabled={busy}
        className="w-full rounded-xl border border-white/10 bg-primary px-4 py-2.5 text-base text-white transition hover:bg-secondary disabled:opacity-50 sm:text-xl"
      >
        {busy ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
      </button>
    </form>
  );
}
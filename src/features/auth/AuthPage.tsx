import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../../services/AuthProvider";
import AuthForm from "./components/AuthForm";
import AuthEmailSent from "./components/AuthEmailSent";

export default function AuthPage() {
  const nav = useNavigate();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (mode !== "signup") return;

    if (password !== confirmPassword && confirmPassword.length > 0) {
      setError("Passwords do not match");
    } else if (error === "Passwords do not match") {
      setError(null);
    }
  }, [mode, password, confirmPassword, error]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        await signUp(email, password, fullName);
        setEmailSent(true);
        return;
      }

      await signIn(email, password);
      nav("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  function handleBackToSignIn() {
    setEmailSent(false);
    setMode("signin");
  }

  return (
    <div className="mainContent flex min-h-screen items-center justify-center bg-[url('/speckled-texture-bg.png')] bg-cover bg-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-primary bg-white p-4 text-black shadow-sm sm:p-6">
        <h1 className="text-center text-2xl font-semibold text-primary sm:text-3xl">
          {mode === "signup" ? "Create your account" : "Welcome back 😼"}
        </h1>

        <p className="mt-2 text-center text-sm sm:text-base">
          {mode === "signup"
            ? "Join the journey toward becoming a UK Wildcat."
            : "Log in to continue your Wildcat Journey."}
        </p>

        {emailSent ? (
          <AuthEmailSent
            email={email}
            onBackToSignIn={handleBackToSignIn}
          />
        ) : (
          <AuthForm
            mode={mode}
            fullName={fullName}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            error={error}
            busy={busy}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onSubmit={submit}
            onFullNameChange={setFullName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onTogglePassword={() => setShowPassword((prev) => !prev)}
            onToggleConfirmPassword={() =>
              setShowConfirmPassword((prev) => !prev)
            }
          />
        )}

        {!emailSent && (
          <div className="mt-4 text-center text-sm text-primary opacity-80 sm:text-base">
            {mode === "signup" ? (
              <>
                <span className="text-black">Already have an account? </span>
                <button
                  type="button"
                  className="underline"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                <span className="text-black">New here? </span>
                <button
                  type="button"
                  className="underline"
                  onClick={() => setMode("signup")}
                >
                  Create an account
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
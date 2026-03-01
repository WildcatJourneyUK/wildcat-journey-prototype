import { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthProvider";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function AuthPage() {
  const { signIn, signUp } = useAuth();
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

  useEffect(() => {
    if (mode !== "signup") return;

    if (password !== confirmPassword && confirmPassword.length > 0) {
      setError("Passwords do not match");
    } else {
      if (error === "Passwords do not match") setError(null);
    }
  }, [mode, password, confirmPassword]); 

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setBusy(false);
          return;
        }

        await signUp(email, password, fullName);
      } else {
        await signIn(email, password);
      }
      nav("/app");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mainContent flex items-center justify-center bg-[url('/speckled-texture-bg.png')] bg-cover bg-center">
      <div className="flex items-center justify-center p-6">
        <div className="w-[30vw] rounded-2xl border border-primary bg-white text-black p-6">
          <h1 className="text-3xl text-primary text-center font-semibold">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-md text-center mt-1">
            {mode === "signup" ? "Join the journey toward becoming a UK Wildcat." : "Log in to continue your Wildcat Journey."}
          </p>

          <form className="mt-6 space-y-3" onSubmit={submit}>
            {mode === "signup" && (
              <div>
                <label className="text-md text-primary">Full name</label>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#e8f0fe] px-3 py-2"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Name Surname"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-primary">Email</label>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-[#e8f0fe] px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                type="email"
                required
              />
            </div>

            <div>
              <label className="text-primary">Password</label>
              <div className="relative">
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[#e8f0fe] px-3 py-2 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="text-primary">Confirm password</label>
                <div className="relative">
                  <input
                    className="mt-1 w-full rounded-xl border border-white/10 bg-[#e8f0fe] px-3 py-2 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-200/50 text-red-500 font-semibold p-3 text-md">
                * {error}
              </div>
            )}

            <button
              disabled={busy}
              className="w-full rounded-xl border border-white/10 bg-primary hover:bg-secondary transition px-4 py-2 text-white text-xl disabled:opacity-50"
              >
              {busy ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-md text-primary opacity-80">
            {mode === "signup" ? (
              <>
                <span className="text-black">Already have an account?{" "}</span>
                <button className="underline" onClick={() => setMode("signin")}>
                  Sign in
                </button>
              </>
            ) : (
              <>
                <span className="text-black">New here?{" "}</span>
                <button className="underline hover:scale-100" onClick={() => setMode("signup")}>
                  Create an account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
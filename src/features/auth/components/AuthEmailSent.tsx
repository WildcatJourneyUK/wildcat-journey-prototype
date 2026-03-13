import { BiArrowBack } from "react-icons/bi";

type AuthEmailSentProps = {
  email: string;
  onBackToSignIn: () => void;
};

export default function AuthEmailSent({
  email,
  onBackToSignIn,
}: AuthEmailSentProps) {
  return (
    <div className="mt-6 rounded-xl bg-lightBlue p-4 text-center text-black">
      <h2 className="mb-2 text-base font-semibold text-primary sm:text-lg">
        Check your email 📩
      </h2>

      <p className="text-sm sm:text-base">
        We’ve sent a confirmation link to: <strong>{email}</strong>.
        <br />
        Please confirm your email before signing in.
      </p>

      <button
        type="button"
        onClick={onBackToSignIn}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-primary px-4 py-2.5 text-base text-white transition hover:bg-secondary sm:text-xl"
      >
        <BiArrowBack />
        Back to sign in
      </button>
    </div>
  );
}
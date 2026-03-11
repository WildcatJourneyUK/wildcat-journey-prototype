import { BiArrowBack } from "react-icons/bi";

type Props = {
  onClick: () => void;
};

export default function BackToDashboardButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="mt-6 flex items-center gap-3 rounded-xl bg-primary px-5 py-2 text-white transition hover:bg-secondary disabled:opacity-50"
    >
      <BiArrowBack />
      Back to dashboard
    </button>
  );
}
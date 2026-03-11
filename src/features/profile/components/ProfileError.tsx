type Props = {
  error: string | null;
};

export default function ProfileError({ error }: Props) {
  if (!error) return null;

  return (
    <div className="mt-4 rounded-xl bg-red-200/50 p-3 font-semibold text-red-600">
      * {error}
    </div>
  );
}
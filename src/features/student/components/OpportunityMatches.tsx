import type { Opportunity } from "../student";

function chip(text: string) {
  return (
    <span
      key={text}
      className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs"
    >
      {text}
    </span>
  );
}

type Props = {
  opportunities: Opportunity[];
};

export default function OpportunityMatches({ opportunities }: Props) {
  return (
    <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
      <h2 className="text-xl font-semibold text-primary">Opportunity Matches</h2>
      <p className="mt-1 text-sm text-black/70">
        Based on your major and interests, here are opportunities you may want to explore on campus.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opportunities.map((o) => (
          <div key={o.id} className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-primary">{o.title}</p>
              <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1 text-xs">
                {o.type}
              </span>
            </div>

            <p className="mt-2 text-sm text-black/70">{o.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {o.tags.map(chip)}
            </div>

            {o.link ? (
              <a
                className="mt-4 inline-block rounded-2xl bg-primary px-4 py-2 text-white transition hover:bg-secondary"
                href={o.link}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
            ) : (
              <button
                type="button"
                className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-2 transition hover:opacity-80"
                onClick={() => console.log("Open opportunity:", o.id)}
              >
                View details
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
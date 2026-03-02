import { useMemo, useState } from "react";

type Continent =
  | "North America"
  | "South America"
  | "Europe"
  | "Africa"
  | "Asia"
  | "Oceania";

type VideoItem = {
  id: string; // id interno
  title: string;
  youtubeId: string; // <-- troque pelos IDs reais do YouTube
  continent: Continent;
  region: string; // ex: "LATAM", "Andean", "Western Europe"
  language: string; // ex: "English", "Spanish", "Portuguese"
  tags?: string[];
};

const VIDEOS: VideoItem[] = [
  // ⚠️ IDs abaixo são placeholders — troque pelos reais do UK/UKY
  {
    id: "v1",
    title: "UK Campus Tour 2026 | Explore the University of Kentucky with Real Students",
    youtubeId: "FCD9apyidFE",
    continent: "North America",
    region: "USA",
    language: "English",
    tags: ["welcome", "international", "overview"],
  },
  {
    id: "v2",
    title: "University of Kentucky First-Generation Student Stories",
    youtubeId: "Rn2IqaQCufs?si=_UcIXPHOQAftIEYT",
    continent: "North America",
    region: "USA",
    language: "English",
    tags: ["campus tour", "student life"],
  },
  {
    id: "v3",
    title: "Student Story: Moving Abroad & Finding Community",
    youtubeId: "CJPu3XRk7mk?si=X8NNbZHXzVlbTHPa",
    continent: "South America",
    region: "Brazil",
    language: "Portuguese",
    tags: ["story", "community"],
  },
  {
    id: "v4",
    title: "Student Interview: Research Opportunities & Support",
    youtubeId: "YQRLG1v76KA?si=1jVqSh2mW9PsD-Pb",
    continent: "Europe",
    region: "Western Europe",
    language: "French",
    tags: ["research", "academics"],
  },
  {
    id: "v5",
    title: "International Admissions Tips: Application & Next Steps",
    youtubeId: "n9jFxWRD0OU?si=k_3YBYo81NxIU9PF",
    continent: "Asia",
    region: "South Asia",
    language: "English",
    tags: ["admissions", "tips"],
  },
  {
    id: "v6",
    title: "UK Grad, First in Her Family to Earn a College Degree, Hopes to Make Our World Healthier",
    youtubeId: "aBg4SYNrnes?si=KGwpHZ2mywwgvp2p",
    continent: "Africa",
    region: "West Africa",
    language: "English",
    tags: ["clubs", "events"],
  },
];

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white overflow-hidden">
      <div className="aspect-video w-full bg-black">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="p-4">
        <h3 className="text-base font-semibold text-primary">{video.title}</h3>

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1">
            {video.continent}
          </span>
          <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1">
            {video.region}
          </span>
          <span className="rounded-full border border-black/10 bg-[#e8f0fe] px-2 py-1">
            {video.language}
          </span>
        </div>

        {video.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-black/70">
            {video.tags.map((t) => (
              <span key={t} className="rounded-full border border-black/10 px-2 py-1">
                #{t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdmissionDashboard() {
  const [continent, setContinent] = useState<Continent | "All">("All");
  const [region, setRegion] = useState<string>("All");

  const continents = useMemo(
    () => ["All", ...uniqueSorted(VIDEOS.map((v) => v.continent))] as const,
    []
  );

  const regionOptions = useMemo(() => {
    const scoped = continent === "All" ? VIDEOS : VIDEOS.filter((v) => v.continent === continent);
    return ["All", ...uniqueSorted(scoped.map((v) => v.region))];
  }, [continent]);

  const filtered = useMemo(() => {
    return VIDEOS.filter((v) => {
      const okContinent = continent === "All" ? true : v.continent === continent;
      const okRegion = region === "All" ? true : v.region === region;
      return okContinent && okRegion;
    });
  }, [continent, region]);

  return (
    <div className="mainContent bg-[url('/speckled-texture-bg.png')] bg-cover bg-center">
      <div className="mx-auto w-full max-w-6xl p-6">
        {/* Header */}
        <div className="rounded-2xl border border-primary bg-white p-6">
          <h1 className="text-3xl font-semibold text-primary">Admissions Dashboard</h1>
          <p className="mt-2 text-black/70">
            Filter and review short explainer videos, interviews, and international student content.
            This helps the admissions team quickly find region-relevant materials for outreach,
            info sessions, and visits.
          </p>

          {/* Filters */}
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="w-full md:w-[280px]">
                <label className="text-sm font-medium text-primary">Continent</label>
                <select
                  className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                  value={continent}
                  onChange={(e) => {
                    const next = e.target.value as Continent | "All";
                    setContinent(next);
                    setRegion("All"); // reset region when continent changes
                  }}
                >
                  {continents.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-[320px]">
                <label className="text-sm font-medium text-primary">Region</label>
                <select
                  className="mt-2 w-full rounded-xl border border-black/10 bg-[#e8f0fe] px-3 py-2"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {regionOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-black/60">
                Showing <span className="font-semibold text-black">{filtered.length}</span>{" "}
                video(s)
              </div>
            </div>
          </div>

          {/* Videos */}
          <div className="mt-6">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/70">
                No videos found for the selected filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
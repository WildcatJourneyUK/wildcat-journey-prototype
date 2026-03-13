import { useMemo, useState } from "react";
import type { Continent, VideoItem } from "../admissions";
import { uniqueSorted } from "../admissionHelpers";
import DashboardFilters from "../components/DashboardFilters";
import VideoCard from "../components/VideoCard";

type Props = {
  videos: VideoItem[];
};

export default function VideoLibrarySection({ videos }: Props) {
  const [continent, setContinent] = useState<Continent | "All">("All");
  const [region, setRegion] = useState<string>("All");

  const continents = useMemo<readonly (Continent | "All")[]>(() => {
    const values = uniqueSorted(videos.map((v) => v.continent)) as Continent[];
    return ["All", ...values];
  }, [videos]);

  const regionOptions = useMemo(() => {
    const scoped =
      continent === "All"
        ? videos
        : videos.filter((v) => v.continent === continent);

    return ["All", ...uniqueSorted(scoped.map((v) => v.region))];
  }, [continent, videos]);

  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const okContinent = continent === "All" ? true : v.continent === continent;
      const okRegion = region === "All" ? true : v.region === region;
      return okContinent && okRegion;
    });
  }, [continent, region, videos]);

  return (
    <div className="mt-6 rounded-2xl border border-primary bg-white p-6">
      <DashboardFilters
        continent={continent}
        region={region}
        continents={continents}
        regionOptions={regionOptions}
        filteredCount={filtered.length}
        onChangeContinent={(value) => {
          setContinent(value);
          setRegion("All");
        }}
        onChangeRegion={setRegion}
      />

      <div className="mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/70">
            No videos found for the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
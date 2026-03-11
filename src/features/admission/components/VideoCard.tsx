import type { VideoItem } from "../admissions";

type Props = {
  video: VideoItem;
};

export default function VideoCard({ video }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
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
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/10 px-2 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
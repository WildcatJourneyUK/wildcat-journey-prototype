import AdmissionsHeader from "./sections/AdmissionHeader";
import VideoLibrarySection from "./sections/VideoLibrarySection";
import { videosMock } from "./AdmissionMockData";

export default function AdmissionsDashboard() {
  return (
    <div className="mainContent bg-[url('/speckled-texture-bg.png')] bg-cover bg-center">
      <div className="mx-auto w-full max-w-6xl p-6">
        <AdmissionsHeader />
        <VideoLibrarySection videos={videosMock} />
      </div>
    </div>
  );
}
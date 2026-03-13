import HeroSection from "./sections/HeroSection";
import DashboardTabsSection from "./sections/DashboardTabsSection";
import AboutSection from "./sections/AboutSection";

export default function LandingPage() {
  return (
    <main className="bg-[url('/speckled-texture-bg.png')] bg-cover bg-center text-[#111827]">
      <HeroSection />
      <DashboardTabsSection />
      <AboutSection />
    </main>
  );
}
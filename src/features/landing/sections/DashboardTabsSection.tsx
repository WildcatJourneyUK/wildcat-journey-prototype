import { useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";

import wjTinyLogo from "../../../../public/wj-tiny-logo.png";

type DashboardTab = "student" | "ambassador" | "admissions";

type DashboardContent = {
  id: DashboardTab;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

const dashboardContent: DashboardContent[] = [
  {
    id: "student",
    label: "Student",
    eyebrow: "For prospective and current students",
    title: "A clearer path from curiosity to confidence.",
    description:
      "The student dashboard turns a complex process into a structured journey. Students can track their level, complete quests, earn XP, unlock badges, and access guidance that feels relevant to where they are in the process.",
    bullets: [
      "Level-based journey: Explorer, Applicant, Admitted, Current Wildcat",
      "Quests with videos, quizzes, and interactive checklists",
      "Mentorship matches based on interests, language, and academic goals",
      "Opportunities matching for the Current Wildcat level with relevant events, jobs, scholarships, and student orgs",
    ],
  },
  {
    id: "ambassador",
    label: "Ambassador",
    eyebrow: "For mentorship and guidance",
    title: "A more structured way to support students.",
    description:
      "The ambassador dashboard helps mentors guide students with similar interests. It centralizes mentorship matches and gives ambassadors tools to manage quests, opportunities, and badges in a way that supports consistency across the program.",
    bullets: [
      "Mentorship match based on country, language, intended major, or interests",
      "Quest, badge, and opportunity management",
      "More organized support for students with similar backgrounds",
    ],
  },
  {
    id: "admissions",
    label: "Admission",
    eyebrow: "For outreach and recruitment",
    title: "Better content organization for more relevant outreach.",
    description:
      "The admissions dashboard acts as a curated content hub. Teams can filter videos and stories by continent or region, making it easier to find the right materials for presentations, outreach efforts, and conversations with prospective students.",
    bullets: [
      "Filter video content by continent and region",
      "Centralized international student marketing content",
      "More targeted and strategic communication",
      "Support ambassadors and students through the platform",
    ],
  },
];

export default function DashboardTabsSection() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("student");

  const active = useMemo(
    () => dashboardContent.find((item) => item.id === activeTab)!,
    [activeTab]
  );

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
        <Fade triggerOnce>
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-6xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary border border-secondary/10 text-white px-3 py-1 text-sm text-primary">
                <img src={wjTinyLogo} alt="" className="h-4 w-4" aria-hidden="true" />
                <span>Platform concept</span>
              </div>

              <h2 className="text-3xl font-semibold text-primary sm:text-4xl">
                One platform, three perspectives.
              </h2>

              <p className="mt-4 text-black sm:text-lg">
                Wildcat Journey was designed to support the same mission from
                different angles: helping students move forward with more
                clarity, helping ambassadors mentor with more structure, and
                helping admissions teams communicate with more relevance.
              </p>
            </div>
          </div>
        </Fade>
        
        <div key={active.id}>
          <div className="overflow-hidden lg:h-[480px] md:h-[650px] sm:h-[650px] rounded-[30px] border border-black/10 bg-white shadow-sm">
            <div className="bg-lightBlue px-2 pt-2 sm:px-3 sm:pt-3">
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {dashboardContent.map((tab) => {
                  const selected = tab.id === activeTab;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={[
                        "relative min-w-[140px] flex-1 whitespace-nowrap rounded-t-[28px] px-5 py-4 text-center text-sm font-medium transition-all sm:min-w-0 sm:px-8 sm:text-base",
                        selected
                          ? "bg-white text-primary shadow-[0_-1px_0_rgba(0,0,0,0.04)]"
                          : "bg-primary text-white hover:bg-secondary",
                      ].join(" ")}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white h-max p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-primary sm:text-3xl">
                    {active.title}
                  </h3>

                  <p className="mt-4 text-base leading-7 text-black">
                    {active.description}
                  </p>

                  <div className="mt-6 space-y-3">
                    {active.bullets.map((item) => (
                      <div key={item} className="flex gap-3">
                        <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                        <p className="text-sm leading-6 text-black sm:text-base">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
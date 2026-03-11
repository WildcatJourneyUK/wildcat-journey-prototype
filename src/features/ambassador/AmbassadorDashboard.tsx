import { useEffect, useState } from "react";
import { getUser } from "../../services/AuthProvider";
import { ProfileService } from "../../services/ProfileService";

import type { AmbassadorHeaderData } from "./ambassador";
import {
  initialBadges,
  initialOpportunities,
  initialQuests,
  matchesMock,
} from "./AmbassadorMockData";

import AmbassadorHeader from "./sections/AmbassadorHeader";
import StudentMatchesSection from "./sections/StudentMatches";
import QuestManagementSection from "./sections/QuestManagement";
import BadgeManagementSection from "./sections/BadgeManagement";
import OpportunityManagementSection from "./sections/OpportunityManagement";

export default function AmbassadorDashboard() {
  const [headerData, setHeaderData] = useState<AmbassadorHeaderData | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (!user) return;

      const bundle = await ProfileService.getBundle(user);
      if (bundle.role !== "ambassador") return;

      setHeaderData({
        fullName: bundle.base.full_name,
        major: bundle.ambassador?.major ?? null,
        interests: bundle.ambassador?.interests ?? [],
      });
    })();
  }, []);

  return (
    <div className="mainContent bg-[url('/speckled-texture-bg.png')] bg-cover bg-center">
      <div className="mx-auto w-full max-w-6xl p-6">
        <AmbassadorHeader headerData={headerData} />

        <StudentMatchesSection matches={matchesMock} />

        <QuestManagementSection initialQuests={initialQuests} />

        <BadgeManagementSection initialBadges={initialBadges} />

        <OpportunityManagementSection
          initialOpportunities={initialOpportunities}
        />
      </div>
    </div>
  );
}
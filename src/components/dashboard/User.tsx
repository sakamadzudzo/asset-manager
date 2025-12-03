import { DashboardInfo, Statistic } from "@/utils/types";
import { Dashboard } from "./Dashboard";
import { useEffect, useState } from "react";

export const UserDashboard = ({ user }: { user: any }) => {
  const [stats, setStats] = useState({
    myAssets: 0,
    myCategories: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const assetsRes = await fetch(`/api/asset?action=example`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });

        const assets = await assetsRes.json();
        const myAssets = Array.isArray(assets) ? assets : [];

        const uniqueCategories = new Set(
          myAssets.map((a: any) => a.category_id).filter(Boolean)
        );

        setStats({
          myAssets: myAssets.length,
          myCategories: uniqueCategories.size,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    if (user?.id) {
      fetchStats();
    }
  }, [user]);

  const infos: DashboardInfo[] = [
    {
      title: "My Assets",
      info: [
        `${stats.myAssets} assets created by you`,
        `${stats.myCategories} categories in your assets`,
      ],
    },
  ];

  const statistics: Statistic[] = [
    {
      statistic: stats.myAssets,
      detail: "My Assets",
      colors: "bg-primary/80 hover:shadow-primary",
    },
    {
      statistic: stats.myCategories,
      detail: "My Categories",
      colors: "bg-secondary/80 hover:shadow-secondary",
    },
  ];

  const title = `User Dashboard – Welcome, ${user.firstname}`;

  return (
    <Dashboard
      title={title}
      statistics={statistics}
      infos={infos}
      key="user-dashboard"
    />
  );
};

import { DashboardInfo, Statistic } from "@/utils/types";
import { Dashboard } from "./Dashboard";

export const UserDashboard = ({ user }: { user: any }) => {
  const recentActivity = [
    "Admitted baby John Doe (ID: 12345)",
    `Completed "Neonatal Resuscitation" training`,
    "Updated case for baby Jane Smith (ID: 12346)",
  ];

  const infos: DashboardInfo[] = [
    {
      title: "Recent Activity",
      info: recentActivity,
    },
  ];

  const statistics: Statistic[] = [
    {
      statistic: 3,
      detail: "Babies Admitted Today",
      colors: "bg-primary/80 hover:shadow-primary",
    },
    {
      statistic: 12,
      detail: "Open Cases",
      colors: "bg-secondary/80 hover:shadow-secondary",
    },
    {
      statistic: 2,
      detail: "Trainings Scheduled",
      colors: "bg-success/80 hover:shadow-success",
    },
  ];

  const title = `User Dashboard – Welcome, ${user.name}`;

  return (
    <Dashboard
      title={title}
      statistics={statistics}
      infos={infos}
      key="admin-dashboard"
    />
  );
};

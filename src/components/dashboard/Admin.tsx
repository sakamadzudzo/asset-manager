import { DashboardInfo, Statistic } from "@/utils/types";
import { Dashboard } from "./Dashboard";

export const AdminDashboard = ({ user }: { user: any }) => {
  const sysOverview = [
    "3 new users registered today",
    "1 system update pending",
    "All data backups successful",
  ];

  const recentActivity = [
    "Dr. Smith added a new case",
    `Nurse Lee completed "Infection Control" training`,
    "Admin updated user permissions",
  ];

  const infos: DashboardInfo[] = [
    {
      title: "System Overview",
      info: sysOverview,
    },
    {
      title: "Recent Activity",
      info: recentActivity,
    },
  ];

  const statistics: Statistic[] = [
    {
      statistic: 8,
      detail: "Babies Admitted Today",
      colors: "bg-primary/80 hover:shadow-primary",
    },
    {
      statistic: 34,
      detail: "Open Cases",
      colors: "bg-secondary/80 hover:shadow-secondary",
    },
    {
      statistic: 5,
      detail: "Trainings Scheduled",
      colors: "bg-success/80 hover:shadow-success",
    },
    {
      statistic: 1,
      detail: "Critical Alerts",
      colors: "bg-danger/80 hover:shadow-danger",
    },
  ];

  const title = `Admin Dashboard – Welcome, ${user.name}`;

  return (
    <Dashboard
      title={title}
      statistics={statistics}
      infos={infos}
      key="admin-dashboard"
    />
  );
};

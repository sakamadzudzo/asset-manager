import { DashboardInfo, Statistic } from "@/utils/types";
import { Dashboard } from "./Dashboard";
import { useEffect, useState } from "react";

export const AdminDashboard = ({ user }: { user: any }) => {
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalUsers: 0,
    totalDepartments: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [assetsRes, usersRes, deptsRes, catsRes] = await Promise.all([
          fetch("/api/asset?action=all"),
          fetch("/api/user?action=all"),
          fetch("/api/department?action=all"),
          fetch("/api/category?action=all"),
        ]);

        const assets = await assetsRes.json();
        const users = await usersRes.json();
        const departments = await deptsRes.json();
        const categories = await catsRes.json();

        setStats({
          totalAssets: Array.isArray(assets) ? assets.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalDepartments: Array.isArray(departments) ? departments.length : 0,
          totalCategories: Array.isArray(categories) ? categories.length : 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  const infos: DashboardInfo[] = [
    {
      title: "System Overview",
      info: [
        `${stats.totalAssets} total assets in system`,
        `${stats.totalUsers} registered users`,
        `${stats.totalDepartments} departments`,
      ],
    },
  ];

  const statistics: Statistic[] = [
    {
      statistic: stats.totalAssets,
      detail: "Total Assets",
      colors: "bg-primary/80 hover:shadow-primary",
    },
    {
      statistic: stats.totalUsers,
      detail: "Total Users",
      colors: "bg-secondary/80 hover:shadow-secondary",
    },
    {
      statistic: stats.totalDepartments,
      detail: "Departments",
      colors: "bg-success/80 hover:shadow-success",
    },
    {
      statistic: stats.totalCategories,
      detail: "Categories",
      colors: "bg-info/80 hover:shadow-info",
    },
  ];

  const title = `Admin Dashboard – Welcome, ${user.firstname}`;

  return (
    <Dashboard
      title={title}
      statistics={statistics}
      infos={infos}
      key="admin-dashboard"
    />
  );
};

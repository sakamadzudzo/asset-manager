import { AdminDashboard } from "@/components/dashboard/Admin";
import { LandingPage } from "@/components/dashboard/Landing";
import { UserDashboard } from "@/components/dashboard/User";
import { Role } from "@/utils/types";
import React from "react";
import { useSelector } from "react-redux";

export default function Home({
  incrementLoading,
  decrementLoading,
  isAuthenticated,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
  isAuthenticated: boolean;
}) {
  const { token, user } = useSelector((state: any) => state.auth);

  if (!isAuthenticated) {
    return (
      <LandingPage
        incrementLoading={incrementLoading}
        decrementLoading={decrementLoading}
      />
    );
  }
  if (user?.roles.includes(Role.ADMIN.toString())) {
    return <AdminDashboard user={user} />;
  }
  return <UserDashboard user={user!} />;
}

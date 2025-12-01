import React, { useEffect } from "react";
import MyNavbar, { MyDropdown } from "./MyNavbar";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function Navbar_Staff({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) {
  const { token, user } = useSelector((state: any) => state.auth);
  const [rawMenuItems, setRawMenuItems] = React.useState<MyDropdown[]>([]);
  const [menuItems, setMenuItems] = React.useState<MyDropdown[]>([]);
  const router = useRouter();

  const isItSelected = (url: string) => {
    if (router.pathname === url) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const genralItems: MyDropdown[] = [
      {
        label: "Subjects",
        dropdown: [
          { label: "All", href: "/subject/all", className: "" },
          { label: " Subject Years", href: "/subject/year/all", className: "" },
        ],
      },
    ];

    const protectedItems: MyDropdown[] = [
      { label: "Teachers", href: "/teacher/all", className: "" },
      { label: "Users", href: "/user/all", className: "" },
    ];

    const reportItems: MyDropdown[] = [
      {
        label: "Reports",
        dropdown: [
          {
            label: "Report 1",
            href: "/reports/report-1",
            className: "",
          },
          {
            label: "Report 2",
            href: "/reports/report-1",
            className: "",
          },
          {
            label: "Report 3",
            href: "/reports/report-1",
            className: "",
          },
          {
            label: "Report 4",
            href: "/reports/report-1",
            className: "",
          },
        ],
      },
    ];

    const rawItems: MyDropdown[] = [
      ...genralItems,
      ...(user?.roles?.includes("ADMIN") ? protectedItems : []),
      ...reportItems,
    ];

    setRawMenuItems(rawItems);
  }, [user]);

  useEffect(() => {
    setMenuItems(
      rawMenuItems.map((item) => ({
        ...item,
        isActive: item.href ? isItSelected(item.href) : undefined,
        dropdown: item.dropdown
          ? item.dropdown.map((sub) => ({
              ...sub,
              isActive: sub.href ? isItSelected(sub.href) : undefined,
            }))
          : undefined,
      }))
    );
  }, [rawMenuItems]);

  return (
    <>
      <MyNavbar menuItems={menuItems} hasAvatar={true} />
    </>
  );
}

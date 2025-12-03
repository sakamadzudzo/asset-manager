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
    const genralItems: MyDropdown[] = [{ label: "Assets", href: "/asset/all" }];

    const adminItems: MyDropdown[] = [
      { label: "Users", href: "/user/all" },
      { label: "Categories", href: "/category/all" },
      { label: "Departments", href: "/department/all" },
    ];

    const rawItems: MyDropdown[] = [
      ...genralItems,
      ...(user?.roles?.includes("ADMIN") ? adminItems : []),
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

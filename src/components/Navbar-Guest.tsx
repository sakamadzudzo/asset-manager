import React from "react";
import MyNavbar, { MyDropdown } from "./MyNavbar";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useSelector } from "react-redux";

export default function Navbar_Guest({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) {
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const { token, user } = useSelector((state: any) => state.auth);

  const menuItems: MyDropdown[] = [
    { label: "Home", href: "/", className: "" },
    { label: "About", href: "/about", className: "" },
    { label: "Contact", href: "/contact", className: "" },
    {
      label: "Login",
      href: "#",
      asButton: true,
      color: "primary",
      variant: "solid",
      onClick: () => setLoginOpen(true),
    },
    {
      label: "Register",
      href: "#",
      asButton: true,
      color: "primary",
      variant: "solid",
      onClick: () => setRegisterOpen(true),
    },
  ];

  return (
    <>
      <LoginModal
        isOpen={loginOpen}
        onOpenChange={setLoginOpen}
        incrementLoading={incrementLoading}
        decrementLoading={decrementLoading}
      />
      <RegisterModal
        isOpen={registerOpen}
        onOpenChange={setRegisterOpen}
        incrementLoading={incrementLoading}
        decrementLoading={decrementLoading}
      />
      <MyNavbar menuItems={menuItems} />
    </>
  );
}

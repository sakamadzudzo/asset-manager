import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import React, { useEffect } from "react";
import { Logo } from "./Logo";
import AvatarDropdown from "./AvatarDropdown";
import { useRouter } from "next/router";

export type MyDropdown = {
  label: string;
  href?: string;
  className?: string;
  asButton?: boolean;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "default"
    | undefined;
  variant?: "flat" | "solid" | "light" | "ghost" | undefined;
  onClick?: () => void;
  dropdown?: MyDropdown[];
  isActive?: boolean;
};

type MyNavbarProps = {
  menuItems: MyDropdown[];
  hasAvatar?: boolean;
};

export default function MyNavbar({ menuItems, hasAvatar }: MyNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isMenuOpen) {
      setOpenDropdown(null);
    }
  }, [isMenuOpen]);

  const goTo = (href: string) => {
    href ? router.push(href) : () => {};
  };

  return (
    <Navbar
      className={`mb-2`}
      shouldHideOnScroll
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        item: [
          "md:flex",
          "md:relative",
          "md:h-full",
          "md:items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand
          className="flex justify-start items-center cursor-pointer"
          onClick={() => goTo("/")}
        >
          <Logo />
          <p className="font-bold text-inherit">Practical</p>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {renderDesktopMenu(menuItems, 1)}
      </NavbarContent>
      {hasAvatar && (
        <NavbarContent className="hidden sm:flex" justify="end">
          <AvatarDropdown />
        </NavbarContent>
      )}

      {/* Mobile Menu Toggle */}

      {/* Mobile Menu */}
      <NavbarMenu>
        {hasAvatar && (
          <div className="flex justify-end px-4 py-2">
            <AvatarDropdown />
          </div>
        )}
        {renderMobileMenu(menuItems, openDropdown, setOpenDropdown, 1)}
      </NavbarMenu>
    </Navbar>
  );
}

function renderDesktopMenu(items: MyDropdown[], depth = 0) {
  return items.map((item) =>
    item.dropdown ? (
      <Dropdown key={item.label} className={``}>
        <DropdownTrigger>
          <NavbarItem className={`cursor-pointer pl-${depth * 1}`}>
            {item.label}
          </NavbarItem>
        </DropdownTrigger>
        <DropdownMenu>
          {item.dropdown.map((sub) => (
            <DropdownItem
              key={sub.label}
              as={Link}
              href={sub.href}
              className={sub.className}
            >
              {sub.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    ) : item.asButton ? (
      <NavbarItem
        key={item.label}
        className={item.className}
        isActive={item.isActive || false}
      >
        <Button
          as={Link}
          color={item.color}
          href={item.href}
          onPress={item.onClick}
          variant={item.variant}
        >
          {item.label}
        </Button>
      </NavbarItem>
    ) : (
      <NavbarItem
        key={item.label}
        as={Link}
        href={item.href}
        className={item.className}
        isActive={item.isActive || false}
      >
        {item.label}
      </NavbarItem>
    )
  );
}

function renderMobileMenu(
  items: MyDropdown[],
  openDropdown: string | null,
  setOpenDropdown: (label: string | null) => void,
  depth = 0
) {
  return items.map((item) =>
    item.dropdown ? (
      <div key={item.label}>
        <NavbarMenuItem
          className={`cursor-pointer font-semibold pl-${depth * 4}`}
          onClick={() =>
            setOpenDropdown(openDropdown === item.label ? null : item.label)
          }
        >
          {item.label}
        </NavbarMenuItem>
        {openDropdown === item.label &&
          renderMobileMenu(
            item.dropdown,
            openDropdown,
            setOpenDropdown,
            depth + 1
          )}
      </div>
    ) : item.asButton ? (
      <NavbarItem
        key={item.label}
        className={`cursor-pointer pl-${depth * 4} ${item.className}`}
      >
        <Button
          as={Link}
          color={item.color}
          href={item.href}
          onPress={() => setOpenDropdown(null)}
          variant={item.variant}
        >
          {item.label}
        </Button>
      </NavbarItem>
    ) : (
      <NavbarMenuItem
        key={item.label}
        as={Link}
        href={item.href}
        className={`cursor-pointer pl-${depth * 4} ${item.className}`}
        onClick={() => setOpenDropdown(null)}
      >
        <Link
          className="w-full"
          color={item.color === "default" ? "foreground" : item.color}
          href={item.href}
          size="lg"
        >
          {item.label}
        </Link>
      </NavbarMenuItem>
    )
  );
}

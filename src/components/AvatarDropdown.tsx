import React from "react";
import {
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { getInitials } from "@/utils/helpers";
import { GearIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";

export default function AvatarDropdown() {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  return (
    <Dropdown className={` `}>
      <DropdownTrigger>
        <Avatar
          src={user?.avatarUrl}
          name={getInitials(user)}
          size="md"
          color="primary"
          className="cursor-pointer"
        >
          {!user?.avatarUrl && getInitials(user)}
        </Avatar>
      </DropdownTrigger>
      <DropdownMenu className={`text-foreground `}>
        {/* <DropdownItem
          as="a"
          href={`/user/one?id=${user?.id}`}
          key={"profile"}
          endContent={<UserIcon weight="thin" size={25} />}
        >
          Profile
        </DropdownItem>
        <DropdownItem
          as="a"
          href="/settings"
          key={"settings"}
          endContent={<GearIcon weight="thin" size={25} />}
        >
          Settings
        </DropdownItem> */}
        <DropdownItem
          color="danger"
          onClick={() => dispatch(logout())}
          key={"logout"}
          endContent={<SignOutIcon weight="thin" size={25} />}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

import { getAuthUserDetails } from "@/lib/queries";
import React from "react";
import MenuOptions from "./menu-options";

type Props = {};

const Sidebar = async ({}: Props) => {
  const user = await getAuthUserDetails();
  if (!user) return null;

  let sideBarLogo = user.avatarUrl || "/assets/plural-logo.svg";

  const sidebarOpt = user.SidebarOption;

  return (
    <>
      <MenuOptions
        defaultOpen
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        user={user}
      />
    </>
  );
};

export default Sidebar;

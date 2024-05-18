import Sidebar from "@/components/sidebar";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/info-bar";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const user = await currentUser();

  if (!user) return redirect("/");

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar />

      <div className="md:pl-[300px]">
        <InfoBar />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

import UserDetails from "@/components/forms/user-details";
import BlurPage from "@/components/global/blur-page";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import React from "react";

type Props = {
  params: { userId: string };
};

const SettingsPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const userDetails = await db.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  if (!userDetails) return null;

  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <UserDetails userData={userDetails} editing />
      </div>
    </BlurPage>
  );
};

export default SettingsPage;

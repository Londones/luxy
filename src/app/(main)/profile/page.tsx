import UserDetails from "@/components/forms/user-details";
import Unauthorized from "@/components/unauthorized";
import { getAuthUserDetails } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

const MainPage = async ({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) => {
  const user = await getAuthUserDetails();

  if (user) {
    if (searchParams.plan) {
      return redirect(`/profile/${user.id}/billing?plan=${searchParams.plan}`);
    }
    if (searchParams.state) {
      const statePath = searchParams.state.split("___")[0];
      const stateUserId = searchParams.state.split("___")[1];
      if (!stateUserId) return <div>Not Authorized</div>;
      return redirect(
        `/profile/${stateUserId}/${statePath}?code=${searchParams.code}`
      );
    } else return redirect(`/profile/${user.id}`);
  }
  const authUser = await currentUser();

  if (!authUser) return redirect("/profile/sign-up");

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl">Set Up Your Account</h1>
        <UserDetails
          userData={{ email: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
};

export default MainPage;

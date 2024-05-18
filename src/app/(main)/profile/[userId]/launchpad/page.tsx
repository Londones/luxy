import BlurPage from "@/components/global/blur-page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getStripeOAuthLink } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: {
    userId: string;
  };
  searchParams: {
    code: string;
  };
};

const LauchPadPage = async ({ params, searchParams }: Props) => {
  const userDetails = await db.user.findUnique({
    where: {
      id: params.userId,
    },
  });

  if (!userDetails) return;

  const allDetailsExist = userDetails.name && userDetails.email;

  const stripeOAuthLink = getStripeOAuthLink(`launchpad___${userDetails.id}`);

  let connectedStripeAccount = false;

  if (searchParams.code) {
    if (!userDetails.connectAccountId) {
      try {
        const response = await stripe.oauth.token({
          grant_type: "authorization_code",
          code: searchParams.code,
        });
        await db.user.update({
          where: { id: params.userId },
          data: { connectAccountId: response.stripe_user_id },
        });
        connectedStripeAccount = true;
      } catch (error) {
        console.log("🔴 Could not connect stripe account");
      }
    }
  }

  return (
    <BlurPage>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full h-full max-w-[800px]">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Let&apos;s get started!</CardTitle>
              <CardDescription>
                Follow the steps below to get your account setup.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                  <Image
                    src="/stripelogo.png"
                    alt="app logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <p>
                    Connect your Stripe account to accept payment and see your
                    dashboard
                  </p>
                </div>
                {userDetails.connectAccountId || connectedStripeAccount ? (
                  <CheckCircleIcon
                    size={50}
                    className="text-primary p-2 flex-shrink-0"
                  />
                ) : (
                  <Link
                    href={stripeOAuthLink}
                    className="bg-primary py-2 px-4 rounded-md text-muted"
                  >
                    Start
                  </Link>
                )}
              </div>
              <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                  <Image
                    src={userDetails.avatarUrl}
                    alt="app logo"
                    height={80}
                    width={80}
                    className="rounded-md object-contain"
                  />
                  <p>Fill in all your account details</p>
                </div>
                {allDetailsExist ? (
                  <CheckCircleIcon
                    size={50}
                    className="text-primary p-2 flex-shrink-0"
                  />
                ) : (
                  <Link
                    href={`/profile/${params.userId}/settings`}
                    className="bg-primary py-2 px-4 rounded-md text-white"
                  >
                    Start
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BlurPage>
  );
};

export default LauchPadPage;

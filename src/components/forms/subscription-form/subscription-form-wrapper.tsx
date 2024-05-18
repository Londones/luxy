"use client";
import Loading from "@/components/global/loading";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { pricingCards } from "@/lib/constants";
import { getStripe } from "@/lib/stripe/stripe-client";
import { useModal } from "@/providers/modal-provider";
import { Plan } from "@prisma/client";
import { StripeElementsOptions } from "@stripe/stripe-js";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import SubscriptionForm from ".";
import { db } from "@/lib/db";
import { getAuthUserDetails } from "@/lib/queries";
import { stripe } from "@/lib/stripe";
import { subscriptionCreated } from "@/lib/stripe/stripe-actions";

type Props = {
  customerId: string;
  planExists: boolean;
};

const SubscriptionFormWrapper = ({ customerId, planExists }: Props) => {
  const { data, setClose } = useModal();
  const router = useRouter();
  const [selectedPriceId, setSelectedPriceId] = React.useState<Plan | "">(
    data?.plan?.defaultPriceId || ""
  );
  const [subscription, setSubscription] = React.useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({ subscriptionId: "", clientSecret: "" });

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription.clientSecret,
      appearance: {
        theme: "flat",
      },
    }),
    [subscription]
  );

  useEffect(() => {
    if (!selectedPriceId) {
      return;
    }
    const createSecret = async () => {
      const response = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        body: JSON.stringify({
          priceId: selectedPriceId,
          customerId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setSubscription({
        subscriptionId: data.subscriptionId,
        clientSecret: data.clientSecret,
      });
      const subscription = await stripe.subscriptions.retrieve(
        data.subscriptionId
      );

      console.log(subscription);

      await subscriptionCreated(subscription, customerId);

      if (planExists) {
        toast({
          title: "Subscription Updated",
          description: "Your subscription has been updated",
        });
        setClose();
        router.refresh();
      }
    };
    createSecret();
  }, [data, selectedPriceId, customerId, planExists, setClose, router]);

  return (
    <div className="border-none transition-all">
      <div className="flex flex-col gap-4">
        {data.plan?.plans.map((plan) => (
          <Card
            key={plan.id}
            className={clsx("relative cursor-pointer transition-all", {
              "border-primary": selectedPriceId === plan.id,
            })}
            onClick={() => setSelectedPriceId(plan.id as Plan)}
          >
            <CardHeader>
              <CardTitle>
                ${plan.unit_amount ? plan.unit_amount / 100 : "0"}
                <p className="text-sm text-muted-foreground">{plan.nickname}</p>
                <p className="text-sm text-muted-foreground">
                  {pricingCards.find((p) => p.priceId === plan.id)?.description}
                </p>
              </CardTitle>
            </CardHeader>
            {selectedPriceId === plan.id && (
              <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-4 right-4" />
            )}
          </Card>
        ))}
        {options.clientSecret && !planExists && (
          <>
            <h1 className="text-xl">Payment Method</h1>
            <Elements stripe={getStripe()} options={options}>
              <SubscriptionForm selectedPriceId={selectedPriceId} />
            </Elements>
          </>
        )}
        {!options.clientSecret && selectedPriceId && (
          <div className="flex items-center justify-center w-full h-40">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionFormWrapper;

"use server";

import Stripe from "stripe";
import { db } from "../db";
import { stripe } from ".";

export const subscriptionCreated = async (
  subscription: Stripe.Subscription,
  customerId: string
) => {
  try {
    const user = await db.user.findFirst({
      where: {
        customerId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const data = {
      active: subscription.status === "active",
      userId: user.id,
      customerId,
      currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
      subscritiptionId: subscription.id,
      //@ts-ignore
      priceId: subscription.plan.id,
      //@ts-ignore
      plan: subscription.plan.id,
      //@ts-ignore
      price: (subscription.plan.amount / 100).toString(),
    };

    const res = await db.subscription.upsert({
      where: {
        userId: user.id,
      },
      create: data,
      update: data,
    });

    // update user subscriptionId
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        subscriptionId: subscription.id,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const getConnectAccountProducts = async (stripAccount: string) => {
  const products = await stripe.products.list(
    {
      limit: 50,
      expand: ["data.default_price"],
    },
    {
      stripeAccount: stripAccount,
    }
  );
  return products.data;
};

import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { StripeCustomerType } from "@/lib/types";

export async function POST(req: Request) {
  const { email, name }: StripeCustomerType = await req.json();

  if (!email || !name) {
    return new NextResponse("Address, Email, Name and Shipping are required", {
      status: 400,
    });
  }

  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return Response.json({ customerId: customer.id });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error creating customer", {
      status: 500,
    });
  }
}

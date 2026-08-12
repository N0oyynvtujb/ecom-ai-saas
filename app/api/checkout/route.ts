import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    customer_email: session.user.email,
    success_url: `${request.nextUrl.origin}/dashboard?upgraded=true`,
    cancel_url: `${request.nextUrl.origin}/dashboard`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
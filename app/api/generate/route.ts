import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const prisma = new PrismaClient();

const FREE_LIMIT = 3;

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "You must be signed in." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userEmail = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (user?.plan === "free" && user.usageCount >= FREE_LIMIT) {
    return new Response(
      JSON.stringify({
        error: `You've used all ${FREE_LIMIT} free generations. Upgrade to continue.`,
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.json();
  const { productName, features } = body;

  if (!productName || productName.trim() === "") {
    return new Response(
      JSON.stringify({ error: "Product name is required." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const prompt = `Product name: ${productName}\nKey features: ${features || "none specified"}`;

  try {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          const claudeStream = anthropic.messages.stream({
            model: "claude-sonnet-5",
            max_tokens: 1024,
            system:
              "You are an eCommerce copywriting assistant. Given a product name and key features, write a polished product description, an SEO-friendly title, and 3-5 bullet points highlighting benefits. Output plain text only — do not use Markdown formatting of any kind (no #, ##, **, -, or other symbols). Structure it with clear line breaks and simple labels like 'Title:', 'Description:', and 'Key Benefits:' instead of headers or bold text. Do not include any commentary — output only the requested content.",
            messages: [{ role: "user", content: prompt }],
          });

          for await (const event of claudeStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          await prisma.user.update({
            where: { email: userEmail },
            data: { usageCount: { increment: 1 } },
          });

          controller.close();
        } catch (streamErr) {
          controller.error(streamErr);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: any) {
    const status = err?.status ?? 500;
    return new Response(
      JSON.stringify({ error: "The AI provider is temporarily unavailable." }),
      { status, headers: { "Content-Type": "application/json" } }
    );
  }
}
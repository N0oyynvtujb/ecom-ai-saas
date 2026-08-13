import { auth } from "@/auth";
import { handleSignIn } from "./actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="h-[3px] bg-gradient-to-r from-[#0F5C4F] via-[#0F5C4F] to-[#B8934A]" />

      <div className="max-w-2xl mx-auto px-4 py-22 text-center">
        <div className="w-12 h-12 rounded-full bg-[#0F5C4F] flex items-center justify-center mx-auto">
          <span className="font-serif text-white text-xl">P</span>
        </div>

        <h1 className="font-serif text-4xl text-[#1C1E1B] tracking-tight mb-4">
          Product listings, written in seconds
        </h1>
        <p className="text-[#6B6963] font-sans text-base mb-10 leading-relaxed">
          Give it a product name and a few features — get back a polished
          description, SEO title, and bullet points, ready to paste into your
          store.
        </p>

        <form action={handleSignIn}>
          <button className="bg-[#0F5C4F] text-white px-6 py-3 rounded-sm text-sm font-sans cursor-pointer hover:bg-[#0C4B41] transition-colors">
            Sign in with Google to get started
          </button>
        </form>

        <p className="text-xs text-[#8A887E] font-sans mt-4">
          You&apos;ll be redirected to Google to sign in, then brought straight
          to your dashboard. We only use your name and email — nothing is
          posted or shared on your behalf.
        </p>

        <div className="mt-16 grid grid-cols-3 gap-6 text-left">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#6B6963] font-sans mb-2">
              Free to try
            </p>
            <p className="text-sm text-[#1C1E1B] font-sans">
              3 listings on us, no card required.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#6B6963] font-sans mb-2">
              Built for sellers
            </p>
            <p className="text-sm text-[#1C1E1B] font-sans">
              Written for eCommerce, not generic copy.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#6B6963] font-sans mb-2">
              Ready to paste
            </p>
            <p className="text-sm text-[#1C1E1B] font-sans">
              Plain text, no formatting to strip out.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
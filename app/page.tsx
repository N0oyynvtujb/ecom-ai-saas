import { auth } from "@/auth";
import { handleSignIn } from "./actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
      <form action={handleSignIn}>
        <button className="bg-[#0F5C4F] cursor-pointer text-white px-4 py-2 rounded-sm font-sans text-sm">
          Sign in with Google
        </button>
      </form>
    </main>
  );
}
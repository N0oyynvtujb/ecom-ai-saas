import { auth } from "@/auth";
import { handleSignOut } from "../actions";
import GenerateForm from "./GenerateForm";
import UpgradeButton from "./UpgradeButton";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? "" },
  });

  const initial = session?.user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <main className="min-h-screen flex flex-col items-center bg-[#FAFAF8] p-8">
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0F5C4F] flex items-center justify-center shrink-0">
            <span className="font-serif text-white text-sm">{initial}</span>
          </div>
          <div className="font-sans text-[#6B6963] text-sm">
            <p>{session?.user?.email}</p>
            <p className="text-xs mt-1">
              Plan: {user?.plan === "paid" ? "Pro" : "Free"} ·{" "}
              {user?.plan === "paid"
                ? `${user?.usageCount} generations used`
                : `${user?.usageCount}/3 free generations used`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user?.plan === "free" && <UpgradeButton />}
          <form action={handleSignOut}>
            <button className="text-sm cursor-pointer font-sans text-[#0F5C4F]">
              Sign out
            </button>
          </form>
        </div>
      </div>
      <GenerateForm />
    </main>
  );
}
import { generateUsername } from "@/app/_actions/generate-username";
import AccountSetupForm from "@/components/auth/account-setup-form";
import { db } from "@/server/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const isVerifiedUser = await db.user.findUnique({
    where: {
      id: user.id,
      email: user.email ?? "",
    },
  });

  if (isVerifiedUser) redirect("/");

  const username = (await generateUsername(user)) ?? "";

  return (
    <div className="mx-auto flex h-[95vh] w-full max-w-lg flex-col items-center justify-center gap-6">
      <AccountSetupForm username={username} />
    </div>
  );
}

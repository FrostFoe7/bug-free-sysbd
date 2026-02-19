import MobileNavbar from "@/components/layouts/mobile-navbar";
import SiteHeader from "@/components/layouts/site-header";
import { db } from "@/server/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface PagesLayoutProps {
  children: React.ReactNode;
}

export default async function PagesLayout({ children }: PagesLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const dbUser = await db.user.findUnique({
      where: {
        id: user.id,
        email: user.email ?? "",
      },
    });

    if (!dbUser) redirect("/account?origin=/");
  }

  return (
    <>
      <SiteHeader />
      <main className="container max-w-[620px] px-4 sm:px-6">{children}</main>
      <MobileNavbar />
    </>
  );
}

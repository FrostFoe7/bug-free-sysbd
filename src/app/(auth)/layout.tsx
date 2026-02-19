import Banner from "@/components/threads-banner";
import SiteFooter from "@/components/layouts/site-footer";
import QRcode from "@/components/qr-code";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return (
    <>
      <div className="h-screen bg-[#101010]">
        <Banner />
        <div className="absolute top-2/4 left-2/4 z-50 w-full -translate-x-2/4 -translate-y-2/4 px-4 sm:-translate-y-[40%] sm:px-0">
          {children}
        </div>
        <SiteFooter />
      </div>
      <QRcode />
    </>
  );
}

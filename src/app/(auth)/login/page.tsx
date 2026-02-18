import OAuthLogin from "@/components/auth/oauth-login";
import LoginForm from "@/components/forms/login-form";
import React from "react";

export default function LoginPage() {
  return (
    <div className="z-50 mx-auto w-full max-w-[370px] py-16 text-center">
      <LoginForm />
      <div className="text-center text-[15px] text-[#777777]">
        Forget password?
      </div>
      <div className="mt-6 space-y-5">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#393939]" />
          </div>
          <div className="relative flex items-center justify-center text-xs">
            <span className="bg-[#101010] px-3 text-base text-white">or</span>
          </div>
        </div>
        <OAuthLogin />
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { authSchema, signUpSchema } from "@/lib/validations/auth";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const { signIn, signUp } = useSupabaseAuth();
  const [isPending, startTransition] = React.useTransition();

  const currentSchema = mode === "login" ? authSchema : signUpSchema;
  type Inputs = z.infer<typeof authSchema> & { confirmPassword?: string };

  const form = useForm<Inputs>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      identifier: "",
      password: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    form.reset({
      identifier: "",
      password: "",
      confirmPassword: "",
    });
  }, [mode, form]);

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        if (mode === "login") {
          const { error } = await signIn(data.identifier, data.password);
          if (error) {
            toast.error(error.message || "Invalid email or password");
          } else {
            router.push("/");
            toast.success("Logged in successfully!");
          }
        } else {
          const { error } = await signUp(data.identifier, data.password);
          if (error) {
            toast.error(error.message || "Something went wrong during signup");
          } else {
            toast.success("Account created! Please check your email.");
            setMode("login");
          }
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div>
      <span className="font-bold text-white select-none">
        {mode === "login" ? "Log in with your account" : "Create your account"}
      </span>

      <Form {...form}>
        <form
          className="flex w-full flex-col gap-1.5 py-4 text-start"
          onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        >
          <FormField
            control={form.control}
            name="identifier"
            render={({ field, formState }) => {
              const error = formState.errors.identifier;
              return (
                <FormItem>
                  <FormControl>
                    <Input
                      autoFocus
                      className={cn(
                        "h-14 min-h-min rounded-xl border-none bg-[#1e1e1e] px-4 text-[15px] font-medium tracking-normal text-white ring-0 outline-hidden placeholder:text-[#777777] focus-visible:ring-1 focus-visible:ring-[#393939] focus-visible:ring-offset-0 dark:focus-visible:ring-[#393939]",
                        {
                          "placeholder:text-red-700 focus-visible:ring-red-700 dark:focus-visible:ring-red-700":
                            error,
                        },
                      )}
                      placeholder={error ? error.message : "Email"}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, formState }) => {
              const error = formState.errors.password;
              return (
                <FormItem>
                  <FormControl>
                    <Input
                      className={cn(
                        "h-14 min-h-min rounded-xl border-none bg-[#1e1e1e] px-4 text-[15px] font-medium tracking-normal text-white ring-0 outline-hidden placeholder:text-[#777777] focus-visible:ring-1 focus-visible:ring-[#393939] focus-visible:ring-offset-0 dark:focus-visible:ring-[#393939]",
                        {
                          "placeholder:text-red-700 focus-visible:ring-red-700 dark:focus-visible:ring-red-700":
                            error,
                        },
                      )}
                      placeholder={error ? error.message : "Password"}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          {mode === "signup" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, formState }) => {
                const error = formState.errors.confirmPassword;
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        className={cn(
                          "h-14 min-h-min rounded-xl border-none bg-[#1e1e1e] px-4 text-[15px] font-medium tracking-normal text-white ring-0 outline-hidden placeholder:text-[#777777] focus-visible:ring-1 focus-visible:ring-[#393939] focus-visible:ring-offset-0 dark:focus-visible:ring-[#393939]",
                          {
                            "placeholder:text-red-700 focus-visible:ring-red-700 dark:focus-visible:ring-red-700":
                              error,
                          },
                        )}
                        placeholder={error ? error.message : "Confirm Password"}
                        type="password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="font my-1 h-14 rounded-xl bg-white text-base font-semibold text-black hover:bg-white"
          >
            {isPending ? (
              <Icons.loading className="h-10 w-10" aria-hidden="true" />
            ) : mode === "login" ? (
              "Log in"
            ) : (
              "Sign up"
            )}
            <span className="sr-only">
              {mode === "login" ? "Sign in" : "Sign up"}
            </span>
          </Button>

          <p className="mt-2 text-center text-sm text-[#777777]">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-semibold text-white hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-semibold text-white hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </Form>
    </div>
  );
}

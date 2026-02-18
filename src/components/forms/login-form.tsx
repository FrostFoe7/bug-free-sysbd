"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { authSchema } from "@/lib/validations/auth";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Icons } from "@/components/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";

export default function LoginForm() {
  const router = useRouter();
  type Inputs = z.infer<typeof authSchema>;

  const { signIn } = useSupabaseAuth();
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        const { error } = await signIn(data.identifier, data.password);

        if (error) {
          toast.error(error.message || "Invalid email or password");
        } else {
          router.push(`${window.location.origin}/`);
        }
      } catch (err) {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div>
      <span className="font-bold text-white select-none">
        Log in with your account
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
          <Button
            type="submit"
            disabled={isPending}
            className="font my-1 h-14 rounded-xl bg-white text-base font-semibold text-black hover:bg-white"
          >
            {isPending ? (
              <Icons.loading className="h-10 w-10" aria-hidden="true" />
            ) : (
              "Log in"
            )}
            <span className="sr-only">Sign in</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}

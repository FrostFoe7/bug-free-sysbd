"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Globe, Lock, Plus, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/trpc/react";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ResizeTextarea } from "@/components/ui/resize-textarea";
import { Privacy } from "@prisma/client";
import type { User } from "@prisma/client";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { uploadFile } from "@/lib/supabase/storage";

type UserSetupProps = Pick<User, "bio" | "link" | "privacy" | "username"> & {
  fullname: string;
  image: string;
};

export default function AccountSetupForm({ username }: { username: string }) {
  const { user } = useSupabaseAuth();
  const router = useRouter();

  const [showPrivacyPage, setShowPrivacyPage] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    (user?.user_metadata?.avatar_url as string) ?? null,
  );
  const [isUploading, setIsUploading] = React.useState(false);

  function getFullName(firstName: string, lastName: string) {
    if (
      !lastName ||
      lastName === undefined ||
      lastName === null ||
      lastName === ""
    ) {
      return firstName;
    }

    return `${firstName} ${lastName}`;
  }

  const [userAccountData, setUserAccountData] = React.useState<UserSetupProps>({
    bio: "",
    link: "",
    privacy: Privacy.PUBLIC,
    username: username,
    fullname: getFullName(
      (user?.user_metadata?.first_name as string) ?? "",
      (user?.user_metadata?.last_name as string) ?? "",
    ),
    image: (user?.user_metadata?.avatar_url as string) ?? "",
  });

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserAccountData({
      ...userAccountData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutate: accountSetup, isPending: isSettingUp } =
    api.auth.accountSetup.useMutation({
      onSuccess: ({ success, username }) => {
        if (success) {
          router.push("/");
        }
        toast.success(`Welcome to Sysm ${username} !`);
      },
      onError: (err) => {
        toast.error("AuthCallBack: Something went wrong!");
        if (err.data?.code === "UNAUTHORIZED") {
          router.push("/login");
        }
      },
      retry: false,
    });

  const isLoading = isSettingUp || isUploading;

  const FormSchema = z.object({
    url: z
      .string()
      .url()
      .refine((url) => {
        try {
          const parsedUrl = new URL(url);
          return parsedUrl.protocol === "https:";
        } catch {
          return false;
        }
      }, "Must be a valid URL")
      .or(z.literal("")),
    fullname: z.string().min(1, "Name is required").max(50),
    username: z.string().min(3, "Username must be at least 3 characters").max(30),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
      fullname: userAccountData.fullname,
      username: userAccountData.username,
    },
  });

  async function handleAccountSetup() {
    let finalImageUrl = userAccountData.image;

    if (selectedImage) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadFile(selectedImage, "threads-images");
      } catch (error) {
        toast.error("Image upload failed");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    accountSetup({
      bio: userAccountData.bio!,
      link: userAccountData.link!,
      privacy: userAccountData.privacy,
      fullname: userAccountData.fullname,
      username: userAccountData.username,
      image: finalImageUrl,
    });
  }

  function handleSecurity(data: z.infer<typeof FormSchema>) {
    setUserAccountData({
      ...userAccountData,
      link: data.url,
      fullname: data.fullname,
      username: data.username,
    });
    setShowPrivacyPage(true);
  }

  return (
    <div className="mx-auto flex h-[95vh] w-full max-w-lg flex-col items-center justify-center gap-6 px-6">
      {!showPrivacyPage ? (
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-1.5 py-4 text-start"
            onSubmit={(...args) =>
              void form.handleSubmit(handleSecurity)(...args)
            }
          >
            <div className="flex w-full flex-col items-center justify-center gap-1">
              <h2 className="scroll-m-20 text-4xl font-bold tracking-wide">
                Profile
              </h2>
              <span className="text-muted-foreground leading-7">
                Customize your Sysm profile
              </span>
              <Card className="my-4 w-full rounded-2xl bg-transparent p-6 px-8 sm:mt-10">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="w-full space-y-4">
                      <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <div className="my-1 flex h-7 items-center gap-2">
                                <Plus className="h-4 w-4 text-[#4D4D4D]" />
                                <Input
                                  {...field}
                                  className="text-accent-foreground min-h-min border-0 bg-transparent p-0 text-[15px] ring-0 outline-hidden placeholder:text-[#777777] focus-visible:ring-0 focus-visible:ring-offset-0"
                                  placeholder="Your name"
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="my-1 flex h-7 items-center gap-2">
                                <Plus className="h-4 w-4 text-[#4D4D4D]" />
                                <Input
                                  {...field}
                                  className="text-accent-foreground min-h-min border-0 bg-transparent p-0 text-[15px] ring-0 outline-hidden placeholder:text-[#777777] focus-visible:ring-0 focus-visible:ring-offset-0"
                                  placeholder="username"
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="relative">
                      <Avatar className="outline-border h-16 w-16 rounded-full outline-1 outline-solid">
                        <AvatarImage
                          src={imagePreview ?? ""}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          <User2 className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="image-upload"
                        className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-foreground text-background hover:opacity-90 shadow-sm border border-border"
                      >
                        <Plus className="h-4 w-4" />
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  <Label htmlFor="bio">Bio</Label>
                  <div className="flex gap-2">
                    <Plus className="mt-1 h-4 w-4 text-[#4D4D4D]" />
                    <ResizeTextarea
                      name="bio"
                      className="max-h-[100px] whitespace-break-spaces select-none"
                      maxLength={100}
                      value={userAccountData.bio!}
                      onChange={handleFieldChange}
                      placeholder="Write bio"
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>Link</FormLabel>
                        <FormControl>
                          <div className="my-1 flex h-7 items-center gap-2">
                            <Plus className="h-4 w-4 text-[#4D4D4D]" />
                            <Input
                              maxLength={50}
                              type="url"
                              className="text-accent-foreground min-h-min resize-none rounded-none border-0 bg-transparent p-0 text-[15px] whitespace-break-spaces ring-0 outline-hidden select-none placeholder:text-[#777777] focus-visible:ring-0 focus-visible:ring-offset-0"
                              placeholder="Add link"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        {fieldState.error && (
                          <p className="text-xs text-red-500">
                            {fieldState.error.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
              <Button
                type="submit"
                className="bg-foreground hover:bg-foreground w-full rounded-xl text-white select-none dark:text-black"
              >
                Continue &rarr;
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-1">
          <h2 className="scroll-m-20 text-4xl font-bold tracking-wide">
            Privacy
          </h2>
          <span className="text-muted-foreground text-center leading-7">
            Your privacy can be different on Sysm and Instagram.
          </span>

          <RadioGroup
            defaultValue="public"
            className="mt-6 flex w-full flex-col gap-3 sm:mt-10"
          >
            <div>
              <RadioGroupItem
                value="public"
                id="public"
                className="peer sr-only"
              />
              <Label
                htmlFor="public"
                className="border-muted text-muted-foreground peer-data-[state=checked]:border-foreground [&:has([data-state=checked])]:border-foreground flex flex-col rounded-xl border-2 bg-transparent px-6 py-5 text-sm font-normal"
                onClick={() =>
                  setUserAccountData({
                    ...userAccountData,
                    privacy: Privacy.PUBLIC,
                  })
                }
              >
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h1 className="text-base font-medium text-black dark:text-slate-100">
                    Public profile
                  </h1>
                  <Globe className="h-5 w-5" />
                </div>
                <span className="max-w-[350px]">
                  Anyone on or off Sysm can see, share and interact with your
                  content.
                </span>
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="private"
                id="private"
                className="peer sr-only"
              />
              <Label
                htmlFor="private"
                className="border-muted text-muted-foreground peer-data-[state=checked]:border-foreground [&:has([data-state=checked])]:border-foreground flex flex-col rounded-xl border-2 bg-transparent px-6 py-5 text-sm font-normal"
                onClick={() =>
                  setUserAccountData({
                    ...userAccountData,
                    privacy: Privacy.PRIVATE,
                  })
                }
              >
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h1 className="text-base font-medium text-black dark:text-slate-100">
                    Private profile
                  </h1>
                  <Lock className="h-5 w-5" />
                </div>
                <span className="max-w-[350px]">
                  Only your approved followers can see, share and interact with
                  your content.
                </span>
              </Label>
            </div>
          </RadioGroup>
          <Button
            className="bg-foreground hover:bg-foreground mt-4 w-full rounded-xl text-white select-none dark:text-black"
            onClick={handleAccountSetup}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Create my profile
            <span className="sr-only">Create my profile</span>
          </Button>
        </div>
      )}
    </div>
  );
}

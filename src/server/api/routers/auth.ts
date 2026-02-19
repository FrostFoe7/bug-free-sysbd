import { z } from "zod";
import { emailToUsername, getUserEmail } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { Privacy } from "@prisma/client";
import { generateUsername } from "@/app/_actions/generate-username";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { env } from "@/env.mjs";

export const authRouter = createTRPCRouter({
  accountSetup: privateProcedure
    .input(
      z.object({
        bio: z.string(),
        link: z.string(),
        privacy: z.nativeEnum(Privacy).default("PUBLIC"),
        username: z.string().min(3).max(30).optional(),
        fullname: z.string().min(1).max(50).optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const email = getUserEmail(user);
      const defaultUsername =
        (await generateUsername(user)) ?? emailToUsername(user);
      const username = input.username ?? defaultUsername;

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

      const defaultFullname = getFullName(
        (user?.user_metadata?.first_name as string) ?? "",
        (user?.user_metadata?.last_name as string) ?? "",
      );
      const fullname = input.fullname ?? defaultFullname;

      const dbUser = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!dbUser) {
        await ctx.db.$transaction(async (prisma) => {
          const created_user = await prisma.user.create({
            data: {
              id: userId,
              username,
              fullname,
              image:
                input.image ??
                (user.user_metadata?.avatar_url as string) ??
                null,
              privacy: input.privacy,
              bio: input.bio,
              link: input.link,
              email,
              verified: true,
            },
          });

          if (env.ADMIN_USER_ID && env.ADMIN_USER_ID.trim() !== "") {
            await prisma.notification.create({
              data: {
                isPublic: false,
                type: "ADMIN",
                senderUserId: env.ADMIN_USER_ID,
                receiverUserId: created_user.id,
                message: `Hey ${created_user.fullname}! Welcome to Threads. I hope you like this project. If so, please make sure to give it a star on GitHub and share your views on Twitter. Thanks.`,
              },
            });
          }
        });
      } else {
        await ctx.db.user.update({
          where: { id: userId },
          data: {
            username,
            fullname,
            image: input.image ?? dbUser.image,
            bio: input.bio,
            link: input.link,
            privacy: input.privacy,
          },
        });
      }

      return {
        username,
        success: true,
      };
    }),
});

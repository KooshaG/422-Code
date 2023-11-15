import { router, publicProcedure, protectedProcedure } from "./trpc";
import { prisma } from "@/prismaClient"; 
import { z } from "zod";


export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return await prisma.user.findMany();
  }),
  getDoorbells: publicProcedure
  .input(z.string().optional())
  .query(async (opts) => {
    const userId = opts.input;
    if (userId)
      return await prisma.doorbell.findMany({
        where: {
          userId: userId,
        }
      })
    return await prisma.doorbell.findMany({
      include: {
        user:{
          select: {
            name: true
          }
        }
      }
    });
  }),

  createDoorbell: publicProcedure.mutation(async () => {
    return await prisma.doorbell.create({
      data: {
        registrationCode: Math.floor(Math.random() * 10000),
      }
    })
  }),

  ringDoorbell: publicProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const doorbellId = opts.input;
    return await prisma.doorbellLog.create({
      data: {
        message: "Rang doorbell from website",
        doorbell: {
           connect: {
            id: doorbellId
           }
        }
      },
    })
  }),

  pairDoorbell: publicProcedure
    .input(z.object({
      doorbellId: z.number(),
      userId: z.string()
    }))
    .mutation(async (opts) => {
      const doorbellId = opts.input.doorbellId
      const userId = opts.input.userId
      return prisma.doorbell.update({
        where: {
          id: doorbellId
        },
        data: {
          user: {
            connect: {
              id: userId
            }
          }
        }
      })
    }),
  
  getDoorbellLogs: publicProcedure
    .input(z.number())
    .query(async (opts) => {
      const doorbellId = opts.input
      const doorbell = await prisma.doorbell.findUnique({
        where: { id: doorbellId },
        include: {
          logs: {}
        }
      })
      return doorbell?.logs ?? []
    })
})

export type AppRouter = typeof appRouter;
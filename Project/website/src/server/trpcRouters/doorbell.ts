import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from "@/prismaClient"; 
import { randomInt } from 'crypto';
import { TRPCError } from '@trpc/server'

export const doorbellRouter = router({
  getUserDoorbells: publicProcedure
  .input(z.string().optional())
  .query(async (opts) => {
    const userId = opts.input;
    if (userId)
      return await prisma.doorbell.findMany({
        orderBy: {
          id: 'desc'
        },
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
  
  get: publicProcedure
  .input(z.object({
    doorbellId: z.number(),
    userId: z.string()
  }))
  .query(async (opts) => {
    const doorbellId = opts.input.doorbellId
    const userId = opts.input.userId
    var doorbell = await prisma.doorbell.findUnique({
      where: {
        id: doorbellId
      },
      include: {
        logs: true
      }
    });
    if (doorbell?.userId === userId) {
      return doorbell;
    }
    return null;
  }),

  create: publicProcedure
  .mutation(async (opts) => {
    var found = true;
    var code = randomInt(1,10000);
    while (found) {
      code = randomInt(1,10000);
      const bell = await prisma.doorbell.findUnique({ 
        where: {
          registrationCode: code
        }
      })
      found = !!bell;
    }

    return await prisma.doorbell.create({
      data: {
        registrationCode: code
      }
    })
  }),

  update: publicProcedure
  .input(z.object({
    id: z.number(),
    name: z.string(),
    silentStart: z.string().nullable(),
    silentEnd: z.string().nullable()
  }))
  .mutation(async (opts) => {
    return await prisma.doorbell.update({
      where: {
        id: opts.input.id,
      },
      data: {
        name: opts.input.name,
        silentStart: opts.input.silentStart,
        silentEnd: opts.input.silentEnd
      }
    })
  }),

  pair: publicProcedure
  .input(z.object({
    registrationCode: z.number(),
    userId: z.string()
  }))
  .mutation(async (opts) => {
    const registrationCode = opts.input.registrationCode
    const userId = opts.input.userId
    const doorbell = await prisma.doorbell.findUnique({where: {registrationCode: registrationCode}});
    if (!doorbell) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Doorbell not found'
      })
    }
    return await prisma.doorbell.update({
      where: {
        registrationCode: registrationCode
      },
      data: {
        user: {
          connect: {
            id: userId
          }
        },
        registrationCode: (-doorbell.id)
      }
    })
  }),

  getLogs: publicProcedure
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
    }),
  
  ring: publicProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const doorbellId = opts.input;
      console.log(new Date(Date.now() - (5 * 60 * 60 * 1000)));
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
})
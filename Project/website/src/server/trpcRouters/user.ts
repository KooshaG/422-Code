import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from "@/prismaClient"; 

export const userRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.user.findMany();
  })
})
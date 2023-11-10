import { router, publicProcedure, protectedProcedure } from "./trpc";
import { prisma } from "@/prismaClient"; 

export const appRouter = router({
  getUsers: protectedProcedure.query(async () => {
    return await prisma.user.findMany();
  })
})

export type AppRouter = typeof appRouter;
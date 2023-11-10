import { router, publicProcedure } from "./trpc";
import { prisma } from "@/prismaClient"; 

export const appRouter = router({
  getUsers: publicProcedure.query(async () => {
    return await prisma.user.findMany();
  })
})

export type AppRouter = typeof appRouter;
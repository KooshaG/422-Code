import { router, publicProcedure, protectedProcedure } from "./trpc";
import { prisma } from "@/prismaClient"; 
import { z } from "zod";

import { doorbellRouter } from "./trpcRouters/doorbell";
import { userRouter } from "./trpcRouters/user";


export const appRouter = router({
  doorbell: doorbellRouter,
  user: userRouter
})

export type AppRouter = typeof appRouter;
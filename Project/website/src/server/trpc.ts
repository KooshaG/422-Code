import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { initTRPC, TRPCError, type inferAsyncReturnType } from '@trpc/server';
import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';
import superjson from 'superjson';

interface CreateContextOptions {
  headers: Headers;
}
 
export const createInnerTRPCContext = async (opts: CreateContextOptions) => {
  const session = await getServerSession(authOptions);
  
  return {
    session,
    headers: opts.headers,
  };
};

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  // Fetch stuff that depends on the request

  return await createInnerTRPCContext({
    headers: opts.req.headers,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: ctx.session,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed)
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { type AppRouter } from "@/server";
import superjson from 'superjson';

export const api = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${process.env.NEXTAUTH_URL}/api/trpc`,
    }),
  ],
});
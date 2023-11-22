import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { type AppRouter } from "@/server";
import { SuperJSON } from 'superjson';

export const api = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: `${process.env.NEXTAUTH_URL}/api/trpc`,
    }),
  ],
});
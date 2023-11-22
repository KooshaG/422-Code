import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

import { type AppRouter } from "@/server";
import { SuperJSON } from 'superjson';

const url = process.env.DEPLOYED ? `https://${process.env.NEXT_PUBLIC_URL}/api/trpc` : `${process.env.NEXT_PUBLIC_URL}/api/trpc`

export const api = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: url,
    }),
  ],
});
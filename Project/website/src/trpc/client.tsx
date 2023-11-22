"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";

import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server";
import SuperJSON from "superjson";

export const api = createTRPCReact<AppRouter>({});

export default function TRPCProvider({ children }: { children: React.ReactNode }) {
  const url = process.env.NEXT_PUBLIC_URL?.startsWith("127") ? `${process.env.NEXT_PUBLIC_URL}/api/trpc` : `https://${process.env.NEXT_PUBLIC_URL}/api/trpc` 
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: url,
        }),
      ],
    })
  );
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
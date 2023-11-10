"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";

import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server";

export const api = createTRPCReact<AppRouter>({});

export default function TRPCProvider({ children }: { children: React.ReactNode }) {
  let baseUrl = "help";
  if (window != undefined) {
    baseUrl = window.location.origin;
  } 
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${baseUrl}/api/trpc`,
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
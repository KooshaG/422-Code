import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";
import { appRouter } from "@/server";
import { createTRPCContext } from "@/server/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({req}),
    onError: ({path, error}) => {
      console.error(`tRPC failed on ${path ?? "<no-path>"}: ${error.message}`)
    }
  });

export { handler as GET, handler as POST };
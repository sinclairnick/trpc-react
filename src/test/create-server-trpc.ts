import { AnyRouter } from "@trpc/server";
import { createTRPCReactServer } from "../create-trpc-react/server/create-trpc-react-server";
import { createTestRouter } from "./create-router";

export const createTRPCServerTest = <AppRouter extends AnyRouter>() => {
  const appRouter = createTestRouter();

  const trpc = createTRPCReactServer({
    appRouter,
    createContext: () => ({}),
  });

  return { trpc };
};

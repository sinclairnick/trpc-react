import { AnyRouter, defaultTransformer } from "@trpc/server";
import { TRPCClientLike } from "../../types";
import { createTRPCReactInner } from "../create-trpc-react-inner";
import {
  CreateTRPCReactServerOptions,
  CreateTRPCReactServerReturn,
} from "./create-trpc-react-server.types";

// Don't import in client-side bundle
export const createTRPCReactServer = <TAppRouter extends AnyRouter>(
  args: CreateTRPCReactServerOptions<TAppRouter>
): CreateTRPCReactServerReturn<TAppRouter> => {
  const { appRouter, createContext } = args;
  const transformer =
    "transformer" in args ? args.transformer : defaultTransformer;
  const caller = appRouter.createCaller(createContext());

  // Using below deprecated methods, as they are the easiest
  // way to achieve this behavaiour
  const clientLike: TRPCClientLike = {
    async mutation(path, input) {
      return caller.mutation(path, input);
    },
    async query(path, input) {
      return caller.query(path, input);
    },
    subscription(path, input) {
      return caller.subscription(path, input) as any;
    },
    runtime: {
      transformer: transformer as any,
    },
  };

  return createTRPCReactInner({ client: clientLike }) as any;
};

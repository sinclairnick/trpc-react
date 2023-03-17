import { createTRPCUntypedClient } from "@trpc/client";
import { AnyRouter } from "@trpc/server";
import { CreateTRPCReactOptions, CreateTRPCReactReturn } from "../types";
import { createTRPCReactInner } from "./create-trpc-react-inner";

export const createTRPCReact = <TAppRouter extends AnyRouter>(
  args: CreateTRPCReactOptions<TAppRouter>
): CreateTRPCReactReturn<TAppRouter> => {
  const client = createTRPCUntypedClient(args.config);

  return createTRPCReactInner({ client });
};

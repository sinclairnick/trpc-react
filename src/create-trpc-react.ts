import { CreateTRPCClientOptions, createTRPCUntypedClient } from "@trpc/client";
import { AnyRouter } from "@trpc/server";
import { createInnerProxy } from "./proxy/create-proxy";
import { getRootHelpers } from "./root-helpers/root-helpers";
import {
  RootHelperKey,
  RootHelperKeys,
  TRPCRootHelpers,
} from "./root-helpers/root-helpers.types";
import {
  CreateTRPCReactOptions,
  CreateTRPCReactReturn,
  TRPCClient,
} from "./types";
import { NoopFn } from "./util/noop.util";
import { isKey } from "./util/is-key.util";
import { getProcedureHelpersForPath } from "./procedure/procedure";

export const createTRPCReactInner = <TAppRouter extends AnyRouter>(args: {
  client: TRPCClient;
}): CreateTRPCReactReturn<TAppRouter> => {
  const { client } = args;
  const rootHelpers = getRootHelpers();

  return new Proxy(NoopFn, {
    get(_obj, name) {
      if (!isKey(name)) return undefined;

      if (RootHelperKeys.includes(name as RootHelperKey)) {
        return (rootHelpers as any)[name];
      }

      return createInnerProxy(name as string, (path, args) => {
        const parts = path.split(".");
        const trpcPath = parts.slice(0, -1).join(".");
        const method = [...parts].pop();
        if (method == null) return;

        const fn = getProcedureHelpersForPath({
          trpcPath,
          method,
          client,
        });

        return fn?.(...args);
      });
    },
  }) as any;
};

export const createTRPCReact = <TAppRouter extends AnyRouter>(
  args: CreateTRPCReactOptions<TAppRouter>
): CreateTRPCReactReturn<TAppRouter> => {
  const client = createTRPCUntypedClient(args.config);

  return createTRPCReactInner({ client });
};

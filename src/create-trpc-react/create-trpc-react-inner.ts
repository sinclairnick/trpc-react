import { AnyRouter } from "@trpc/server";
import { getProcedureHelpersForPath } from "../procedure/procedure";
import { createInnerProxy } from "../proxy/create-proxy";
import { RootHelperKey } from "../root-helpers";
import { getRootHelpers } from "../root-helpers/root-helpers";
import { RootHelperKeys } from "../root-helpers/root-helpers.types";
import { TRPCClientLike, CreateTRPCReactReturn } from "../types";
import { isKey } from "../util/is-key.util";
import { NoopFn } from "../util/noop.util";

export const createTRPCReactInner = <TAppRouter extends AnyRouter>(args: {
  client: TRPCClientLike;
}): CreateTRPCReactReturn<TAppRouter> => {
  const { client } = args;
  const rootHelpers = getRootHelpers({ client });

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

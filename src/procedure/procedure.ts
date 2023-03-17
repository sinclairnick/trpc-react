import { TRPCClientLike } from "../types";
import { getProcedureCommonHelpers } from "./procedure-common/procedure-common";
import { getProcedureMutationHelpers } from "./procedure-mutation/precedure-mutation";
import { getProcedureQueryClientHelpers } from "./procedure-query-client/procedure-query-client";
import { getProcedureQueryHelpers } from "./procedure-query/procedure-query";
import { getProcedureSubscriptionHelpers } from "./procedure-subscription/procedure-subscription";

const getProcedureHelpers = (args: {
  path: string;
  client: TRPCClientLike;
}) => {
  const proc = {
    ...getProcedureQueryHelpers(args),
    ...getProcedureMutationHelpers(args),
    ...getProcedureCommonHelpers(args),
    ...getProcedureSubscriptionHelpers(args),
  };

  return {
    ...proc,
    ...getProcedureQueryClientHelpers(proc),
  };
};

/**
 * Makes the runtime
 */
export const getProcedureHelpersForPath = (args: {
  trpcPath: string;
  method: string;
  client: TRPCClientLike;
}): ((...args: any[]) => any) => {
  const { client, method, trpcPath } = args;

  const helpers = getProcedureHelpers({ path: trpcPath, client });
  const fn = helpers[method as keyof typeof helpers];

  return fn as any;
};

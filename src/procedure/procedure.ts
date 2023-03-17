import { TRPCClient } from "../types";
import { getProcedureCommonHelpers } from "./procedure-common/procedure-common";
import { getProcedureMutationHelpers } from "./procedure-mutation/precedure-mutation";
import { getProcedureQueryHelpers } from "./procedure-query/procedure-query";

const getProcedureHelpers = (args: { path: string; client: TRPCClient }) => {
  return {
    ...getProcedureQueryHelpers(args),
    ...getProcedureMutationHelpers(args),
    ...getProcedureCommonHelpers(args),
    // TODO: Add subscriptions
  };
};

/**
 * Makes the runtime
 */
export const getProcedureHelpersForPath = (args: {
  trpcPath: string;
  method: string;
  client: TRPCClient;
}): ((...args: any[]) => any) => {
  const { client, method, trpcPath } = args;

  const helpers = getProcedureHelpers({ path: trpcPath, client });
  const fn = helpers[method as keyof typeof helpers];

  return fn as any;
};

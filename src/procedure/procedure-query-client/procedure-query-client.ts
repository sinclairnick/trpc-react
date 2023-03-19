import { UseTRPCProcedureCommonHelpers } from "../procedure-common/preocedure-common.types";
import { UseTRPCProcedureMutationHelpers } from "../procedure-mutation/procedure-mutation.types";
import { UseTRPCProcedureQueryHelpers } from "../procedure-query/procedure-query.types";
import {
  QueryClientProcedureMethods,
  TRPCProcedureFetchFn,
  TRPCProcedureFetchInfiniteQuery,
  TRPCProcedurePrefetchFn,
  TRPCProcedurePrefetchInfiniteQuery,
} from "./procedure-query-client.types";

export const getProcedureQueryClientHelpers = (
  proc: UseTRPCProcedureCommonHelpers<any, any, any> &
    UseTRPCProcedureMutationHelpers<any, any> &
    UseTRPCProcedureQueryHelpers<any, any>
): QueryClientProcedureMethods<any, any> => {
  const $fetch: TRPCProcedureFetchFn<any, any> = async (queryClient, input) => {
    return await queryClient.fetchQuery(proc.$key(input), () =>
      proc.$query(input)
    );
  };

  const $prefetch: TRPCProcedurePrefetchFn<any> = async (
    queryClient,
    input
  ) => {
    return await queryClient.prefetchQuery(proc.$key(input), () =>
      proc.$query(input)
    );
  };

  const $fetchInfinite: TRPCProcedureFetchInfiniteQuery<any, any> = async (
    queryClient,
    input,
    opts
  ) => {
    return await queryClient.fetchInfiniteQuery({
      ...opts,
      queryKey: proc.$infiniteKey(input),
      queryFn: () => {
        return proc.$query(input);
      },
    });
  };

  const $prefetchInfinite: TRPCProcedurePrefetchInfiniteQuery<
    any,
    any
  > = async (queryClient, input, opts) => {
    const key = proc.$infiniteKey(input);

    return await queryClient.prefetchInfiniteQuery({
      ...opts,
      queryKey: key,
      queryFn: () => {
        return proc.$query(input);
      },
    });
  };

  return {
    $fetch,
    $prefetch,
    $fetchInfinite,
    $prefetchInfinite,
  };
};

import { useState } from "react";
import type {
  UseTRPCProcedureQueryHelpers,
  UseTRPCProcedureQuery,
  UseTRPCProcedureInfiniteQuery,
  UseTRPCProcedureLazyQuery,
} from "./procedure-query.types";
import {
  useQuery as _useQuery,
  useInfiniteQuery as _useInfiniteQuery,
  useQueryClient as _useQueryClient,
} from "@tanstack/react-query";
import { TRPCClientLike } from "../../types";
import { getCoalescedKey, getInfiniteKey } from "../../util/key.util";

export const getProcedureQueryHelpers = (args: {
  path: string;
  client: TRPCClientLike;
}): UseTRPCProcedureQueryHelpers<any, any> => {
  const { client, path } = args;

  const $query = (input: any) => client.query(path, input);
  const $infiniteKey = () => getInfiniteKey(path);

  const useQuery: UseTRPCProcedureQuery<any, any> = (input, opts) => {
    const key = getCoalescedKey({ path, input, opts });

    return _useQuery({
      queryKey: key,
      queryFn: () => $query(input),
      ...opts,
    });
  };

  const useInfiniteQuery: UseTRPCProcedureInfiniteQuery<any, any> = (
    getInput,
    opts
  ) => {
    const key = $infiniteKey();

    return _useInfiniteQuery({
      ...opts,
      queryKey: key,
      queryFn: (ctx) => {
        const input = getInput(ctx);
        return $query(input);
      },
    });
  };

  // Should this use a different key to useQuery?
  const useLazyQuery: UseTRPCProcedureLazyQuery<any, any> = (opts) => {
    const [input, setInput] = useState<unknown | undefined>();
    const queryClient = _useQueryClient();
    const key = getCoalescedKey({ path, input, opts });

    const isDisabled = opts?.enabled != null && !opts.enabled;

    const query = useQuery(input, {
      ...opts,
      enabled: !isDisabled && Boolean(input),
    });

    const fetch = (input: any, opts: any) => {
      setInput(input);
      return queryClient.fetchQuery({
        queryKey: key,
        queryFn: () => $query(input),
        ...opts,
      });
    };

    return [fetch, query] as any;
  };

  return {
    useQuery,
    useInfiniteQuery,
    useLazyQuery,
    $query,
    $infiniteKey,
  };
};

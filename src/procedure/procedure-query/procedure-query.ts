import type { AnyQueryProcedure } from "@trpc/server";
import { useState } from "react";
import type {
  UseTRPCProcedureQueryHelpers,
  UseTRPCProcedureQuery,
  UseTRPCProcedureInfiniteQuery,
  UseTRPCProcedureLazyQuery,
} from "./procedure-query.types";
import * as RQ from "@tanstack/react-query";
import { TRPCClient } from "../../types";
import { getCoalescedKey, getInfiniteKey } from "../../util/key.util";

export const getProcedureQueryHelpers = (args: {
  path: string;
  client: TRPCClient;
}): UseTRPCProcedureQueryHelpers<any, any> => {
  const { client, path } = args;

  const $query = (input: any) => client.query(path, input);

  const useQuery: UseTRPCProcedureQuery<any, any> = (input, opts) => {
    const key = getCoalescedKey({ path, input, opts });

    return RQ.useQuery({
      queryKey: key,
      queryFn: () => $query(input),
      ...opts,
    });
  };

  const useInfiniteQuery: UseTRPCProcedureInfiniteQuery<any, any> = (opts) => {
    const key = getInfiniteKey(path);

    return RQ.useInfiniteQuery(key, (input) => client.query(path, input), opts);
  };

  // Should this use a different key to useQuery?
  const useLazyQuery: UseTRPCProcedureLazyQuery<any, any> = (opts) => {
    const [input, setInput] = useState<unknown | undefined>();
    const queryClient = RQ.useQueryClient();
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
        queryFn: () => client.query(path, input),
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
  };
};

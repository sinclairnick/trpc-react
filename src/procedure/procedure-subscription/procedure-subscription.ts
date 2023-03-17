import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { UseTRPCProcedureSubscription } from "./procedure-subscription.types";
import { TRPCClientLike } from "../../types";
import { getQueryKey } from "../../util/key.util";
import {
  TRPCSubscribeFn,
  UseTRPCProcedureSubscriptionQuery,
  UseTRPCProcedureSubscriptionHelpers,
} from "./procedure-subscription.types";

// NOTE: Should subscription keys differ to regular keys?
export const getProcedureSubscriptionHelpers = (args: {
  path: string;
  client: TRPCClientLike;
}): UseTRPCProcedureSubscriptionHelpers<any, any> => {
  const { client, path } = args;

  const $subscribe: TRPCSubscribeFn<any> = (input, options = {}) => {
    return client.subscription(path, input, options);
  };

  const useSubscription: UseTRPCProcedureSubscription<any> = (input, opts) => {
    const { enabled = true, ...restOpts } = opts ?? {};

    useEffect(() => {
      let isStopped = false;

      const { unsubscribe } = $subscribe(input, {
        ...restOpts,
        onComplete: () => {
          if (isStopped) return;
          opts?.onComplete?.();
        },
        onData: (data) => {
          if (isStopped) return;
          opts?.onData?.(data);
        },
        onError: (err) => {
          if (isStopped) return;
          opts?.onError?.(err);
        },
        onStarted: () => {
          if (isStopped) return;
          opts?.onStarted?.();
        },
        onStopped: () => {
          if (isStopped) return;
          opts?.onStopped?.();
        },
      });

      return () => {
        isStopped = true;
        unsubscribe();
      };
    }, []);
  };

  const useSubscriptionQuery: UseTRPCProcedureSubscriptionQuery<any, any> = (
    input,
    opts
  ) => {
    const { enabled = true, ...restOpts } = opts ?? {};
    const queryClient = useQueryClient();
    const key = getQueryKey(path, input);

    // Dummy query to .setData on
    const query = useQuery({
      queryKey: key,
      queryFn: () => undefined,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
      enabled,
    });

    useSubscription(input, {
      ...opts,
      onData: (data) => {
        opts?.onData?.(data);
        queryClient.setQueryData(key, data);
      },
    });

    return query as any;
  };

  return {
    $subscription: $subscribe,
    useSubscription,
    useSubscriptionQuery,
  };
};

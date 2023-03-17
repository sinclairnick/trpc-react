import { TRPCClientLike } from "../types";
import { TRPCRootHelpers } from "./root-helpers.types";
import { dehydrate as _dehydrate } from "@tanstack/react-query";

const TRPC_KEY = "__TRPC__";

export const getRootHelpers = (args: {
  client: TRPCClientLike;
}): TRPCRootHelpers => {
  const { client } = args;

  const $dehydrate: TRPCRootHelpers["$dehydrate"] = (queryClient) => {
    const dehydratedState = _dehydrate(queryClient);

    return {
      [TRPC_KEY]: true,
      data: client.runtime.transformer.serialize({
        ...dehydratedState,
      }),
    };
  };

  const $prehydrate: TRPCRootHelpers["$prehydrate"] = (data) => {
    if (TRPC_KEY in data) {
      return client.runtime.transformer.deserialize(data.data);
    }

    // If TRPC didn't serialize it, don't alter dehydrated state
    return data;
  };

  return { $dehydrate, $prehydrate };
};

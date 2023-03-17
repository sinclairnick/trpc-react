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
    return client.runtime.transformer.serialize({
      [TRPC_KEY]: true,
      ...dehydratedState,
    });
  };

  const $prehydrate: TRPCRootHelpers["$prehydrate"] = (data) => {
    const state = data as any;
    const isTrpcSerialized =
      typeof data === "object" && TRPC_KEY in data && data[TRPC_KEY] === true;

    if (isTrpcSerialized) {
      return client.runtime.transformer.deserialize(state);
    }

    // If TRPC didn't serialize it, don't alter dehydrated state
    return state;
  };

  return { $dehydrate, $prehydrate };
};

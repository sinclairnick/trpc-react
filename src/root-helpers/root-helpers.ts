import { TRPCClientLike } from "../types";
import { TRPCRootHelpers } from "./root-helpers.types";
import { dehydrate as _dehydrate } from "@tanstack/react-query";

export const getRootHelpers = (args: {
  client: TRPCClientLike;
}): TRPCRootHelpers => {
  const { client } = args;

  const $dehydrate: TRPCRootHelpers["$dehydrate"] = (queryClient) => {
    const dehydratedState = _dehydrate(queryClient);
    return client.runtime.transformer.serialize(dehydratedState);
  };

  const $prehydrate: TRPCRootHelpers["$prehydrate"] = (data) => {
    const state = data as any;
    return client.runtime.transformer.deserialize(state);
  };

  return { $dehydrate, $prehydrate };
};

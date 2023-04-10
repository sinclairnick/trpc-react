import { TRPCClientLike } from "../../types";
import {
  UseTRPCProcedureMutationHelpers,
  UseTRPCProcedureMutation,
} from "./procedure-mutation.types";
import { useMutation as _useMutation } from "@tanstack/react-query";
import { getQueryKey } from "../../util/key.util";

export const getProcedureMutationHelpers = (args: {
  path: string;
  client: TRPCClientLike;
}): UseTRPCProcedureMutationHelpers<any, any> => {
  const { client, path } = args;

  const $mutate = (input: any) => client.mutation(path, input);

  const useMutation: UseTRPCProcedureMutation<any, any> = (opts) => {
    return _useMutation({
      ...opts,
      mutationKey: opts?.mutationKey ?? getQueryKey(path, undefined),
      mutationFn: $mutate,
    });
  };

  return {
    useMutation,
    $mutate,
  };
};

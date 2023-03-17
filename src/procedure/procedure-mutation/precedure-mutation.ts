import { TRPCClient } from "../../types";
import {
  UseTRPCProcedureMutationHelpers,
  UseTRPCProcedureMutation,
} from "./procedure-mutation.types";
import { useMutation as _useMutation } from "@tanstack/react-query";
import { getQueryKey } from "../../util/key.util";

export const getProcedureMutationHelpers = (args: {
  path: string;
  client: TRPCClient;
}): UseTRPCProcedureMutationHelpers<any, any> => {
  const { client, path } = args;

  const $mutate = (input: any) => client.mutation(path, input);

  const useMutation: UseTRPCProcedureMutation<any, any> = (opts) => {
    const key = getQueryKey(path, undefined);

    return _useMutation({
      mutationKey: key,
      mutationFn: $mutate,
      ...opts,
    });
  };

  return {
    useMutation,
    $mutate,
  };
};

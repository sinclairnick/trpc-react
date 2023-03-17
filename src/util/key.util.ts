import { MutationKey, QueryKey, QueryOptions } from "@tanstack/react-query";

export const getQueryKey = (
  path: string,
  input: any
): QueryKey & MutationKey => {
  const namespacedPath = `trpc.${path}`;
  if (input === undefined) return [namespacedPath];

  return [namespacedPath, input];
};

/** Use provided queryKey, otherwise use derived key */
export const getCoalescedKey = (args: {
  opts: Partial<Pick<QueryOptions, "queryKey">> | undefined;
  path: string;
  input: any;
}) => {
  if (args.opts?.queryKey) return args.opts.queryKey;
  return getQueryKey(args.path, args.input);
};

export const getInfiniteKey = (path: string): QueryKey => {
  return [`${path}.infinite`];
};

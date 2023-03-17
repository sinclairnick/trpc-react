import { DehydratedState, QueryClient } from "@tanstack/react-query";

export type TRPCRootHelpers = {
  // TODO: Add root helpers here
  useQueries: {};
  dehydrate: (client: QueryClient) => DehydratedState;
};

export type RootHelperKey = keyof TRPCRootHelpers;

export const RootHelperKeys: RootHelperKey[] = [];

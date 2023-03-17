import { DehydratedState, QueryClient } from "@tanstack/react-query";

export type TRPCRootHelpers = {
  $dehydrate: (client: QueryClient) => DehydratedState;
  $prehydrate: (dehydratedState: DehydratedState) => DehydratedState;
};

export type RootHelperKey = keyof TRPCRootHelpers;

export const RootHelperKeys: RootHelperKey[] = [];

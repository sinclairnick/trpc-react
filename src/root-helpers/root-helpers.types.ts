import { DehydratedState, QueryClient } from "@tanstack/react-query";

export type DehydratedTrpcState = {
  __TRPC__: true;
  data: DehydratedState;
};

export type TRPCRootHelpers = {
  $dehydrate: (client: QueryClient) => DehydratedTrpcState;
  $prehydrate: (
    dehydratedState: DehydratedState | DehydratedTrpcState
  ) => DehydratedState;
};

export type RootHelperKey = keyof TRPCRootHelpers;

export const RootHelperKeys: RootHelperKey[] = ["$dehydrate", "$prehydrate"];

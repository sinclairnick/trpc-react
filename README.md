# TRPC React

Standalone TRPC React package reimplementing `@trpc/react-query` in a less opinionated way. May eventually be merged into the official `@trpc/react-query` package.

```tsx
pnpm add trpc-react
```

Features:

- 🛠️ Makes integrating TRPC into existing RQ applications seamless

- 🔄 Useful helper methods like getting key, fetcher functions and prefetching exposed.

- 🕸️ SSG not restricted to direct server-side calls

- 🍳 Simpler interface

- 🔌 Plugs into React Query instead of encapsulating and obscuring functionality

- 🧑‍🦯 Agnostic to meta-framework and backend setup

## Motivation

While trying to integrate TRPC into my React app, I 

## API

The API consists of client-side only hooks and various helpers which are particularly useful for integrating with React Query in an idiomatic way.

The API aims to be a superset, and thus drop-in replacement, of the `@trpc/react-query`.

### Create a Client

```tsx
const trpc = createTRPCReact<AppRouter>({
  config: {
    links: [
      /*...*/
    ],
    transformer: SuperJSON,
  },
});
```

### Create Query Provider

```tsx
// _app.tsx or root file
const queryClient = useState(() => new QueryClient());

return <QueryProvider>{children}</QueryProvider>;
```

### Use hooks

#### Use Query

```tsx
const query = trpc.some.procedure.useQuery({
  /* Input */
});
```

#### Use Infinite Query

```tsx
const query = trpc.some.procedure.useInfiniteQuery({
  /* Input */
});
```

#### Use Lazy Query

```tsx
const [fetch, query] = trpc.some.procedure.useLazyQuery({
  /* Options */
});
```

#### Use Mutation

```tsx
const mut = trpc.some.procedure.useMutation({
  /* Options */
});
```

### Use non-hooks

Unlike React Hooks, the below can be used anywhere in your app, especially in SSR and SSG use-cases.

```tsx
// Pre-fetch and return data, adding to queryClient cache
trpc.some.procedure.$fetch(queryClient, {
  /* Input */
});

// Pre-fetch data, adding to queryClient cache. No data returned or errors thrown
trpc.some.procedure.$prefetch(queryClient, {
  /* Input */
});

// Call raw mutation. No affect on cache
trpc.some.procedure.$mutate(/* Input */);

// Call raw query. No affect on cache
trpc.some.procedure.$query(/* Input */);

trpc.some.procedure.$prefetchInfinite(/*...*/);
trpc.some.procedure.$fetchInfinite(/*...*/);
```

### Hydration helpers

In the [trpc docs](https://trpc.io/docs/ssg-helpers), they describe how to achieve SSG, but only via direct server-side calls. This means if your tRPC server isn't deployed alongside your frontend static rendering runtime (e.g. getStaticProps) then SSG isn't straightforward nor documented.

Unlike the official `@trpc/react-query` package, `trpc-react` plugs into the existing idimiomatic RQ approach. However the TRPC query data requires special serialization, so the below should be drop-in replaced for existing `dehydrate` calls made via RQ.

```tsx
export const getStaticProps = () => {
  const queryClient = new QueryClient();
  // Prefetch any data

  return {
    props: {
      dehydratedState: trpc.$dehydrate(queryClient),
    },
  };
};
```

In `_app.tsx`:

```tsx
// Pre-hydrate State de-serializes the data, if necessary.
// This is backwards compatible with vanilla RQ dehydratedState
const prehydrateState = trpc.$prehydrate(pageProps.dehydratedState);

return (
  <QueryProvider queryClient={queryClient}>
    <Hydrate state={prehydrateState}></Hydrate>
  </QueryProvider>
);
```

### Create Server-Side Direct Client

To achieve the same direct-server-side call functionality as TRPC, we can create a special server client. Under the hood, this client calls procedures directly, and hooks are therefore disabled.

```tsx
const trpcServer = createTRPCReactServer({
	appRouter, // <- Your router
})

trpcServer.some.procedure.$fetch(/*...*/)
// ... etc.
```


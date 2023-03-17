import { isKey } from "../util/is-key.util";
import { NoopFn } from "../util/noop.util";

export type ProxyCallback = (path: string, args: unknown[]) => unknown;

export function createInnerProxy(path: string, callback: ProxyCallback) {
  const proxy: unknown = new Proxy(NoopFn, {
    get(_obj, key) {
      if (!isKey(key)) return undefined;

      return createInnerProxy([path, key].join("."), callback);
    },
    apply(_1, _2, args) {
      return callback(path, args);
    },
  });

  return proxy;
}

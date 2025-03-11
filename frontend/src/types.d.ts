/* eslint-disable no-var */

export {};
declare global {
  var axios: typeof import("axios").default;
  var bootstrap: typeof import("bootstrap");
  var XLSX: typeof import("xlsx");
  var mermaid: typeof import("mermaid").default;

  interface APIResponseSuccess<T = unknown> {
    data: T;
  }
  interface APIResponseFailed<E = unknown> {
    error: E;
  }

  interface CommonError {
    name: string;
    message: string;
  }
}

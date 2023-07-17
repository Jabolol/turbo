import { dlopen, type LibTurbo, type Routes } from "./mod.ts";
import config from "./deno.json" assert { type: "json" };

const encoder = new TextEncoder();

/**
 * Symbols for the FFI library.
 */
export const _symbols = {
  _open: { parameters: ["buffer"], result: "pointer" },
  _find: { parameters: ["pointer", "buffer", "buffer"], result: "i32" },
  _free: { parameters: ["pointer"], result: "void" },
} as const;

const extensions: { [k in typeof Deno.build.os]?: string } = {
  darwin: "dylib",
  linux: "so",
  windows: "dll",
};

/**
 * Loads the Turbo library for the current platform.
 * @returns {LibTurbo} The loaded Turbo library.
 * @throws {Error} When the platform is not supported.
 * @example
 * ```typescript
 * // Only supported on Linux and OSX
 * const turbo = load();
 * ```
 */
export const load = async (): Promise<LibTurbo> => {
  if (!(Deno.build.os in extensions)) {
    throw new Error("Unsupported platform.");
  }
  return await dlopen({
    name: config.name,
    url: `${config.github}/releases/download/v${config.version}/`,
  }, _symbols);
};

/**
 * Builds the routes search tree and returns the root node.
 * @param {LibTurbo} turbo - The Turbo library instance.
 * @param {Routes} routes - The routes configuration.
 * @returns {Deno.PointerValue} The root node of the routes search tree.
 * @throws {Error} When the routes preparation fails.
 * @example
 * ```typescript
 * const root = init(turbo, routes);
 * ```
 */
export const init = (
  turbo: LibTurbo,
  routes: Routes,
): Deno.PointerValue => {
  const pointer = turbo.symbols._open(
    encoder.encode(JSON.stringify(routes) + "\0"),
  );
  if (!pointer) throw new Error("Failed to prepare routes");
  return pointer;
};

/**
 * Returns a handler for Deno.serve with the matching handler for the specified route.
 * @param {LibTurbo} turbo - The Turbo library instance.
 * @param {Routes} routes - The routes configuration.
 * @param {Deno.PointerValue} root - The root node of the routes search tree.
 * @returns {Function} The request handler function.
 * @example
 * ```typescript
 * const root = init(turbo, routes);
 * const handler = find(turbo, routes, root);
 * ```
 */
export const find = (
  turbo: LibTurbo,
  routes: Routes,
  root: Deno.PointerValue,
): (r: Request) => Response =>
(r: Request) => {
  return routes[
    turbo.symbols._find(
      root,
      encoder.encode(r.method + "\0"),
      encoder.encode(r.url + "\0"),
    )
  ][0](r);
};

/**
 * Frees up the route tree and closes the FFI library.
 * @param {Deno.DynamicLibrary} lib - The FFI library instance.
 * @param {Deno.PointerValue} root - The root node of the routes search tree.
 * @example
 * ```typescript
 * free(turbo, root);
 * ```
 */
export const free = <
  T extends Deno.ForeignLibraryInterface,
>(
  lib: Deno.DynamicLibrary<T>,
  root: Deno.PointerValue,
) => {
  (lib.symbols as {
    _free: (args_0: Deno.PointerValue) => void;
  })._free(root);
  lib.close();
};

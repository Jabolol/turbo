import { _symbols } from "./mod.ts";

/**
 * Represents a route in the routes configuration.
 */
type Route = [
  /**
   * The request handler function for the route.
   */
  (r: Request) => Response,
  /**
   * The HTTP method associated with the route.
   */
  "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  /**
   * The URL path associated with the route.
   */
  `/${string}`,
];

/**
 * Represents the not found route in the routes configuration.
 */
type NotFound = [(r: Request) => Response];

/**
 * Represents the routes configuration.
 */
export type Routes = [NotFound, ...Route[]];

/**
 * Represents the Turbo library instance.
 */
export type LibTurbo = Deno.DynamicLibrary<typeof _symbols>;

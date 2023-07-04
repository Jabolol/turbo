<details>
  <summary><strong>Summary</strong></summary><br />
Turbo is a micro web framework built for <strong>efficiency</strong>, leveraging Deno's FFI and TypeScript. It aims to provide <strong>blazing</strong> fast performance and <strong>simplicity</strong> for web development. Please note that Turbo is currently under development and not ready for production use. It is currently supported only on <code>Linux</code> and <code>macOS</code> platforms.

</details>

## Turbo

Next level performance framework. Built for speed. Powered by Deno.

### High Performance

Turbo is designed from the ground up to be incredibly fast. It achieves this by
utilizing Deno's FFI (Foreign Function Interface) to interface with a low-level
C library. By harnessing the power of native code, Turbo minimizes overhead and
delivers optimal performance for handling HTTP requests.

### Efficient Routing

Turbo provides a streamlined routing mechanism. It allows you to define routes
using a concise syntax, which consists of arrays of arrays of strings. Each
route is associated with a corresponding callback function that handles the
request. Turbo efficiently traverses a tree structure representing the routes,
enabling quick and efficient matching of incoming requests to their respective
handlers.

### Lightweight and Simple

Turbo is designed to be lightweight and easy to use. It embraces the simplicity
of a micro framework, providing only the essential features needed for web
development. With Turbo, you can focus on writing clean and efficient code
without unnecessary abstractions or bloat.

## Why Choose Turbo for Speed?

Turbo offers several key advantages that contribute to its exceptional speed:

<details>
  <summary><strong>Native Code Execution</strong></summary><br />
Turbo's core functionality is implemented in a low-level C library, which is accessed through Deno's FFI. This approach leverages the performance benefits of native code execution, allowing for highly optimized request handling.

</details>
<details>
  <summary><strong>Efficient Routing Algorithm</strong></summary><br />
Turbo's routing algorithm is specifically designed to minimize lookup time. By organizing routes in a tree structure, Turbo achieves efficient matching of incoming requests, leading to faster response times.

</details>
<details>
  <summary><strong>Streamlined Execution Flow</strong></summary><br />
Turbo follows a streamlined execution flow, avoiding unnecessary overhead and computations. It focuses on the essentials, allowing your application to handle requests swiftly and efficiently.

</details>
<details>
  <summary><strong>Lightweight Design</strong></summary><br />
Turbo is intentionally kept lightweight to eliminate unnecessary abstractions and reduce overhead. It provides a minimalistic set of features, ensuring that your application can run at peak performance without being weighed down by unnecessary functionality.

</details>
Please note that Turbo is still in development and not recommended for production use. It is currently supported only on <code>Linux</code> and <code>macOS</code> platforms.

## Example

To get started with Turbo, here is an example:

```ts
import { find, free, init, load, type Routes } from "https://deno.land/x/turbo";

// Define the hostname and port for the server
const HOSTNAME = "localhost";
const PORT = 8000;

// Define the routes configuration
const routes: Routes = [
  // Default route for handling not found URLs
  [({ url }) => new Response(`:: ${url} not found`, { status: 404 })],

  // Example routes
  [() => new Response("hello world!", { status: 200 }), "GET", "/hello"],
  [() => new Response("welcome", { status: 201 }), "POST", "/welcome"],
  [() => new Response("dummy route", { status: 200 }), "GET", "/dummy"],
  [() => new Response("success", { status: 200 }), "POST", "/success"],
  [() => new Response("not found", { status: 404 }), "GET", "/not-found"],
  [() => new Response("no access", { status: 403 }), "GET", "/access-denied"],
  [() => new Response("invalid request", { status: 400 }), "POST", "/invalid"],
  [() => new Response("forbidden", { status: 403 }), "GET", "/forbidden"],
  [() => new Response("server error", { status: 500 }), "GET", "/error"],
  [() => new Response("auth required", { status: 401 }), "GET", "/auth"],
];

// Load the Turbo library
const turbo = load();

// Initialize the routes search tree and get the root node
const root = init(turbo, routes);

// Create the request handler using the Turbo library and routes
const handler = find(turbo, routes, root);

// Start the server and listen for incoming requests
await Deno.serve({ port: PORT, hostname: HOSTNAME }, handler).finished;

// Free up resources and close the Turbo library
free(turbo, root);
```

## License

Turbo is released under the [MIT License.](./LICENSE)

## Acknowledgments

Turbo relies on the power of [Deno](https://deno.land/),
[TypeScript](http://typescriptlang.org/), and the contributions of the
open-source community. I would like to express my gratitude to all the
developers who have made this project possible.

# Dev Command Specification

The `dev` command starts a development server for the Larrix project, enabling live reloading for a smoother development experience.

## Usage

```bash
larrix dev
```

## Implementation Details

The `dev` command is implemented in `src/commands/dev.js` and is broken down into several modular functions.

### Constants

-   `OUTPUT_DIRECTORY = "tmp"`: The output directory for development builds.
-   `SERVER_PORT = 3000`: The port for the development server.
-   `EVENTS_ENDPOINT = "/events"`: The endpoint for Server-Sent Events.

### Main `dev()` Function

The `dev()` function is the main entry point. It orchestrates the development process:
1.  Sets up source and distribution directory paths.
2.  Performs an initial build by calling `buildAndInject()`.
3.  Creates a `devServerContext` object to share state between the server and the file watcher.
4.  Calls `startDevelopmentServer()` to start the HTTP server.
5.  Calls `watchSourceFiles()` to start watching for file changes.
6.  Sets up a `SIGINT` handler to gracefully shut down the server and the watcher.

### `buildAndInject(distributionDirectory)`

-   Runs the core build process by calling `coreBuild({ outputDirectory: "tmp", createZip: false, quiet: true })`.
-   Calls `injectLiveReloadCode()` to inject the live-reload client into the background script.

### `injectLiveReloadCode(distributionDirectory)`

-   Reads the content of the background service worker (`background/index.js`) and the live-reload client script (`src/utils/live-reload-client.js`).
-   Prepends the live-reload client code to the background script, ensuring it runs in the extension's context.

### `regenerateManifest(sourceDirectory, distributionDirectory)`

-   Loads the project's configuration.
-   Generates a new `manifest.json` file based on the current configuration and source files.
-   Writes the updated manifest to the `distributionDirectory`.

### `startDevelopmentServer(context)`

-   Creates an HTTP server using Node.js's built-in `http` module.
-   Handles `OPTIONS` requests for the `/events` endpoint to support Cross-Origin Resource Sharing (CORS).
-   If the request URL is `/events`, it sets up a Server-Sent Events (SSE) connection. The response object is added to the `context.clients` array, and CORS headers are included.
-   For all other requests, it calls `serveStaticFile()` to serve the requested file.
-   The server listens on `http://localhost:3000`.

### `serveStaticFile(requestUrl, distributionDirectory, response)`

-   Serves a static file from the `distributionDirectory`.
-   If the `requestUrl` is `/`, it redirects to `/popup/`.
-   It determines the file's content type based on its extension (.html, .js, .css, .json) and sends the file content with the appropriate headers.
-   If a file is not found, it returns a 404 error.

### `watchSourceFiles(sourceDirectory, context)`

-   Watches the `sourceDirectory` for file changes using Node.js's built-in `fs.watch` with the `recursive` option.
-   When a file is added or changed, it copies the file to the corresponding location in the `tmp` directory.
-   When a file is deleted, it removes the file from the `tmp` directory.
-   After any file change, it calls `regenerateManifest()` to ensure the manifest is up-to-date.
-   If the changed file is part of the background script, it calls `injectLiveReloadCode()` again.
-   Finally, it sends a "reload" event to all connected SSE clients, triggering the extension to reload.

### Client-Side Live Reload (`src/utils/live-reload-client.js`)

-   A client-side script that is injected into the extension's background service worker during development builds.
-   It establishes an SSE connection to `http://localhost:3000/events`.
-   When it receives a "reload" message, it calls `chrome.runtime.reload()` to reload the extension.

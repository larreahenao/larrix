# Build Command Specification

The `build` command compiles and packages the browser extension for production.

## Usage

```bash
larrix build
```

## Implementation Details

The `build` command is a lightweight wrapper around the `coreBuild` utility function. It simplifies the build process by calling `coreBuild` with a predefined set of options for production builds.

### File: `src/commands/build.js`

The `src/commands/build.js` file contains the `build` function, which is the entry point for the `larrix build` command.

```javascript
import { coreBuild } from "../utils/core-build.js";

/**
 * Builds the browser extension for production.
 * This command utilizes the coreBuild function to compile and package the extension,
 * including creating a distributable ZIP archive.
 */
export async function build() {
    await coreBuild({
        outputDirectory: "dist",
        createZip: true,
    });
}
```

### Core Build Options

The `build` command calls `coreBuild` with the following options:

-   `outputDirectory: "dist"`: The output of the build will be placed in the `dist` directory.
-   `createZip: true`: A ZIP archive of the `dist` directory will be created in the project root.

This approach centralizes the build logic in `coreBuild`, making it reusable for other commands like `dev`, and ensures a consistent build process across the CLI.

import { buildExtension, validateLarrixProject } from "@utils/extension-service";

/**
 * Builds the browser extension for production.
 * This command utilizes the buildExtension function to compile and package the extension,
 * including creating a distributable ZIP archive.
 */
export async function build(args: string[]) {
    const currentWorkingDirectory = process.cwd();
    validateLarrixProject(currentWorkingDirectory); // Perform project validation first
    await buildExtension({
        outputDirectory: "dist",
        createZip: true,
    });
}

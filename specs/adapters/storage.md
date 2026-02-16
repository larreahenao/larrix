### SPEC: Adapter: `storage`

**1. Module Description**

This document specifies the `Larrix.storage` adapter. This module provides a unified, Promise-based API for persisting data across different browsers. It offers **explicit access** to the `local` and `sync` storage areas, allowing the developer to decide the appropriate storage strategy for their extension. All platform-specific code is resolved at compile-time.

**2. Reference to Code Generation Rules**

**Important:** All modifications and code generation for this module must strictly adhere to the guidelines set forth in `specs/code_generation_rules.md`.

**3. Scope of Included Functions and Classes**

The `Larrix.storage` adapter is a singleton object that contains explicit interfaces for each available storage area.

*   **`Larrix.storage.local`**: An object providing CRUD methods and its own event listener for the `local` storage area.
    *   `.get(keys): Promise<object>`
    *   `.set(items): Promise<void>`
    *   `.remove(keys): Promise<void>`
    *   `.clear(): Promise<void>`
    *   `.onChanged(callback): function`: Registers a callback to listen for changes in the `local` storage area. **It returns an `unsubscribe` function.**

*   **`Larrix.storage.sync`**: An object providing CRUD methods and its own event listener for the `sync` storage area.
    *   `.get(keys): Promise<object>`
    *   `.set(items): Promise<void>`
    *   `.remove(keys): Promise<void>`
    *   `.clear(): Promise<void>`
    *   `.onChanged(callback): function`: Registers a callback to listen for changes in the `sync` storage area. **It returns an `unsubscribe` function.**

**4. Cross-Platform Implementation**

The `larrix build` command replaces adapter calls with the target browser's native API. The adapter contains no runtime logic to determine the browser environment.

*   `Larrix.storage.local.set()` compiles to `chrome.storage.local.set()` or `browser.storage.local.set()`.
*   `Larrix.storage.sync.set()` compiles to `chrome.storage.sync.set()` or `browser.storage.sync.set()`.
*   A Promise wrapper is used for Chromium targets to handle callbacks and `runtime.lastError`.
*   The adapter will listen to the single native `storage.onChanged` event and will be responsible for filtering and dispatching it to the correct specific listener (`local.onChanged` or `sync.onChanged`) based on the `areaName` provided by the native browser API.

**5. Out of Scope**

*   **Automatic Fallbacks:** The adapter **does not** provide automatic fallbacks between `sync` and `local`. If a `sync` operation fails, the Promise will be rejected, and the developer is responsible for handling the error.

**6. Involved Files**

*   `specs/adapters/storage.md` (this file)
*   `core/adapters/storage.js` (the future implementation file)
*   `core/adapters/index.js` (to export the new adapter)

**7. Edge Cases**

*   **`sync` storage failure:** A call to any `Larrix.storage.sync` method may fail if the user has disabled sync, is offline, or a quota is exceeded. These operations will result in a rejected Promise that the developer must `catch`.

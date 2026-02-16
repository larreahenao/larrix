### SPEC: Adapter: `message`

**1. Module Description**

This document specifies the `Larrix.message` adapter. This module provides a simple, unified, Promise-based API for bidirectional communication between an extension's different contexts (background, content scripts, popup, etc.).

**2. Reference to Code Generation Rules**

**Important:** All modifications and code generation for this module must strictly adhere to the guidelines set forth in `specs/code_generation_rules.md`.

**3. Scope of Included Functions and Classes**

The `Larrix.message` adapter is a singleton object.

*   **`Larrix.targets`**: An enum-like object containing predefined constants for common message targets, to avoid using raw strings.
    *   `BACKGROUND`: To send a message to the background script.
    *   `POPUP`: To send a message to the popup script (if open).
    *   `ACTIVE_TAB`: To send a message to the content script(s) in the currently active tab.

*   **`send(target, payload): Promise<response>`**
    *   Sends a one-time message and returns a Promise that resolves with the response.
    *   `target`: Can be one of the constants from `Larrix.targets` (e.g., `Larrix.targets.BACKGROUND`) or an object `{ tabId: number }` to target a specific tab.
    *   `payload`: The data to be sent (must be JSON-serializable).

*   **`on(callback): function`**
    *   Registers a listener for incoming messages. Returns an `unsubscribe` function.
    *   The `callback` receives `(payload, sender)`. To send a response, the callback can simply `return` a value or a `Promise`. The adapter handles the internal complexity.

**Example Usage:**
```javascript
// From a content script, send a message to the background script
const response = await Larrix.message.send(Larrix.targets.BACKGROUND, { action: 'getSettings' });
console.log('Settings received:', response);

// In the background script, listen for messages
Larrix.message.on((payload, sender) => {
  if (payload.action === 'getSettings') {
    // Simply return a value or a Promise to respond
    return Larrix.storage.local.get('settings');
  }
});
```

**4. Cross-Platform Implementation**

*   `send(target, ...)` will be compiled to `chrome.runtime.sendMessage(...)` or `chrome.tabs.sendMessage(...)` depending on the `target` value. The same applies to `browser.*` equivalents.
*   The adapter's `on` method will manage the `return true` logic for asynchronous responses internally, especially for Chromium-based targets.

**5. Out of Scope**

*   **Long-lived connections:** This adapter only handles simple, one-time request/response messages. It does not cover `runtime.connect` or long-lived ports.

**6. Involved Files**

*   `specs/adapters/message.md` (this file)
*   `core/adapters/message.js` (the future implementation file)
*   `core/adapters/index.js` (to export the new adapter)

**7. Edge Cases**

*   **No listener:** If a message is sent but there is no `Larrix.message.on()` listener at the destination, the `send()` Promise will be rejected with an error.
*   **Multiple listeners:** If multiple listeners are registered across the extension, only one should respond to a given message (standard browser behavior).
*   **Non-serializable payload:** Sending a payload that cannot be serialized to JSON will throw an error.

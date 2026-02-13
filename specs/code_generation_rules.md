# Code Generation Rules

This document outlines the rules and quality criteria that must be followed when generating code for the Larrix project.

## Core Principles

The generated code must strictly adhere to the following principles:

1.  **SOLID Principles:** All code should be designed following the five SOLID principles of object-oriented design.
    *   **S - Single Responsibility Principle:** A class should have only one reason to change.
    *   **O - Open/Closed Principle:** Software entities (classes, modules, functions) should be open for extension but closed for modification.
    *   **L - Liskov Substitution Principle:** Subtypes must be substitutable for their base types.
    *   **I - Interface Segregation Principle:** No client should be forced to depend on methods it does not use.
    *   **D - Dependency Inversion Principle:** High-level modules should not depend on low-level modules. Both should depend on abstractions.

2.  **Architectural Design:**
    *   **High Modularity:** The codebase should be as modular as possible. Break down complex systems into smaller, independent, and interchangeable modules.
    *   **Composition over Inheritance:** Prioritize composition to build complex functionality from simpler, reusable components, rather than inheriting behavior from a complex hierarchy of classes.
    *   **Use of Classes:** Employ classes where it makes sense to encapsulate data and behavior together. This is preferred over "parameter drilling," where data is passed through multiple layers of functions.

3.  **Comprehensive Documentation:**
    *   **JSDoc for Everything:** All functions, methods, classes, and interfaces must be documented using JSDoc.
    *   **Private Members:** To indicate a private attribute or method, use the `@private` tag in the JSDoc comment. Do not use a leading underscore (`_`) in the name.

    **Example:**
    ```javascript
    /**
     * Represents a user in the system.
     */
    class User {
        /**
         * The user's unique identifier.
         * @private
         */
        userId;

        /**
         * @param {string} id - The user's ID.
         */
        constructor(id) {
            this.userId = id;
        }

        /**
         * Fetches user data.
         * @returns {object} The user data.
         */
        fetchData() {
            // ...
        }
    }
    ```

4.  **Clean Code Practices:**
    *   **No Unnecessary Comments:** Avoid comments that explain *what* the code is doing. Comments should only be used to explain *why* a particular implementation choice was made, especially for complex or non-obvious logic.
    *   **No `console.log`:** Remove all `console.log` statements from the final code. They can be used for debugging during development but must not be present in production-ready code.

5.  **Consistency:**
    *   Generated code must rigorously follow the style, formatting, and architectural patterns of the existing codebase. Analyze surrounding files to ensure a seamless fit.

6.  **Language:**
    *   All generated code and SPECS must be written entirely in English.

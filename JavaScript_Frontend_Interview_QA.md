---

# JavaScript Frontend Interview Q&A (with Bentcam Examples)

---

## 1. What is JavaScript?
JavaScript is a high-level, interpreted programming language that enables interactive web pages and is an essential part of web applications. It is primarily used for client-side development but can also be used on the server side (Node.js). JavaScript allows you to manipulate the DOM, handle events, and communicate with servers asynchronously.

**Bentcam Example:** All logic in `client/src/` is written in JavaScript (e.g., `index.js`, `categoryMapping.js`).

---

## 2. What are variables and how do you declare them?
Variables are containers for storing data values. In JavaScript, you can declare variables using `var`, `let`, or `const`. `var` is function-scoped and can be redeclared, while `let` and `const` are block-scoped. `let` allows reassignment, but `const` does not.

**Bentcam Example:** `let cart = []` in `handleCart.js` declares a variable to store cart items.

---

## 3. What is the difference between `let`, `const`, and `var`?
- `var` is function-scoped, can be redeclared and updated, and is hoisted to the top of its scope.
- `let` is block-scoped, can be updated but not redeclared in the same scope, and is not hoisted in the same way as `var`.
- `const` is block-scoped, cannot be updated or redeclared, and must be initialized at declaration. However, for objects and arrays, the contents can be changed.

**Bentcam Example:** `const categoryMapping = {...}` in `categoryMapping.js` creates a constant object.

---

## 4. What are data types in JavaScript?
JavaScript supports primitive data types (string, number, boolean, null, undefined, symbol, bigint) and reference types (object, array, function). Understanding data types is crucial for writing bug-free code and handling data correctly.

---

## 5. What is hoisting?
Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope (script or function). This means variables and function declarations can be used before they are declared, but only `var` and function declarations are hoisted, not initializations or `let`/`const` declarations.

---

## 6. What is a closure?
A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope. Closures are commonly used for data privacy and creating function factories.

---

## 7. What is the difference between `==` and `===`?
`==` is the abstract equality operator, which compares values after type coercion. `===` is the strict equality operator, which compares both value and type, making it safer and more predictable.

---

## 8. What is an arrow function?
Arrow functions provide a concise syntax for writing functions and do not have their own `this`, `arguments`, or `super`. They are best suited for non-method functions and callbacks.

**Bentcam Example:** Used throughout, e.g., `const handleClick = () => {...}` in `Navbar.jsx`.

---

## 9. What is the spread operator (`...`)?
The spread operator allows you to expand elements of an array or properties of an object into another array or object. It is useful for copying, merging, or adding new elements/properties.

**Bentcam Example:** `const newCart = [...cart, product];` in `handleCart.js` creates a new array with an added product.

---

## 10. What is destructuring?
Destructuring is a syntax that allows you to unpack values from arrays or properties from objects into distinct variables, making code more readable and concise.

**Bentcam Example:** `const { id, name } = product;` in `Products.jsx` extracts properties from a product object.

---

## 11. What is event bubbling?
Event bubbling is the process by which an event starts at the most specific element and then flows upward to less specific elements in the DOM hierarchy. This allows parent elements to react to events fired on their children.

---

## 12. How do you prevent default form submission?
You can prevent the default action of a form (which is to reload the page) by calling `event.preventDefault()` in the form's submit event handler. This is essential for handling form data with JavaScript or React.

**Bentcam Example:** In form handlers in `ProductForm.jsx`, `event.preventDefault()` is used to handle form submission via JavaScript.

---

## 13. What is async/await?
`async` and `await` are syntactic sugar over promises, making asynchronous code look and behave more like synchronous code. `async` functions return a promise, and `await` pauses execution until the promise resolves.

**Bentcam Example:** `await fetch(...)` in API calls in `Products.jsx` for fetching product data.

---

## 14. What is a promise?
A promise is an object representing the eventual completion or failure of an asynchronous operation. Promises have `then`, `catch`, and `finally` methods for handling results and errors.

---

## 15. How do you handle errors in async code?
You can handle errors in asynchronous code using `try...catch` blocks with `async/await`, or by chaining `.catch()` to promises. This ensures your app can gracefully handle failures.

**Bentcam Example:** `try { ... } catch (e) { ... }` in API calls in `Login.jsx` handles login errors.

---

## 16. What is localStorage?
`localStorage` is a browser API that allows you to store key-value pairs in the browser persistently, even after the page is reloaded. It is commonly used for storing user preferences, tokens, or cart data.

**Bentcam Example:** Used for storing auth tokens or cart data in `auth.js` and `handleCart.js`.

---

## 17. What is a callback function?
A callback function is a function passed as an argument to another function, to be executed later. Callbacks are fundamental to asynchronous programming in JavaScript.

---

## 18. What is debouncing?
Debouncing is a technique to limit the rate at which a function is executed, often used for optimizing performance in response to user input events like typing or resizing.

---

## 19. What is the difference between map, filter, and reduce?
- `map` creates a new array by applying a function to each element.
- `filter` creates a new array with elements that pass a test.
- `reduce` applies a function to accumulate a single value from an array.

**Bentcam Example:** `products.map(...)` in `Products.jsx` renders a list of products.

---

## 20. How do you import and export modules?
JavaScript modules allow you to split code into reusable files. Use `export` to make variables/functions available, and `import` to use them in other files.

**Bentcam Example:** `import categoryMapping from '../data/categoryMapping.js';` in `CategoryProducts.jsx` imports a data module.

---

## 21. What is a pure function?
A pure function is a function that, given the same input, always returns the same output and has no side effects (does not modify external state).

---

## 22. What is the difference between synchronous and asynchronous code?
Synchronous code executes line by line, blocking further execution until the current operation completes. Asynchronous code allows other operations to run while waiting for tasks like network requests or timers.

---

## 23. What is JSON?
JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It is commonly used for API communication.

**Bentcam Example:** API responses are parsed with `response.json()` in `Products.jsx`.

---

## 24. How do you handle arrays in JavaScript?
Arrays can be manipulated using methods like `map`, `filter`, `reduce`, `forEach`, `push`, `pop`, `shift`, `unshift`, and more. These methods help process and transform data efficiently.

---

## 25. What is the DOM?
The Document Object Model (DOM) is a programming interface for HTML and XML documents. It represents the page structure as a tree of objects, allowing JavaScript to manipulate content, structure, and styles dynamically.

---

## 26. How do you manipulate the DOM in JavaScript?
You can manipulate the DOM using methods like `getElementById`, `querySelector`, `appendChild`, `removeChild`, and by changing element properties. In React, direct DOM manipulation is rare, as React manages the DOM for you.

---

## 27. What is a template literal?
Template literals are string literals enclosed by backticks (``) that allow embedded expressions using `${}`. They make string construction easier and more readable.

**Bentcam Example:** Used in string interpolation in many components, e.g., ``Product: ${name}``.

---

## 28. What is a module?
A module is a file containing code (variables, functions, classes) that can be imported and exported. Modules help organize code and promote reusability.

---

## 29. What is the difference between null and undefined?
- `null` is an assignment value that represents no value or object.
- `undefined` means a variable has been declared but not assigned a value.

---

## 30. How do you check if a variable is an array?
Use `Array.isArray(variable)` to check if a variable is an array. This is the most reliable way, as `typeof` returns 'object' for arrays.

---

*This document includes real Bentcam code examples for practical context.*

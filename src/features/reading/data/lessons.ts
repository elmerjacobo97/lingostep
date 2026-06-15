import type { Lesson } from '@/types'

export const LESSONS: Lesson[] = [
  {
    id: 'http-basics',
    title: 'HTTP Request Methods',
    level: 'A2',
    topic: 'Web / HTTP',
    xpReward: 10,
    passage: `HTTP defines a set of request methods to indicate the desired action for a given resource. The most common methods are GET, POST, PUT, and DELETE.

GET requests retrieve data from a server. They should not change any data — they are read-only. When you open a webpage in your browser, it sends a GET request.

POST requests send data to a server to create a new resource. For example, submitting a registration form sends a POST request with your name, email, and password.

PUT requests update an existing resource with new data. Unlike POST, PUT replaces the entire resource.

DELETE requests remove a specific resource from the server.

These four methods map to the four basic operations of persistent storage: Create, Read, Update, and Delete — commonly called CRUD.`,
    questions: [
      {
        id: 'q1',
        text: 'Which HTTP method is used to retrieve data without changing it?',
        options: ['POST', 'GET', 'PUT', 'DELETE'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        text: 'What does CRUD stand for?',
        options: [
          'Copy, Run, Upload, Download',
          'Create, Read, Update, Delete',
          'Connect, Request, Update, Deploy',
          'Cache, Retrieve, Use, Discard',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3',
        text: 'When you submit a registration form, which method is typically used?',
        options: ['GET', 'DELETE', 'POST', 'PUT'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'git-basics',
    title: 'Git: Commits and Branches',
    level: 'A2',
    topic: 'Git / Version Control',
    xpReward: 10,
    passage: `Git is a distributed version control system. It tracks changes in your source code so you can collaborate with other developers and revert to previous versions when needed.

A commit is a snapshot of your project at a specific point in time. Every commit has a unique identifier called a hash, a message describing the change, and a reference to the previous commit. This creates a history of your project.

A branch is an independent line of development. The default branch is usually called main or master. When you work on a new feature, you create a new branch so your changes do not affect the main codebase until they are ready.

To integrate changes from one branch into another, you use a merge or a rebase. A merge creates a new commit that combines the histories of both branches. A rebase rewrites the commit history to make it appear as if the feature branch was created from the latest point of the main branch.`,
    questions: [
      {
        id: 'q1',
        text: 'What is a commit in Git?',
        options: [
          'A request to merge branches',
          'A snapshot of the project at a specific time',
          'A unique branch name',
          'A copy of the repository',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2',
        text: 'What is the purpose of creating a branch?',
        options: [
          'To delete old commits',
          'To rename the repository',
          'To work on a feature without affecting the main codebase',
          'To sync with a remote server',
        ],
        correctIndex: 2,
      },
      {
        id: 'q3',
        text: 'What does a merge do?',
        options: [
          'Deletes both branches after combining them',
          'Creates a new commit that combines the histories of two branches',
          'Rewrites commit history from a specific point',
          'Uploads commits to a remote repository',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'react-components',
    title: 'React: Components and Props',
    level: 'B1',
    topic: 'React',
    xpReward: 15,
    passage: `React is a JavaScript library for building user interfaces. The fundamental building block of a React application is the component — a reusable, self-contained piece of UI.

A component is a function that returns JSX, which is a syntax extension that looks similar to HTML. React components must start with a capital letter to distinguish them from regular HTML elements.

Components accept inputs called props (short for properties). Props are passed to a component like HTML attributes and allow the parent component to customize the child. Props flow in one direction: from parent to child. This is called unidirectional data flow.

To manage data that changes over time, components use state. Unlike props, state is private and controlled by the component itself. When state changes, React re-renders the component and updates the DOM efficiently using a virtual DOM — a lightweight copy of the real DOM that React uses to calculate the minimum number of changes needed.`,
    questions: [
      {
        id: 'q1',
        text: 'What is a React component?',
        options: [
          'A CSS class for styling elements',
          'A function that returns JSX',
          'A type of HTML tag',
          'A database query function',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2',
        text: 'What are props?',
        options: [
          'Internal state managed by the component',
          'Functions that handle events',
          'Inputs passed from a parent component to customize a child',
          'Styles applied directly to components',
        ],
        correctIndex: 2,
      },
      {
        id: 'q3',
        text: 'What is the virtual DOM used for?',
        options: [
          'Storing the application state',
          'Sending requests to the server',
          'Calculating the minimum number of real DOM changes needed',
          'Rendering CSS styles',
        ],
        correctIndex: 2,
      },
      {
        id: 'q4',
        text: 'What direction does data flow with props?',
        options: [
          'Child to parent',
          'Bidirectionally',
          'From the server to the component',
          'From parent to child',
        ],
        correctIndex: 3,
      },
    ],
  },
  {
    id: 'typescript-types',
    title: 'TypeScript: Types and Interfaces',
    level: 'B1',
    topic: 'TypeScript',
    xpReward: 15,
    passage: `TypeScript is a superset of JavaScript that adds static type checking. This means you can catch errors at compile time — before your code runs — rather than at runtime.

A type annotation tells TypeScript what kind of value a variable can hold. For example, writing let count: number = 0 tells TypeScript that count must always be a number. If you try to assign a string to it, TypeScript will report an error immediately.

Interfaces and type aliases are two ways to describe the shape of an object. An interface declares the names and types of an object's properties. A type alias can do the same, but it can also represent primitive types, unions, and tuples.

Union types allow a variable to hold one of several types. For example, string | number means the variable can be either a string or a number. This is more flexible than a single type and still safer than using any, which disables type checking entirely.

Generics allow you to write reusable functions and types that work with any type while still being type-safe. For example, a generic Array<T> can be an array of numbers, strings, or any other type.`,
    questions: [
      {
        id: 'q1',
        text: 'What is the main advantage of TypeScript over JavaScript?',
        options: [
          'It runs faster in the browser',
          'It catches errors at compile time before the code runs',
          'It requires less code to write the same logic',
          'It works without a build step',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2',
        text: 'What does string | number mean in TypeScript?',
        options: [
          'A value that is both a string and a number simultaneously',
          'A function that converts strings to numbers',
          'A variable that can hold either a string or a number',
          'A type that has been removed from TypeScript',
        ],
        correctIndex: 2,
      },
      {
        id: 'q3',
        text: 'Why should you avoid using any in TypeScript?',
        options: [
          'It causes runtime errors automatically',
          'It disables type checking, removing TypeScript\'s safety benefits',
          'It is not valid TypeScript syntax',
          'It makes the code run slower',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'async-await',
    title: 'Async/Await and Promises',
    level: 'B1',
    topic: 'JavaScript',
    xpReward: 15,
    passage: `JavaScript is single-threaded, meaning it can only execute one task at a time. To handle operations that take time — like fetching data from an API or reading a file — JavaScript uses asynchronous programming.

A Promise represents the eventual result of an asynchronous operation. It can be in one of three states: pending (the operation has not finished), fulfilled (it completed successfully), or rejected (it failed). You handle a fulfilled promise with .then() and a rejected one with .catch().

The async/await syntax is a cleaner way to work with Promises. Marking a function with async means it always returns a Promise. Inside an async function, you can use the await keyword to pause execution until a Promise resolves, making asynchronous code read almost like synchronous code.

Error handling with async/await uses standard try/catch blocks. If the awaited Promise rejects, the error is thrown and caught by the catch block, just like a synchronous exception.`,
    questions: [
      {
        id: 'q1',
        text: 'What are the three states of a Promise?',
        options: [
          'Loading, success, error',
          'Pending, fulfilled, rejected',
          'Start, running, complete',
          'Waiting, resolved, cancelled',
        ],
        correctIndex: 1,
      },
      {
        id: 'q2',
        text: 'What does the await keyword do inside an async function?',
        options: [
          'It cancels the Promise if it takes too long',
          'It converts a Promise into a callback function',
          'It pauses execution until the Promise resolves',
          'It makes the function run synchronously',
        ],
        correctIndex: 2,
      },
      {
        id: 'q3',
        text: 'How do you handle errors in async/await?',
        options: [
          'Using .catch() chained to the function call',
          'Using try/catch blocks inside the async function',
          'Using a special error event listener',
          'Errors cannot be caught in async functions',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'rest-api-design',
    title: 'REST API Design Principles',
    level: 'B2',
    topic: 'API Design',
    xpReward: 20,
    passage: `REST (Representational State Transfer) is an architectural style for designing networked applications. A RESTful API communicates over HTTP and treats every piece of data as a resource identified by a URL.

RESTful APIs are stateless — each request from a client must contain all the information the server needs to process it. The server does not store any client session data between requests. This makes REST APIs highly scalable because any server instance can handle any request.

Resources are identified by URIs (Uniform Resource Identifiers). A well-designed URI is hierarchical and describes what the resource is, not what action to perform. For example, /users/42/orders is clearer than /getOrdersForUser?id=42. The action is expressed by the HTTP method, not the URI.

HTTP status codes communicate the outcome of a request. 2xx codes indicate success: 200 OK for a successful GET, 201 Created when a new resource is created, 204 No Content when a DELETE succeeds. 4xx codes indicate client errors: 400 Bad Request for invalid input, 401 Unauthorized when authentication is missing, 404 Not Found when the resource does not exist. 5xx codes indicate server errors.

Versioning your API — for example, /api/v1/users — allows you to make breaking changes without disrupting existing clients.`,
    questions: [
      {
        id: 'q1',
        text: 'What does "stateless" mean in the context of REST APIs?',
        options: [
          'The API never changes its behavior',
          'The server stores client data permanently',
          'Each request contains all the information needed; the server holds no session state',
          'The API only accepts GET requests',
        ],
        correctIndex: 2,
      },
      {
        id: 'q2',
        text: 'Which URI design follows REST best practices?',
        options: [
          '/getOrdersForUser?id=42',
          '/users/42/orders',
          '/fetchData/orders/user42',
          '/api/retrieveUserOrders',
        ],
        correctIndex: 1,
      },
      {
        id: 'q3',
        text: 'What HTTP status code is returned when a new resource is successfully created?',
        options: ['200 OK', '204 No Content', '301 Moved Permanently', '201 Created'],
        correctIndex: 3,
      },
      {
        id: 'q4',
        text: 'Why is API versioning important?',
        options: [
          'It makes the API faster',
          'It allows breaking changes without disrupting existing clients',
          'It is required by the HTTP specification',
          'It adds authentication to the API',
        ],
        correctIndex: 1,
      },
    ],
  },
]

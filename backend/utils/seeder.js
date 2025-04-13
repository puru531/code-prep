const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');
const Topic = require('../models/Topic');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample data for seeding
const adminUser = {
  name: 'Admin User',
  email: 'admin@codeprep.com',
  password: 'admin123',
  role: 'admin'
};

const regularUser = {
  name: 'Regular User',
  email: 'user@codeprep.com',
  password: 'user123',
  role: 'user'
};

const courses = [
  {
    name: 'JavaScript Basics',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
  },
  {
    name: 'Angular Fundamentals',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg'
  },
  {
    name: 'React Essentials',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
  }
];

const topics = [
  {
    title: 'Variables and Data Types',
    content: `# Variables and Data Types in JavaScript

## Introduction

JavaScript is a dynamically typed language, which means you don't need to declare the type of a variable ahead of time. The data type of a variable is determined automatically while the program is being processed.

## Variable Declarations

There are three ways to declare variables in JavaScript:

\`\`\`javascript
// Using var (function-scoped)
var x = 10;

// Using let (block-scoped)
let y = 20;

// Using const (block-scoped, cannot be reassigned)
const z = 30;
\`\`\`

## Primitive Data Types

JavaScript has several primitive data types:

1. **Number**: Represents both integer and floating-point numbers
   \`\`\`javascript
   let num = 42;
   let float = 3.14;
   \`\`\`

2. **String**: Represents textual data
   \`\`\`javascript
   let name = "John";
   let greeting = 'Hello, world!';
   \`\`\`

3. **Boolean**: Represents true/false values
   \`\`\`javascript
   let isActive = true;
   let isCompleted = false;
   \`\`\`

4. **Undefined**: Represents a variable that has been declared but not assigned a value
   \`\`\`javascript
   let something;
   console.log(something); // undefined
   \`\`\`

5. **Null**: Represents the intentional absence of any object value
   \`\`\`javascript
   let empty = null;
   \`\`\`

6. **Symbol**: Represents a unique identifier
   \`\`\`javascript
   let id = Symbol('id');
   \`\`\`

7. **BigInt**: Represents integers of arbitrary precision
   \`\`\`javascript
   let bigNumber = 1234567890123456789012345n;
   \`\`\`

## Reference Data Types

JavaScript also has reference data types:

1. **Object**: Represents a collection of related data
   \`\`\`javascript
   let person = {
     name: 'John',
     age: 30
   };
   \`\`\`

2. **Array**: Represents a list-like collection
   \`\`\`javascript
   let fruits = ['Apple', 'Banana', 'Orange'];
   \`\`\`

3. **Function**: A callable object
   \`\`\`javascript
   function greet() {
     return 'Hello!';
   }
   \`\`\`

## Type Conversion

JavaScript provides methods to convert between data types:

\`\`\`javascript
// To String
String(123); // "123"

// To Number
Number("123"); // 123

// To Boolean
Boolean(1); // true
Boolean(0); // false
\`\`\`

## Type Coercion

JavaScript also performs automatic type conversion when needed:

\`\`\`javascript
"5" + 2; // "52" (string concatenation)
"5" - 2; // 3 (numeric subtraction)
\`\`\`

## Checking Types

Use the \`typeof\` operator to check the type of a variable:

\`\`\`javascript
typeof 42; // "number"
typeof "Hello"; // "string"
typeof true; // "boolean"
typeof {}; // "object"
typeof []; // "object" (arrays are objects in JavaScript)
typeof function(){}; // "function"
\`\`\`

## Best Practices

1. Use \`const\` by default, and only use \`let\` when you need to reassign a variable.
2. Avoid using \`var\` due to its function-scoping behavior.
3. Be aware of type coercion in JavaScript to avoid unexpected results.
4. Use explicit type conversion when needed to make your code more readable.`,
    course: null // Will be set after course is created
  },
  {
    title: 'Component Architecture',
    content: `# Angular Component Architecture

## Introduction

Components are the main building blocks of an Angular application. Each component consists of:

- A TypeScript class that defines behavior
- An HTML template that defines the UI
- CSS styles that define the appearance

## Creating a Component

You can create a component using the Angular CLI:

\`\`\`bash
ng generate component my-component
\`\`\`

This generates:

\`\`\`
my-component/
  my-component.component.ts
  my-component.component.html
  my-component.component.css
  my-component.component.spec.ts
\`\`\`

## Component Decorator

The \`@Component\` decorator identifies the class as an Angular component:

\`\`\`typescript
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponent {
  // Component logic here
}
\`\`\`

## Component Lifecycle

Angular provides lifecycle hooks that let you tap into key moments in the component lifecycle:

1. **ngOnChanges** - When input properties change
2. **ngOnInit** - After first ngOnChanges
3. **ngDoCheck** - Developer's custom change detection
4. **ngAfterContentInit** - After content projection
5. **ngAfterContentChecked** - After ngAfterContentInit and every check
6. **ngAfterViewInit** - After view initialization
7. **ngAfterViewChecked** - After ngAfterViewInit and every check
8. **ngOnDestroy** - Before component destruction

Example:

\`\`\`typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lifecycle-example',
  template: '<div>{{ data }}</div>'
})
export class LifecycleExampleComponent implements OnInit {
  data: string;
  
  constructor() {
    console.log('Constructor called');
    this.data = 'Initial data';
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.data = 'Data updated in ngOnInit';
  }
}
\`\`\`

## Component Communication

### 1. Parent to Child - @Input

\`\`\`typescript
// Child component
@Component({
  selector: 'app-child',
  template: '<div>{{ childData }}</div>'
})
export class ChildComponent {
  @Input() childData: string;
}

// Parent component
@Component({
  selector: 'app-parent',
  template: '<app-child [childData]="parentData"></app-child>'
})
export class ParentComponent {
  parentData = 'Data from parent';
}
\`\`\`

### 2. Child to Parent - @Output and EventEmitter

\`\`\`typescript
// Child component
@Component({
  selector: 'app-child',
  template: '<button (click)="sendToParent()">Send to Parent</button>'
})
export class ChildComponent {
  @Output() dataEvent = new EventEmitter<string>();
  
  sendToParent() {
    this.dataEvent.emit('Data from child');
  }
}

// Parent component
@Component({
  selector: 'app-parent',
  template: '<app-child (dataEvent)="receiveData($event)"></app-child>'
})
export class ParentComponent {
  receiveData(data: string) {
    console.log(data); // 'Data from child'
  }
}
\`\`\`

## Component Styling

### View Encapsulation

Angular offers three encapsulation strategies:

\`\`\`typescript
@Component({
  selector: 'app-example',
  template: '<div class="example">Example</div>',
  styles: ['.example { color: red; }'],
  encapsulation: ViewEncapsulation.Emulated // default
})
\`\`\`

Options:
- **ViewEncapsulation.Emulated** - Emulates shadow DOM (default)
- **ViewEncapsulation.ShadowDom** - Uses shadow DOM
- **ViewEncapsulation.None** - No encapsulation (global styles)

### Component Styling Best Practices

1. Keep component styles isolated to the component
2. Use :host selector to target the component element itself
3. Use :host-context to style based on some condition outside the component
4. Use CSS variables for theme consistency

\`\`\`css
:host {
  display: block;
  margin: 10px;
}

:host-context(.theme-dark) {
  background-color: #333;
  color: white;
}
\`\`\`

## Smart vs. Presentational Components

### Smart (Container) Components
- Manage data and state
- Communicate with services
- Pass data down to presentational components

### Presentational Components
- Focus on UI rendering
- Receive data via @Input
- Emit events via @Output
- Have minimal to no business logic

This pattern helps maintain a clean separation of concerns.

## Best Practices

1. Keep components small and focused on a single responsibility
2. Use the OnPush change detection strategy for better performance
3. Use trackBy with *ngFor for optimized rendering of lists
4. Implement lazy loading for components in different modules
5. Follow a consistent naming convention for component files
6. Use dynamic components with ComponentFactoryResolver for advanced scenarios

By following these principles, you can build robust and maintainable Angular applications with a well-structured component architecture.`,
    course: null // Will be set after course is created
  },
  {
    title: 'React Hooks',
    content: `# React Hooks

## Introduction

React Hooks were introduced in React 16.8 as a way to use state and other React features without writing class components. Hooks allow you to:

- Use state and lifecycle features in functional components
- Extract and reuse stateful logic between components
- Compose multiple hooks for complex behavior

## Basic Hooks

### 1. useState

The \`useState\` hook allows functional components to have state:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### 2. useEffect

The \`useEffect\` hook handles side effects in functional components:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Fetch data when component mounts
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(result => setData(result));
      
    // Cleanup function runs when component unmounts
    return () => {
      // Clean up (e.g., cancel subscriptions)
    };
  }, []); // Empty dependency array means this runs once on mount
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
\`\`\`

### 3. useContext

The \`useContext\` hook accepts a context object and returns the current context value:

\`\`\`jsx
import React, { useContext } from 'react';

const ThemeContext = React.createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  
  return <button className={theme}>Themed Button</button>;
}
\`\`\`

## Additional Hooks

### 4. useReducer

\`useReducer\` is an alternative to \`useState\` for more complex state logic:

\`\`\`jsx
import React, { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
\`\`\`

### 5. useCallback

\`useCallback\` returns a memoized callback that only changes if dependencies change:

\`\`\`jsx
import React, { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  
  // This function is recreated only when count changes
  const handleClick = useCallback(() => {
    console.log('Button clicked, count:', count);
  }, [count]);
  
  return <Child onClick={handleClick} />;
}
\`\`\`

### 6. useMemo

\`useMemo\` returns a memoized value that only recomputes when dependencies change:

\`\`\`jsx
import React, { useState, useMemo } from 'react';

function ExpensiveCalculation({ items }) {
  const [filter, setFilter] = useState('');
  
  // Expensive calculation memoized and only recomputed when items or filter change
  const filteredItems = useMemo(() => {
    console.log('Computing filtered items...');
    return items.filter(item => item.includes(filter));
  }, [items, filter]);
  
  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>
        {filteredItems.map(item => <li key={item}>{item}</li>)}
      </ul>
    </>
  );
}
\`\`\`

### 7. useRef

\`useRef\` returns a mutable ref object whose \`.current\` property is initialized to the passed argument:

\`\`\`jsx
import React, { useRef, useEffect } from 'react';

function TextInputWithFocus() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Focus the input element after mount
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} type="text" />;
}
\`\`\`

## Custom Hooks

Custom hooks allow you to extract component logic into reusable functions:

\`\`\`jsx
import { useState, useEffect } from 'react';

// Custom hook for fetching data
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage in a component
function DataComponent() {
  const { data, loading, error } = useFetch('https://api.example.com/data');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>Data: {JSON.stringify(data)}</div>;
}
\`\`\`

## Rules of Hooks

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call hooks from React functional components or custom hooks
3. **Custom hooks must start with "use"** - This naming convention is important for linting tools

By following these rules, you ensure that hooks maintain their state correctly between renders.

## Best Practices

1. Keep custom hooks focused on a specific concern
2. Use the dependency array in useEffect/useCallback/useMemo properly
3. Use the React DevTools to debug hooks
4. Consider using the eslint-plugin-react-hooks package
5. Avoid excessive state - group related state with useReducer
6. Use functional updates when new state depends on old state

Hooks simplify component code, improve reusability, and provide a more direct API to React concepts.`,
    course: null // Will be set after course is created
  }
];

// Import all data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Topic.deleteMany();
    console.log('Data cleared...');

    // Create users
    const admin = await User.create(adminUser);
    await User.create(regularUser);

    // Create courses
    const createdCourses = await Course.create(courses);
    console.log('Courses created...');

    // Create topics with associated courses
    const topicsToCreate = topics.map((topic, index) => {
      const courseIndex = index % createdCourses.length;
      return {
        ...topic,
        course: createdCourses[courseIndex]._id
      };
    });

    await Topic.create(topicsToCreate);
    console.log('Topics created...');

    console.log('Data Import Success!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

// Delete all data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Topic.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit(1);
  }
};

// Determine which operation to run based on command line argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add an argument: -i (import) or -d (delete)');
  process.exit();
}
export const BADGES = {
  f1: "Data Entry Initiate",
  f2: "Sequence Manipulator",
  f3: "Memory Guardian",
  f4: "Hash Forger",
  f5: "Iterative Engine",
  f6: "Pipeline Architect",
  f7: "Persistence Master",
  f8: "Blueprint Sovereign"
};

export const curriculum = [
  { 
    id: "f1", 
    title: "Floor 1: Data Entry", 
    description: "Mastering Scalars, Input Sensors, and Type Casting Protocols.", 
    difficulty: 1,
    theme: "Foundations",
    icon: "⚔️",
    tutorial: "In this floor, you will learn how to capture data from the neural link using `input()`. Remember, all input is received as a string; use `int()` or `float()` to cast it into a numeric scalar for calculation.",
    definition: "Data Entry is the process of capturing raw input from external sources and converting it into a format that a program can process. In Python, this primarily involves the `input()` function and type casting (e.g., `int()`, `float()`).",
    dsContext: "In Data Science, this is the 'Data Acquisition' phase. Raw data from CSVs, APIs, or user sensors must be ingested and cast into appropriate numeric types (Tensors/Arrays) before any mathematical modeling can occur.",
    protocols: ["Neural Input Capture", "Scalar Type Casting", "Memory Allocation"],
    exercises: [
      { id: "e1_1", title: "Ritual of Summation", definition: "Summation is the fundamental operation of adding a sequence of numbers. In programming, it's the first step towards data aggregation and statistical analysis.", hint: "Use `a = int(input())` to capture the first integer." },
      { id: "e1_2", title: "Neural Profile", definition: "A profile is a structured collection of data points that describe an entity. Capturing diverse data types (strings, integers, floats) is essential for building comprehensive datasets.", hint: "Capture name (str), age (int), and power (float) using `input()`." },
      { id: "e1_3", title: "Scalar Conversion", definition: "Type casting is the explicit conversion of data from one type to another. Understanding how precision is lost (e.g., float to int) is critical for maintaining data integrity in calculations.", hint: "Convert a float to an int using `int()` to see the data loss." }
    ]
  },
  { 
    id: "f2", 
    title: "Floor 2: Data Cleaning", 
    description: "Navigating Sequence Manipulation and Conditional Logic Gates.", 
    difficulty: 2,
    theme: "Logic",
    icon: "💎",
    tutorial: "Floor 2 introduces Logic Gates (`if`, `elif`, `else`). These are the bifurcation points of your script. Use them to filter noise from signal.",
    definition: "Conditional Logic (Control Flow) allows a program to execute different code blocks based on whether a condition is True or False. This is implemented using `if`, `elif`, and `else` statements.",
    dsContext: "Data Cleaning relies heavily on logic gates to handle missing values (NaNs), filter out outliers, and categorize continuous data into discrete bins for feature engineering.",
    protocols: ["Logic Bifurcation", "Comparison Operators", "Boolean Algebra"],
    exercises: [
      { id: "e2_1", title: "The Bifurcation", definition: "Bifurcation logic uses conditional statements to direct the flow of a program. It's the basis for decision-making algorithms and data filtering based on specific criteria.", hint: "Check if a value is even using the modulo operator: `x % 2 == 0`." },
      { id: "e2_2", title: "Signal Filter", definition: "Filtering is the process of isolating specific data points from a stream. In data science, this allows us to focus on relevant signals while discarding noise or outliers.", hint: "Use `if-elif-else` to categorize a signal strength (0-100)." },
      { id: "e2_3", title: "Neural Gatekeeper", definition: "Gatekeeping uses complex boolean logic (AND/OR/NOT) to enforce strict access or validation rules. It ensures that only data meeting all necessary criteria proceeds through the pipeline.", hint: "Check if both 'access_key' and 'neural_sync' are valid using `and`." }
    ]
  },
  { 
    id: "f3", 
    title: "Floor 3: Memory Management", 
    description: "Managing Mutable and Immutable Structures; The Palindrome Check.", 
    difficulty: 2,
    theme: "Memory",
    icon: "🛡️",
    tutorial: "Strings and Lists are your primary memory buffers. Strings are immutable—once forged, they cannot be altered. Lists are mutable, allowing for dynamic reconfiguration.",
    definition: "Memory Management in Python involves understanding Mutability. Strings are immutable sequences of characters, while Lists are mutable ordered collections that can store mixed data types.",
    dsContext: "Lists are the precursors to NumPy arrays and Pandas Series. Understanding slicing and mutability is critical for efficient data manipulation and avoiding 'SettingWithCopy' warnings in data pipelines.",
    protocols: ["Sequence Slicing", "Immutability Check", "List Manipulation"],
    exercises: [
      { id: "e3_1", title: "The Metamorphosis", definition: "Palindromes are sequences that remain identical when reversed. This exercise masters string slicing and comparison, which are core techniques for text processing and pattern recognition.", hint: "A palindrome reads the same forwards and backwards. Try `s == s[::-1]`." },
      { id: "e3_2", title: "Buffer Reversal", definition: "Reversal is a common sequence operation used in data restructuring. Mastering list manipulation allows for dynamic reordering of data points for various analytical perspectives.", hint: "Reverse a list using `.reverse()` or `[::-1]`." },
      { id: "e3_3", title: "Memory Slicing", definition: "Slicing is a powerful technique for extracting sub-sections of data. It's the foundation for windowing operations and feature extraction from large datasets.", hint: "Extract the first 5 elements of a list using `list[:5]`." }
    ]
  },
  { 
    id: "f4", 
    title: "Floor 4: Data Filtering", 
    description: "Architecting Hash Maps and Unique Sets for rapid retrieval.", 
    difficulty: 3,
    theme: "Optimization",
    icon: "🔍",
    tutorial: "Dictionaries (Hash Maps) allow for O(1) retrieval. They are the index of your neural database. Sets ensure uniqueness, purging duplicate data packets.",
    definition: "Data Filtering uses Dictionaries (key-value pairs) for fast lookups and Sets (unordered collections of unique elements) to eliminate redundancy.",
    dsContext: "Dictionaries are used for 'Feature Mapping' and 'Label Encoding'. Sets are essential for identifying unique categories in a dataset and performing set operations like intersections for data merging.",
    protocols: ["Hash Map Forging", "Unique Set Filtering", "Key-Value Pairs"],
    exercises: [
      { id: "e4_1", title: "Hash Map Forging", definition: "Dictionaries provide O(1) lookup efficiency by mapping unique keys to values. This is the standard for building fast, searchable indexes and lookup tables in large-scale systems.", hint: "Use `my_dict[key] = value` to store a mapping." },
      { id: "e4_2", title: "Duplicate Purge", definition: "Sets are unordered collections that automatically enforce uniqueness. They are the most efficient way to remove duplicates and perform mathematical set operations like union and intersection.", hint: "Convert a list to a `set()` to remove duplicates." },
      { id: "e4_3", title: "Feature Mapping", definition: "Mapping involves associating raw identifiers with descriptive attributes. This is a key step in data labeling and preparing categorical data for machine learning models.", hint: "Map sensor IDs to their current readings in a dictionary." }
    ]
  },
  { 
    id: "f5", 
    title: "Floor 5: Iterative Engines", 
    description: "Deploying Loops for Gradient Descent and Optimization.", 
    difficulty: 3,
    theme: "Iteration",
    icon: "🌀",
    tutorial: "Loops (`for`, `while`) are the iterative engines of Aincrad. They allow you to process vast streams of data until convergence is reached.",
    definition: "Iterative Engines (Loops) allow code to be executed repeatedly. `for` loops iterate over sequences, while `while` loops continue until a condition is no longer met.",
    dsContext: "Iteration is the core of 'Gradient Descent' and 'Hyperparameter Tuning'. We loop through epochs to minimize loss functions and iterate over data batches to train neural networks.",
    protocols: ["Iterative Convergence", "Range Generation", "List Comprehension"],
    exercises: [
      { id: "e5_1", title: "Cyclic Tables", definition: "Iteration allows for the repetitive execution of logic. Generating tables is a basic form of data generation and transformation used to prepare lookup values or synthetic data.", hint: "Use `range(1, 11)` to iterate through multipliers." },
      { id: "e5_2", title: "Neural Convergence", definition: "Convergence is the process of iteratively approaching a target state. This is the fundamental principle behind optimization algorithms like Gradient Descent, where we minimize error over time.", hint: "Use a `while` loop to decrement a value until it reaches zero." },
      { id: "e5_3", title: "List Comprehension", definition: "List comprehension is Python's 'syntactic sugar' for creating lists efficiently. It's a hallmark of 'Pythonic' code, allowing for concise and readable data transformations in a single line.", hint: "Create a list of squares using `[x**2 for x in range(10)]`." }
    ]
  },
  { 
    id: "f6", 
    title: "Floor 6: Pipeline Building", 
    description: "Constructing Modular Architecture through Functions and Recursion.", 
    difficulty: 4,
    theme: "Architecture",
    icon: "🏗️",
    tutorial: "Functions are modular blueprints. They encapsulate logic for reuse. Recursion is a function calling itself—a powerful but dangerous loop into the neural abyss.",
    definition: "Pipeline Building involves Functions—reusable blocks of code that perform a specific task. Recursion is a technique where a function calls itself to solve smaller instances of the same problem.",
    dsContext: "Data Pipelines are built using modular functions to ensure reproducibility. Recursion is often used in tree-based algorithms like 'Decision Trees' and 'Random Forests' for splitting nodes.",
    protocols: ["Modular Encapsulation", "Recursive Depth", "Lambda Forge"],
    exercises: [
      { id: "e6_1", title: "Recursive Factorials", definition: "Recursion solves complex problems by breaking them into smaller, self-similar sub-problems. It's a core concept for navigating hierarchical data structures like trees and graphs.", hint: "The base case for factorial is `if n == 0: return 1`." },
      { id: "e6_2", title: "Modular Architect", definition: "Modularity through functions promotes code reuse and maintainability. In data science, modular pipelines ensure that data transformations are consistent across training and inference.", hint: "Define a function `calc_potential(cap, sync)` that returns their sum." },
      { id: "e6_3", title: "Lambda Forge", definition: "Lambda functions are anonymous, one-line functions used for short-lived operations. They are frequently used in functional programming patterns like `map()`, `filter()`, and `apply()` in Pandas.", hint: "Use a `lambda` function to square a number." }
    ]
  },
  { 
    id: "f7", 
    title: "Floor 7: Data Persistence", 
    description: "Executing ETL Processes and File I/O Operations.", 
    difficulty: 4,
    theme: "Persistence",
    icon: "📜",
    tutorial: "Data must persist beyond the current session. Use `open()` with 'r' or 'w' modes to read from or write to the system's persistent storage.",
    definition: "Data Persistence (File I/O) is the ability to save data to a permanent storage medium (like a hard drive) and retrieve it later using file handling protocols.",
    dsContext: "This is the 'ETL' (Extract, Transform, Load) process. Data Scientists must read raw data from various formats (CSV, JSON, SQL) and save processed models (Pickling) for deployment.",
    protocols: ["File I/O Operations", "Context Managers", "ETL Pipelines"],
    exercises: [
      { id: "e7_1", title: "Log Cleansing", definition: "File I/O is the bridge between volatile memory and persistent storage. Mastering safe file handling (using context managers) prevents data corruption and resource leaks during ETL processes.", hint: "Use `with open('file.txt', 'r') as f:` for safe file handling." },
      { id: "e7_2", title: "Neural Export", definition: "Exporting data to persistent files (CSV, JSON, TXT) is critical for sharing results and saving processed datasets for future analysis or external visualization.", hint: "Write a list of strings to a file, one per line." },
      { id: "e7_3", title: "System Import", definition: "Importing data is the first step of any analysis. Efficiently reading and parsing external files allows a program to process real-world data from diverse sources.", hint: "Read a file and count the number of lines it contains." }
    ]
  },
  { 
    id: "f8", 
    title: "Floor 8: Model Class Design", 
    description: "Forging Object-Oriented Blueprints for advanced System Design.", 
    difficulty: 5,
    theme: "Sovereignty",
    icon: "👑",
    tutorial: "Classes are the ultimate blueprints. They define both state (attributes) and behavior (methods). This is the foundation of advanced System Architecture.",
    definition: "Object-Oriented Programming (OOP) uses Classes to create Objects. A class is a blueprint that defines the data (attributes) and actions (methods) an object can perform.",
    dsContext: "Most ML libraries (Scikit-Learn, PyTorch) are built on OOP. Models are classes with `fit()` and `predict()` methods. Custom class design is essential for building scalable AI systems.",
    protocols: ["Object Orientation", "State Initialization", "Inheritance Gates"],
    exercises: [
      { id: "e8_1", title: "The Bank Architect", definition: "Constructors initialize the internal state of an object. In AI, this is used to set up model parameters, hyperparameters, and internal buffers before training begins.", hint: "Use `__init__` to initialize the state of your object." },
      { id: "e8_2", title: "Neural Entity", definition: "Classes encapsulate state and behavior into a single unit. This 'Object-Oriented' approach is the standard for building complex, modular AI entities and system components.", hint: "Create a `User` class with `name` and `rank` attributes." },
      { id: "e8_3", title: "Inheritance Gate", definition: "Inheritance allows a class to derive properties from a parent class. This promotes code reuse and hierarchy, enabling the creation of specialized AI models from a common base.", hint: "Create a `Master` class that inherits from `User`." }
    ]
  }
];

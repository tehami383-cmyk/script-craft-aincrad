export const BADGES = {
  f1: "Syntax Initiate",
  f2: "Collection Specialist",
  f3: "Buffer Manipulator",
  f4: "Method Master",
  f5: "NumPy Architect",
  f6: "Statistical Analyst",
  f7: "Logic Sovereign",
  f8: "Automation Legend"
};

export const curriculum = [
  { 
    id: "f1", 
    title: "Floor 1: Python Basics", 
    description: "Variables, Types, and Arithmetic Operations.", 
    difficulty: 1,
    theme: "Foundations",
    icon: "⚔️",
    tutorial: "Welcome to Aincrad's Neural Link. Before we process complex signals, you must master the basics of Python: variables and data types. Variables allow you to store data, and types define what that data is (integers, floats, or strings).",
    definition: "Python Basics involve using variables to store data and performing arithmetic. Common types include `int` (integers), `float` (decimals), and `str` (text).",
    dsContext: "In Data Science, variables store your datasets, model parameters, and calculation results. Knowing your data types is the first step in ensuring your analysis is accurate.",
    protocols: ["Variable Assignment", "Arithmetic Operations", "Type Identification"],
    exercises: [
      { id: "e1_1", title: "Variable Assignment", definition: "Assigning a value to a name so it can be reused. For example, `x = 5` stores the number 5 in the variable `x`.", hint: "Create a variable named `savings` and set it to 100." },
      { id: "e1_2", title: "Calculations", definition: "Using Python as a calculator. You can use `+`, `-`, `*`, `/`, and `**` for exponentiation.", hint: "Calculate your total savings after 10% interest: `savings * 1.1`." },
      { id: "e1_3", title: "Type Conversion", definition: "Changing data from one type to another, like converting a string '10' to an integer 10 using `int()`.", hint: "Use `type()` to check a variable's type, and `str()` to convert a number to text." }
    ]
  },
  { 
    id: "f2", 
    title: "Floor 2: Python Lists", 
    description: "Storing and Accessing Collections of Data.", 
    difficulty: 2,
    theme: "Storage",
    icon: "💎",
    tutorial: "A single variable can only hold one piece of data. Lists allow you to store many values in a single variable, which is essential for handling sequences of neural observations.",
    definition: "A List is a collection of values. You create a list using square brackets: `[1, 2, 3]`. Lists can contain any data type, even other lists.",
    dsContext: "Lists are used to store sequences of data points, like daily stock prices or sensor readings, before they are processed into more advanced structures like NumPy arrays.",
    protocols: ["List Creation", "Indexing", "Subsetting"],
    exercises: [
      { id: "e2_1", title: "Creating Lists", definition: "Grouping multiple data points together. For example, `areas = [11.25, 18.0, 20.0]`.", hint: "Create a list called `hall_areas` containing four different numbers." },
      { id: "e2_2", title: "Subsetting Lists", definition: "Accessing a specific element in a list using its index. Remember, Python indexing starts at 0!", hint: "Get the first element of your list using `list[0]`." },
      { id: "e2_3", title: "List Slicing", definition: "Selecting a range of elements from a list using the `[start:end]` syntax. The 'end' index is not included.", hint: "Use `list[1:3]` to get the second and third elements." }
    ]
  },
  { 
    id: "f3", 
    title: "Floor 3: List Manipulation", 
    description: "Modifying, Adding, and Removing Data.", 
    difficulty: 2,
    theme: "Manipulation",
    icon: "🛡️",
    tutorial: "Data is rarely perfect. You'll often need to update values, add new observations, or remove errors from your lists to keep the neural buffer clean.",
    definition: "List Manipulation involves changing elements, adding new ones with `.append()`, or removing them with `.remove()` or `del`.",
    dsContext: "Data cleaning often involves updating incorrect entries in a list or appending new data points as they arrive from a live stream.",
    protocols: ["Element Updating", "List Extension", "Data Purging"],
    exercises: [
      { id: "e3_1", title: "Updating Elements", definition: "Changing the value of an existing list item by targeting its index. For example, `list[0] = 10`.", hint: "Change the second element of your list to a new value." },
      { id: "e3_2", title: "Adding Data", definition: "Using the `+` operator to combine lists or the `.append()` method to add a single item to the end.", hint: "Add two lists together using `list1 + list2`." },
      { id: "e3_3", title: "Deleting Items", definition: "Removing elements from a list using the `del` statement. For example, `del(list[1])`.", hint: "Delete the last element of your list." }
    ]
  },
  { 
    id: "f4", 
    title: "Floor 4: Functions & Methods", 
    description: "Leveraging Built-in Tools for Data Analysis.", 
    difficulty: 3,
    theme: "Tools",
    icon: "🔍",
    tutorial: "Don't reinvent the wheel. Python provides many built-in functions like `len()` and `max()` to analyze your data quickly. Objects also have 'methods'—functions that belong to them.",
    definition: "Functions are reusable pieces of code. Methods are functions that are specific to an object (like `.upper()` for strings or `.index()` for lists).",
    dsContext: "Data Scientists use functions to calculate statistics (mean, max) and methods to transform data (sorting lists, cleaning strings).",
    protocols: ["Function Calling", "Method Execution", "Argument Passing"],
    exercises: [
      { id: "e4_1", title: "Built-in Functions", definition: "Using standard Python functions to get info about your data. For example, `len(list)` returns the number of items.", hint: "Find the maximum value in a list using the `max()` function." },
      { id: "e4_2", title: "String Methods", definition: "Performing actions on text data. For example, `\"hello\".upper()` turns the text into uppercase.", hint: "Use the `.replace()` method to change a part of a string." },
      { id: "e4_3", title: "List Methods", definition: "Using methods specific to lists, like `.index(value)` to find where a value is located.", hint: "Use `.count(value)` to see how many times a number appears in your list." }
    ]
  },
  { 
    id: "f5", 
    title: "Floor 5: NumPy Arrays", 
    description: "High-Performance Numeric Computing.", 
    difficulty: 3,
    theme: "Performance",
    icon: "🌀",
    tutorial: "Standard lists are slow for math. NumPy arrays are the 'Tensors' of Aincrad—optimized for fast calculations across entire datasets simultaneously.",
    definition: "NumPy is a package for scientific computing. Arrays are similar to lists but allow for element-wise calculations (e.g., multiplying an entire array by 2).",
    dsContext: "NumPy is the foundation of almost all Data Science in Python. It's used for linear algebra, statistical analysis, and as the base for Pandas and Scikit-Learn.",
    protocols: ["Package Importing", "Array Creation", "Element-wise Math"],
    exercises: [
      { id: "e5_1", title: "Importing NumPy", definition: "Loading an external package into your script. Usually done as `import numpy as np`.", hint: "Import the numpy package using the alias `np`." },
      { id: "e5_2", title: "Creating Arrays", definition: "Converting a Python list into a NumPy array using `np.array(my_list)`.", hint: "Create a NumPy array from a list of weights." },
      { id: "e5_3", title: "Array Arithmetic", definition: "Performing math on every element of an array at once. For example, `np_array * 2` doubles every value.", hint: "Calculate BMI by dividing a weight array by a height array squared." }
    ]
  },
  { 
    id: "f6", 
    title: "Floor 6: NumPy Statistics", 
    description: "Summarizing Data with Statistical Protocols.", 
    difficulty: 4,
    theme: "Statistics",
    icon: "🏗️",
    tutorial: "To understand a dataset, you need to summarize it. NumPy provides powerful statistical tools to find the average, middle, and spread of your neural signals.",
    definition: "Statistical functions in NumPy, like `np.mean()`, `np.median()`, and `np.std()`, allow you to quickly summarize large amounts of data.",
    dsContext: "Statistics are crucial for understanding the 'distribution' of your data, identifying outliers, and making data-driven decisions.",
    protocols: ["Mean Calculation", "Median Analysis", "Standard Deviation"],
    exercises: [
      { id: "e6_1", title: "The Average", definition: "Calculating the mean (average) of a dataset. It's the sum of all values divided by the count.", hint: "Use `np.mean()` to find the average of an array." },
      { id: "e6_2", title: "The Middle", definition: "Finding the median—the middle value when data is sorted. It's more robust to outliers than the mean.", hint: "Use `np.median()` to find the middle value of your data." },
      { id: "e6_3", title: "Data Spread", definition: "Calculating Standard Deviation (`std`) to see how spread out your data points are from the average.", hint: "Use `np.std()` to check the consistency of your data." }
    ]
  },
  { 
    id: "f7", 
    title: "Floor 7: Logic & Filtering", 
    description: "Conditional Logic and Data Selection Gates.", 
    difficulty: 4,
    theme: "Logic",
    icon: "📜",
    tutorial: "Logic gates allow your script to make decisions. In Data Science, we use logic to filter our datasets, selecting only the observations that meet certain criteria.",
    definition: "Logic involves comparison operators (`>`, `<`, `==`) and boolean operators (`and`, `or`, `not`). These return `True` or `False`.",
    dsContext: "Filtering is a daily task for Data Scientists. You might filter a dataset to only show customers over 18 or transactions greater than $100.",
    protocols: ["Comparison Logic", "Boolean Filtering", "Conditional Gates"],
    exercises: [
      { id: "e7_1", title: "Comparisons", definition: "Checking relationships between values. For example, `2 > 1` is `True`.", hint: "Check if a variable is greater than 50." },
      { id: "e7_2", title: "Boolean Operators", definition: "Combining multiple conditions. `and` requires both to be true; `or` requires at least one.", hint: "Check if a number is between 10 and 20 using `and`." },
      { id: "e7_3", title: "Array Filtering", definition: "Using a boolean array to select specific elements from a NumPy array. For example, `arr[arr > 5]`.", hint: "Select all elements in an array that are greater than 100." }
    ]
  },
  { 
    id: "f8", 
    title: "Floor 8: Loops & Iteration", 
    description: "Automating Repetitive Neural Tasks.", 
    difficulty: 5,
    theme: "Automation",
    icon: "👑",
    tutorial: "The final floor. Loops allow you to repeat a block of code for every item in a collection, automating the processing of vast neural databases.",
    definition: "A `for` loop repeats code for each item in a list. A `while` loop repeats code as long as a condition remains `True`.",
    dsContext: "Loops are used to iterate over rows in a DataFrame, train models over multiple epochs, or scrape data from multiple web pages.",
    protocols: ["For Loop Iteration", "While Loop Control", "Nested Automation"],
    exercises: [
      { id: "e8_1", title: "Basic For Loop", definition: "Iterating over a list and performing an action for each element.", hint: "Use `for x in list:` to print every item in your list." },
      { id: "e8_2", title: "Looping with Math", definition: "Performing calculations inside a loop to aggregate data or transform it.", hint: "Loop through a list of numbers and add 5 to each one." },
      { id: "e8_3", title: "While Loops", definition: "Repeating code until a specific goal is reached. Useful when you don't know the exact number of iterations needed.", hint: "Use a `while` loop to count down from 10 to 0." }
    ]
  }
];

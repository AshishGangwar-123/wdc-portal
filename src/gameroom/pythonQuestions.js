/* ==========================================================================
   CodeFuel Game — Python Questions Bank
   100+ questions across 5 difficulty tiers
   Each question: { tier, type, question, code?, options, answer, explanation }
   Types: 'output', 'fill', 'fix', 'concept', 'complete'
   ========================================================================== */

const pythonQuestions = [

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 1 — ROOKIE (Basics: print, variables, types, operators)
  // ═══════════════════════════════════════════════════════════════════════

  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'print("Hello, World!")',
    options: ['Hello, World!', 'hello, world!', '"Hello, World!"', 'Error'],
    answer: 0,
    explanation: 'print() outputs the string without quotes.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'x = 10\nprint(x + 5)',
    options: ['15', '105', 'x + 5', 'Error'],
    answer: 0,
    explanation: 'x is 10, so x + 5 = 15.'
  },
  {
    tier: 1, type: 'concept',
    question: 'Which is a valid variable name in Python?',
    code: null,
    options: ['my_var', '2name', 'my-var', 'class'],
    answer: 0,
    explanation: 'Variable names can contain letters, digits, and underscores but cannot start with a digit or be a keyword.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'print(type(3.14).__name__)',
    options: ['float', 'int', 'double', 'number'],
    answer: 0,
    explanation: '3.14 is a floating-point number in Python.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'print(10 // 3)',
    options: ['3', '3.33', '4', '10/3'],
    answer: 0,
    explanation: '// is integer (floor) division. 10 // 3 = 3.'
  },
  {
    tier: 1, type: 'fill',
    question: 'Fill in the blank to print "Python":',
    code: '___("Python")',
    options: ['print', 'echo', 'write', 'display'],
    answer: 0,
    explanation: 'print() is the function to output text in Python.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'print(2 ** 3)',
    options: ['8', '6', '23', 'Error'],
    answer: 0,
    explanation: '** is the exponentiation operator. 2³ = 8.'
  },
  {
    tier: 1, type: 'concept',
    question: 'What does the len() function return for "Hello"?',
    code: null,
    options: ['5', '4', '6', 'Error'],
    answer: 0,
    explanation: '"Hello" has 5 characters.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'x = "Code"\nprint(x * 2)',
    options: ['CodeCode', 'Code2', 'Code * 2', 'Error'],
    answer: 0,
    explanation: 'Multiplying a string repeats it.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'print(10 % 3)',
    options: ['1', '3', '0', '3.33'],
    answer: 0,
    explanation: '% is modulo — remainder of 10 ÷ 3 = 1.'
  },
  {
    tier: 1, type: 'concept',
    question: 'Which of these is a Boolean value?',
    code: null,
    options: ['True', '"True"', '1', 'yes'],
    answer: 0,
    explanation: 'True and False are Python\'s Boolean literals.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'a = "5"\nb = 3\nprint(a + str(b))',
    options: ['53', '8', 'Error', '"53"'],
    answer: 0,
    explanation: 'String concatenation: "5" + "3" = "53".'
  },
  {
    tier: 1, type: 'fill',
    question: 'Fill in the blank to convert "42" to an integer:',
    code: 'x = ___("42")',
    options: ['int', 'str', 'float', 'num'],
    answer: 0,
    explanation: 'int() converts a string to an integer.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'print(not True)',
    options: ['False', 'True', '0', 'Error'],
    answer: 0,
    explanation: 'not True evaluates to False.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'x = 7\nprint(x > 5 and x < 10)',
    options: ['True', 'False', '7', 'Error'],
    answer: 0,
    explanation: '7 > 5 is True and 7 < 10 is True, so True and True = True.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'name = "Python"\nprint(name[0])',
    options: ['P', 'p', 'Python', 'Error'],
    answer: 0,
    explanation: 'Indexing starts at 0. name[0] is "P".'
  },
  {
    tier: 1, type: 'concept',
    question: 'What is used for single-line comments in Python?',
    code: null,
    options: ['#', '//', '/* */', '--'],
    answer: 0,
    explanation: '# is used for single-line comments.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'print("Hello" + " " + "World")',
    options: ['Hello World', 'HelloWorld', '"Hello" + " " + "World"', 'Error'],
    answer: 0,
    explanation: 'String concatenation joins the three strings.'
  },
  {
    tier: 1, type: 'output',
    question: 'What is the output?',
    code: 'x = 15\nprint(x == 15)',
    options: ['True', 'False', '15', 'Error'],
    answer: 0,
    explanation: '== checks equality. 15 == 15 is True.'
  },
  {
    tier: 1, type: 'fill',
    question: 'Fill in the blank to get user input:',
    code: 'name = ___("Enter name: ")',
    options: ['input', 'read', 'get', 'scan'],
    answer: 0,
    explanation: 'input() reads user input from the console.'
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 2 — CODER (Lists, loops, conditionals, strings)
  // ═══════════════════════════════════════════════════════════════════════

  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'nums = [1, 2, 3, 4, 5]\nprint(nums[2:])',
    options: ['[3, 4, 5]', '[1, 2, 3]', '[2, 3, 4, 5]', '[3, 4]'],
    answer: 0,
    explanation: 'Slicing from index 2 to end gives [3, 4, 5].'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'for i in range(3):\n    print(i, end=" ")',
    options: ['0 1 2', '1 2 3', '0 1 2 3', '1 2'],
    answer: 0,
    explanation: 'range(3) generates 0, 1, 2.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'x = [1, 2, 3]\nx.append(4)\nprint(len(x))',
    options: ['4', '3', '5', 'Error'],
    answer: 0,
    explanation: 'append adds one element, making length 4.'
  },
  {
    tier: 2, type: 'fix',
    question: 'Which line causes an error?',
    code: 'fruits = ["apple", "banana"]\nprint(fruits[2])',
    options: ['Line 2 — IndexError', 'Line 1 — SyntaxError', 'No error', 'Line 2 — TypeError'],
    answer: 0,
    explanation: 'Index 2 is out of range for a 2-element list.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'text = "hello"\nprint(text.upper())',
    options: ['HELLO', 'hello', 'Hello', 'Error'],
    answer: 0,
    explanation: 'upper() converts all characters to uppercase.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'x = 10\nif x > 5:\n    print("big")\nelse:\n    print("small")',
    options: ['big', 'small', 'bigsmall', 'Error'],
    answer: 0,
    explanation: '10 > 5 is True, so "big" is printed.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'nums = [3, 1, 4, 1, 5]\nprint(max(nums))',
    options: ['5', '3', '1', '14'],
    answer: 0,
    explanation: 'max() returns the largest element.'
  },
  {
    tier: 2, type: 'fill',
    question: 'Fill in the blank to iterate over a list:',
    code: '___ item in [1, 2, 3]:\n    print(item)',
    options: ['for', 'while', 'each', 'loop'],
    answer: 0,
    explanation: 'for...in is used to iterate over sequences.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'text = "Python"\nprint(text[-1])',
    options: ['n', 'P', 'o', 'Error'],
    answer: 0,
    explanation: 'Negative indexing: -1 is the last character.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)',
    options: ['[1, 2, 3, 4]', '[1, 2, 3]', '[4]', 'Error'],
    answer: 0,
    explanation: 'y = x creates a reference, not a copy. Both point to the same list.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'words = "a,b,c".split(",")\nprint(words)',
    options: ["['a', 'b', 'c']", "['a,b,c']", 'a b c', 'Error'],
    answer: 0,
    explanation: 'split(",") splits the string at each comma.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
    options: ['6', '10', '3', '4'],
    answer: 0,
    explanation: '1 + 2 + 3 = 6.'
  },
  {
    tier: 2, type: 'concept',
    question: 'Which method removes the last element from a list?',
    code: null,
    options: ['pop()', 'remove()', 'del()', 'drop()'],
    answer: 0,
    explanation: 'pop() removes and returns the last element.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'print("hello world".title())',
    options: ['Hello World', 'HELLO WORLD', 'hello world', 'Hello world'],
    answer: 0,
    explanation: 'title() capitalizes the first letter of each word.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'x = {"a": 1, "b": 2}\nprint(x["b"])',
    options: ['2', '1', 'b', 'Error'],
    answer: 0,
    explanation: 'Dictionary access by key "b" returns 2.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'print(list(range(0, 10, 3)))',
    options: ['[0, 3, 6, 9]', '[0, 3, 6]', '[3, 6, 9]', '[0, 1, 2, 3]'],
    answer: 0,
    explanation: 'range(0, 10, 3) steps by 3: 0, 3, 6, 9.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'x = "Python"\nprint(x[1:4])',
    options: ['yth', 'Pyt', 'ytho', 'tho'],
    answer: 0,
    explanation: 'Slicing [1:4] gives characters at indices 1, 2, 3.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'x = [1, 2, 3]\nprint(x[::-1])',
    options: ['[3, 2, 1]', '[1, 2, 3]', '[1, 3]', 'Error'],
    answer: 0,
    explanation: '[::-1] reverses the list.'
  },
  {
    tier: 2, type: 'fill',
    question: 'Fill in the blank to check membership:',
    code: 'if "a" ___ "apple":\n    print("found")',
    options: ['in', '==', 'is', 'has'],
    answer: 0,
    explanation: '"in" checks if a substring exists in a string.'
  },
  {
    tier: 2, type: 'output',
    question: 'What is the output?',
    code: 'i = 0\nwhile i < 3:\n    i += 1\nprint(i)',
    options: ['3', '2', '4', '0'],
    answer: 0,
    explanation: 'Loop runs while i < 3. After loop, i is 3.'
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 3 — HACKER (Functions, lambda, comprehensions, dict ops)
  // ═══════════════════════════════════════════════════════════════════════

  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'def greet(name="World"):\n    return f"Hi {name}"\nprint(greet())',
    options: ['Hi World', 'Hi name', 'Error', 'Hi'],
    answer: 0,
    explanation: 'Default parameter value "World" is used when no argument is passed.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'nums = [1, 2, 3, 4, 5]\nresult = [x**2 for x in nums if x % 2 == 0]\nprint(result)',
    options: ['[4, 16]', '[1, 4, 9, 16, 25]', '[4, 8]', '[2, 4]'],
    answer: 0,
    explanation: 'List comprehension filters even numbers and squares them.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'f = lambda x, y: x + y\nprint(f(3, 7))',
    options: ['10', 'Error', 'xy', '37'],
    answer: 0,
    explanation: 'Lambda creates an anonymous function. f(3, 7) = 3 + 7 = 10.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'def foo(a, b=2, *args):\n    return a + b + sum(args)\nprint(foo(1, 3, 4, 5))',
    options: ['13', '12', '15', 'Error'],
    answer: 0,
    explanation: 'a=1, b=3, args=(4,5). 1 + 3 + 9 = 13.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'x = {i: i**2 for i in range(4)}\nprint(x[3])',
    options: ['9', '3', '6', 'Error'],
    answer: 0,
    explanation: 'Dict comprehension: {0:0, 1:1, 2:4, 3:9}. x[3] = 9.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'nums = [3, 1, 4, 1, 5]\nprint(sorted(nums, reverse=True))',
    options: ['[5, 4, 3, 1, 1]', '[1, 1, 3, 4, 5]', '[5, 4, 3]', 'Error'],
    answer: 0,
    explanation: 'sorted() with reverse=True sorts in descending order.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'x = [1, [2, 3], 4]\nprint(x[1][0])',
    options: ['2', '[2, 3]', '1', '3'],
    answer: 0,
    explanation: 'x[1] is [2, 3], and [2, 3][0] is 2.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'def swap(a, b):\n    return b, a\nx, y = swap(1, 2)\nprint(x, y)',
    options: ['2 1', '1 2', '(2, 1)', 'Error'],
    answer: 0,
    explanation: 'Function returns tuple (b, a) = (2, 1). Unpacked into x=2, y=1.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'text = "aabbcc"\nprint(text.count("b"))',
    options: ['2', '1', '3', '4'],
    answer: 0,
    explanation: 'count() counts occurrences. "b" appears twice.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'result = list(map(str, [1, 2, 3]))\nprint(result)',
    options: ["['1', '2', '3']", '[1, 2, 3]', "['str', 'str', 'str']", 'Error'],
    answer: 0,
    explanation: 'map(str, ...) applies str() to each element.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'x = {"a": 1, "b": 2, "c": 3}\nprint(list(x.values()))',
    options: ['[1, 2, 3]', "['a', 'b', 'c']", "[('a',1), ('b',2), ('c',3)]", 'Error'],
    answer: 0,
    explanation: 'values() returns dict values.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'nums = [1, 2, 3]\nresult = list(filter(lambda x: x > 1, nums))\nprint(result)',
    options: ['[2, 3]', '[1]', '[1, 2, 3]', '[]'],
    answer: 0,
    explanation: 'filter keeps elements where lambda returns True.'
  },
  {
    tier: 3, type: 'concept',
    question: 'What does *args allow in a function?',
    code: null,
    options: ['Variable number of positional arguments', 'Variable number of keyword arguments', 'A single list argument', 'No arguments'],
    answer: 0,
    explanation: '*args collects extra positional arguments as a tuple.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'a = [1, 2, 3]\nb = a.copy()\nb.append(4)\nprint(len(a))',
    options: ['3', '4', '0', 'Error'],
    answer: 0,
    explanation: 'copy() creates a shallow copy. Modifying b doesn\'t affect a.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'x = set([1, 2, 2, 3, 3, 3])\nprint(len(x))',
    options: ['3', '6', '1', '2'],
    answer: 0,
    explanation: 'Sets remove duplicates: {1, 2, 3}. Length = 3.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'def counter():\n    count = 0\n    def inc():\n        nonlocal count\n        count += 1\n        return count\n    return inc\nc = counter()\nprint(c(), c())',
    options: ['1 2', '0 1', '1 1', 'Error'],
    answer: 0,
    explanation: 'nonlocal allows modifying the enclosing scope variable.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'print([i for i in range(10) if i % 3 == 0])',
    options: ['[0, 3, 6, 9]', '[3, 6, 9]', '[0, 3, 6]', '[1, 2, 4]'],
    answer: 0,
    explanation: 'Filters multiples of 3 from 0-9.'
  },
  {
    tier: 3, type: 'fill',
    question: 'Fill in the blank for keyword arguments:',
    code: 'def info(**___):\n    for k, v in kwargs.items():\n        print(k, v)',
    options: ['kwargs', 'args', 'params', 'keys'],
    answer: 0,
    explanation: '**kwargs collects keyword arguments as a dictionary.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'x = (1, 2, 3)\nprint(x + (4, 5))',
    options: ['(1, 2, 3, 4, 5)', '[1, 2, 3, 4, 5]', 'Error', '(1, 2, 3, (4, 5))'],
    answer: 0,
    explanation: 'Tuple concatenation creates a new tuple.'
  },
  {
    tier: 3, type: 'output',
    question: 'What is the output?',
    code: 'a = [0] * 3\nprint(a)',
    options: ['[0, 0, 0]', '[0]', '0', 'Error'],
    answer: 0,
    explanation: '[0] * 3 repeats the list element 3 times.'
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 4 — ARCHITECT (Decorators, generators, OOP, error handling)
  // ═══════════════════════════════════════════════════════════════════════

  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f"{self.name} says Woof!"\nd = Dog("Rex")\nprint(d.speak())',
    options: ['Rex says Woof!', 'Dog says Woof!', 'name says Woof!', 'Error'],
    answer: 0,
    explanation: 'self.name stores "Rex". The f-string formats it.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'def gen():\n    yield 1\n    yield 2\n    yield 3\nprint(list(gen()))',
    options: ['[1, 2, 3]', '1', 'generator', 'Error'],
    answer: 0,
    explanation: 'yield produces values lazily. list() collects them all.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'try:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print("caught")\nfinally:\n    print("done")',
    options: ['caught\\ndone', 'caught', 'done', 'Error'],
    answer: 0,
    explanation: 'except catches the error, finally always runs.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'class A:\n    x = 1\nclass B(A):\n    pass\nclass C(B):\n    x = 3\nprint(B.x, C.x)',
    options: ['1 3', '1 1', '3 3', 'Error'],
    answer: 0,
    explanation: 'B inherits x=1 from A. C overrides with x=3.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'def decorator(func):\n    def wrapper():\n        print("before")\n        func()\n        print("after")\n    return wrapper\n\n@decorator\ndef hello():\n    print("hello")\n\nhello()',
    options: ['before\\nhello\\nafter', 'hello', 'before\\nafter', 'Error'],
    answer: 0,
    explanation: 'Decorator wraps hello() with before/after prints.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'x = [1, 2, 3]\nit = iter(x)\nprint(next(it), next(it))',
    options: ['1 2', '1 1', '2 3', 'Error'],
    answer: 0,
    explanation: 'iter() creates an iterator. Each next() advances it.'
  },
  {
    tier: 4, type: 'concept',
    question: 'What is a Python generator?',
    code: null,
    options: [
      'A function that uses yield to produce values lazily',
      'A class that generates random numbers',
      'A function that returns a list',
      'A built-in module'
    ],
    answer: 0,
    explanation: 'Generators use yield to produce values one at a time.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'class Foo:\n    def __str__(self):\n        return "I am Foo"\nprint(Foo())',
    options: ['I am Foo', '<Foo object>', 'Foo', 'Error'],
    answer: 0,
    explanation: '__str__ defines the string representation of an object.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'from functools import reduce\nprint(reduce(lambda a, b: a * b, [1, 2, 3, 4]))',
    options: ['24', '10', '4', 'Error'],
    answer: 0,
    explanation: 'reduce multiplies all: 1*2*3*4 = 24.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'class MyList(list):\n    def push(self, val):\n        self.append(val)\n        return self\nm = MyList([1, 2])\nm.push(3).push(4)\nprint(m)',
    options: ['[1, 2, 3, 4]', '[1, 2, 3]', '[3, 4]', 'Error'],
    answer: 0,
    explanation: 'push returns self, enabling method chaining.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'print({x: x**2 for x in range(5) if x % 2 != 0})',
    options: ['{1: 1, 3: 9}', '{0: 0, 2: 4, 4: 16}', '{1: 2, 3: 6}', 'Error'],
    answer: 0,
    explanation: 'Dict comprehension filtering odd numbers.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'class A:\n    def __init__(self):\n        self._x = 0\n    @property\n    def x(self):\n        return self._x * 2\na = A()\nprint(a.x)',
    options: ['0', '2', 'Error', '_x'],
    answer: 0,
    explanation: '@property makes x a computed attribute. 0 * 2 = 0.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'with open("test.txt", "w") as f:\n    f.write("hello")\nprint("ok")',
    options: ['ok', 'hello', 'Error', 'None'],
    answer: 0,
    explanation: 'with statement handles file closing automatically. "ok" is printed after.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'g = (x**2 for x in range(5))\nprint(sum(g))',
    options: ['30', '[0, 1, 4, 9, 16]', '16', 'Error'],
    answer: 0,
    explanation: 'Generator expression: 0+1+4+9+16 = 30.'
  },
  {
    tier: 4, type: 'concept',
    question: 'What does @staticmethod do?',
    code: null,
    options: [
      'Defines a method that doesn\'t need self or cls',
      'Makes a method private',
      'Makes a method faster',
      'Prevents method overriding'
    ],
    answer: 0,
    explanation: '@staticmethod creates a method that belongs to the class but doesn\'t access instance or class state.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\nprint(fib(7))',
    options: ['13', '8', '21', '5'],
    answer: 0,
    explanation: 'Fibonacci: 0,1,1,2,3,5,8,13. fib(7) = 13.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'x = [lambda i=i: i for i in range(3)]\nprint([f() for f in x])',
    options: ['[0, 1, 2]', '[2, 2, 2]', '[0, 0, 0]', 'Error'],
    answer: 0,
    explanation: 'Default arg i=i captures the value at creation time.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'class Meta(type):\n    pass\nclass MyClass(metaclass=Meta):\n    pass\nprint(type(MyClass).__name__)',
    options: ['Meta', 'type', 'MyClass', 'Error'],
    answer: 0,
    explanation: 'MyClass\'s metaclass is Meta, so type(MyClass) is Meta.'
  },
  {
    tier: 4, type: 'output',
    question: 'What is the output?',
    code: 'import collections\nd = collections.defaultdict(int)\nd["a"] += 1\nd["a"] += 2\nprint(d["a"], d["b"])',
    options: ['3 0', '3 Error', '1 0', 'Error'],
    answer: 0,
    explanation: 'defaultdict(int) defaults to 0. d["a"] = 3, d["b"] = 0.'
  },
  {
    tier: 4, type: 'fill',
    question: 'Fill in to make this an abstract method:',
    code: 'from abc import ABC, abstractmethod\nclass Shape(ABC):\n    @___\n    def area(self):\n        pass',
    options: ['abstractmethod', 'staticmethod', 'classmethod', 'property'],
    answer: 0,
    explanation: '@abstractmethod forces subclasses to implement the method.'
  },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 5 — LEGENDARY (Tricky edge cases, advanced patterns, algorithms)
  // ═══════════════════════════════════════════════════════════════════════

  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'def f(x, lst=[]):\n    lst.append(x)\n    return lst\nprint(f(1))\nprint(f(2))',
    options: ['[1]\\n[1, 2]', '[1]\\n[2]', '[1]\\n[1]', 'Error'],
    answer: 0,
    explanation: 'Mutable default argument is shared across calls — a classic Python gotcha!'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'print(0.1 + 0.2 == 0.3)',
    options: ['False', 'True', '0.3', 'Error'],
    answer: 0,
    explanation: 'Floating-point precision: 0.1 + 0.2 ≈ 0.30000000000000004, not exactly 0.3.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'x = [lambda: i for i in range(3)]\nprint([f() for f in x])',
    options: ['[2, 2, 2]', '[0, 1, 2]', '[0, 0, 0]', 'Error'],
    answer: 0,
    explanation: 'Lambda captures the variable i, not its value. After the loop, i=2 for all.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'a = (1,)\nb = (1)\nprint(type(a).__name__, type(b).__name__)',
    options: ['tuple int', 'tuple tuple', 'int int', 'Error'],
    answer: 0,
    explanation: '(1,) is a tuple; (1) is just an int in parentheses. The comma matters!'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'print(bool(""), bool(" "), bool("0"))',
    options: ['False True True', 'False False False', 'True True True', 'False False True'],
    answer: 0,
    explanation: 'Empty string is falsy. Non-empty strings (including " " and "0") are truthy.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'x = 256\ny = 256\nprint(x is y)\na = 257\nb = 257\nprint(a is b)',
    options: ['True\\nFalse', 'True\\nTrue', 'False\\nFalse', 'False\\nTrue'],
    answer: 0,
    explanation: 'Python caches integers -5 to 256. 257 creates separate objects.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'class A:\n    def __init__(self):\n        self.x = 1\n    def __del__(self):\n        print("deleted")\na = A()\na = None',
    options: ['deleted', 'Nothing', 'Error', '1'],
    answer: 0,
    explanation: 'Setting a=None removes the reference, triggering __del__.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'print([i for i in range(10) if i == 5 or i == 3 for _ in range(i)])',
    options: ['[3, 3, 3, 5, 5, 5, 5, 5]', '[3, 5]', '[5, 3]', 'Error'],
    answer: 0,
    explanation: 'Nested comprehension: 3 repeated 3 times, 5 repeated 5 times.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'a = [[0]*3]*3\na[0][0] = 1\nprint(a)',
    options: ['[[1, 0, 0], [1, 0, 0], [1, 0, 0]]', '[[1, 0, 0], [0, 0, 0], [0, 0, 0]]', '[[0, 0, 0], [0, 0, 0], [0, 0, 0]]', 'Error'],
    answer: 0,
    explanation: '[[0]*3]*3 creates 3 references to the SAME inner list. Modifying one modifies all!'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'import sys\nprint(sys.getsizeof([]) < sys.getsizeof(()))',
    options: ['False', 'True', 'Error', 'None'],
    answer: 0,
    explanation: 'Lists have more overhead than tuples, so an empty list is larger.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'def f():\n    try:\n        return 1\n    finally:\n        return 2\nprint(f())',
    options: ['2', '1', 'Error', 'None'],
    answer: 0,
    explanation: 'finally block\'s return overrides try block\'s return.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'x = {True: "yes", 1: "one", 1.0: "float"}\nprint(x)',
    options: ['{True: \'float\'}', '{True: \'yes\', 1: \'one\', 1.0: \'float\'}', '{1: \'one\'}', 'Error'],
    answer: 0,
    explanation: 'True == 1 == 1.0 in Python, so they\'re the same key. Last value wins.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'print("abc"[::-1][::-1][::-1])',
    options: ['cba', 'abc', 'cab', 'Error'],
    answer: 0,
    explanation: 'Reverse 3 times: abc→cba→abc→cba. Odd number of reverses = reversed.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'a = frozenset([1, 2, 3])\nb = {a: "hello"}\nprint(b[frozenset([1, 2, 3])])',
    options: ['hello', 'Error', 'None', '{1, 2, 3}'],
    answer: 0,
    explanation: 'frozenset is hashable and can be used as a dict key. Equal frozensets produce the same hash.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'class X:\n    def __init__(self):\n        self.val = 0\n    def __iadd__(self, other):\n        self.val += other\n        return self\nx = X()\nx += 5\nx += 3\nprint(x.val)',
    options: ['8', '5', '3', 'Error'],
    answer: 0,
    explanation: '__iadd__ implements += operator. 0 + 5 + 3 = 8.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'import itertools\nprint(list(itertools.chain([1,2], [3,4], [5])))',
    options: ['[1, 2, 3, 4, 5]', '[[1,2], [3,4], [5]]', '[1, 2, 3, 4, [5]]', 'Error'],
    answer: 0,
    explanation: 'itertools.chain flattens multiple iterables into one.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'x = type("Thing", (), {"greet": lambda self: "Hi"})\nprint(x().greet())',
    options: ['Hi', 'Error', 'Thing', 'None'],
    answer: 0,
    explanation: 'type() used as a class factory creates a new class dynamically.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'print(all([]))',
    options: ['True', 'False', 'Error', 'None'],
    answer: 0,
    explanation: 'all() returns True for an empty iterable (vacuous truth).'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'x = "hello"\nx = x.replace("l", "L", 1)\nprint(x)',
    options: ['heLlo', 'heLLo', 'Hello', 'Error'],
    answer: 0,
    explanation: 'replace with count=1 only replaces the first occurrence.'
  },
  {
    tier: 5, type: 'output',
    question: 'What is the output?',
    code: 'a = [1, 2, 3]\nb = [*a, *a]\nprint(len(b))',
    options: ['6', '3', '9', 'Error'],
    answer: 0,
    explanation: 'Unpacking *a twice creates [1,2,3,1,2,3]. Length = 6.'
  },
];

// ── Utilities ────────────────────────────────────────────────────────────────

/**
 * Get a random question from the pool, filtered by max allowed tier.
 * Avoids repeating recently asked questions.
 */
export function getRandomQuestion(maxTier, recentIds = [], poolSize = 10) {
  const eligible = pythonQuestions.filter(
    (q, idx) => q.tier <= maxTier && !recentIds.includes(idx)
  );

  if (eligible.length === 0) {
    // Fallback: allow repeats
    const fallback = pythonQuestions.filter(q => q.tier <= maxTier);
    const pick = fallback[Math.floor(Math.random() * fallback.length)];
    return { ...pick, _index: pythonQuestions.indexOf(pick) };
  }

  // Weighted: prefer higher tiers slightly
  const weighted = eligible.flatMap((q, i) => {
    const weight = q.tier;
    return Array(weight).fill(q);
  });

  const pick = weighted[Math.floor(Math.random() * weighted.length)];
  return { ...pick, _index: pythonQuestions.indexOf(pick) };
}

/**
 * Shuffle options and return { shuffledOptions, correctIndex }
 */
export function shuffleQuestion(question) {
  const indices = question.options.map((_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    shuffledOptions: indices.map(i => question.options[i]),
    correctIndex: indices.indexOf(question.answer),
  };
}

export default pythonQuestions;

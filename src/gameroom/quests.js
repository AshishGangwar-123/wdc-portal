/* ==========================================================================
   Code City Explorer — Infinite Level Procedural Quest Engine v3
   Generates 20 difficulty-scaled Python missions per level (Level 1 to ∞)
   ========================================================================== */

const MAP_LOCATIONS = [
  { name: 'Variable Village', category: 'home', x: 350, y: 350 },
  { name: 'Math Factory', category: 'factory', x: 1050, y: 350 },
  { name: 'Logic Lab', category: 'factory', x: 1450, y: 550 },
  { name: 'Terminal Tower', category: 'tower', x: 1150, y: 1100 },
  { name: 'Tax Trap Alley', category: 'shop', x: 550, y: 850 },
  { name: 'Confusion Corner', category: 'home', x: 1550, y: 950 },
  { name: 'Import Island', category: 'park', x: 400, y: 1350 },
  { name: 'Market Square', category: 'shop', x: 300, y: 400 },
  { name: 'Decision Junction', category: 'tower', x: 800, y: 400 },
  { name: 'Discount Depot', category: 'factory', x: 1400, y: 400 },
  { name: 'Fallback Plaza', category: 'home', x: 1400, y: 900 },
  { name: 'Zero Zone', category: 'park', x: 800, y: 900 },
  { name: 'Output Outpost', category: 'tower', x: 300, y: 900 },
  { name: 'Error Expressway', category: 'factory', x: 1550, y: 650 },
  { name: 'Bargain Basement', category: 'shop', x: 800, y: 1400 },
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Multi-Language Syntax Block Generator ──────────────────────────────────
const TEMPLATE_TYPES = ['arithmetic', 'tax', 'conditionals', 'loops', 'squares'];

function getSyntaxBlocks(templateType, levelNum, qNum, lang = 'python') {
  const normLang = (lang || 'python').toLowerCase();

  if (templateType === 'arithmetic') {
    const a = 10 * levelNum + qNum * 3;
    const b = 5 + qNum * 2;
    const total = a + b;

    let correctBlocks = [];
    let distractorBlocks = [];
    let problemStatement = '';

    if (normLang === 'javascript') {
      problemStatement = `Objective: Construct a complete JavaScript script to calculate combined energy reserves.\n1. Declare primary energy variable \`const a = ${a}\`.\n2. Declare secondary reservoir variable \`const b = ${b}\`.\n3. Compute \`const total = a + b\` representing the combined power output.\n4. Output formatted string \`console.log(\`Energy: \${total}\`)\` to terminal.`;
      correctBlocks = [
        { code: `const a = ${a};`, explanation: `Initializes primary energy variable a = ${a}.` },
        { code: `const b = ${b};`, explanation: `Initializes secondary battery variable b = ${b}.` },
        { code: `const total = a + b;`, explanation: 'Calculates the sum of both energy sources.' },
        { code: `console.log(\`Energy: \${total}\`);`, explanation: 'Prints the formatted energy total log to console.' },
      ];
      distractorBlocks = [
        { code: `const total = a - b;`, explanation: 'Incorrect formula: subtracts power instead of adding.' },
        { code: `const total = a * b;`, explanation: 'Incorrect formula: multiplies power values.' },
      ];
    } else if (normLang === 'c') {
      problemStatement = `Objective: Construct a C program to calculate combined energy reserves.\n1. Declare integer variable \`int a = ${a}\`.\n2. Declare integer variable \`int b = ${b}\`.\n3. Compute combined total \`int total = a + b\`.\n4. Output using \`printf("Energy: %d\\n", total)\`.`;
      correctBlocks = [
        { code: `int a = ${a};`, explanation: `Declares integer variable a = ${a}.` },
        { code: `int b = ${b};`, explanation: `Declares integer variable b = ${b}.` },
        { code: `int total = a + b;`, explanation: 'Computes total energy sum in C.' },
        { code: `printf("Energy: %d\\n", total);`, explanation: 'Prints formatted total energy using printf.' },
      ];
      distractorBlocks = [
        { code: `int total = a - b;`, explanation: 'Subtraction operator error.' },
        { code: `int total = a * b;`, explanation: 'Multiplication operator error.' },
      ];
    } else if (normLang === 'cpp') {
      problemStatement = `Objective: Construct a C++ program to calculate combined energy reserves.\n1. Declare integer \`int a = ${a}\`.\n2. Declare integer \`int b = ${b}\`.\n3. Compute total \`int total = a + b\`.\n4. Output formatted stream \`std::cout << "Energy: " << total << std::endl\`.`;
      correctBlocks = [
        { code: `int a = ${a};`, explanation: `Declares int a = ${a}.` },
        { code: `int b = ${b};`, explanation: `Declares int b = ${b}.` },
        { code: `int total = a + b;`, explanation: 'Computes total power output in C++.' },
        { code: `std::cout << "Energy: " << total << std::endl;`, explanation: 'Outputs energy total using std::cout stream.' },
      ];
      distractorBlocks = [
        { code: `int total = a - b;`, explanation: 'Subtraction error.' },
        { code: `int total = a * b;`, explanation: 'Multiplication error.' },
      ];
    } else if (normLang === 'java') {
      problemStatement = `Objective: Construct a Java program to calculate combined energy reserves.\n1. Declare integer \`int a = ${a}\`.\n2. Declare integer \`int b = ${b}\`.\n3. Compute total \`int total = a + b\`.\n4. Output using \`System.out.println("Energy: " + total)\`.`;
      correctBlocks = [
        { code: `int a = ${a};`, explanation: `Declares integer variable a = ${a}.` },
        { code: `int b = ${b};`, explanation: `Declares integer variable b = ${b}.` },
        { code: `int total = a + b;`, explanation: 'Computes total energy in Java.' },
        { code: `System.out.println("Energy: " + total);`, explanation: 'Prints energy total using System.out.println.' },
      ];
      distractorBlocks = [
        { code: `int total = a - b;`, explanation: 'Subtraction operator error.' },
        { code: `int total = a * b;`, explanation: 'Multiplication operator error.' },
      ];
    } else {
      // Python (Default)
      problemStatement = `Objective: Construct a complete Python 3 script to calculate combined energy reserves.\n1. Declare primary energy variable \`a = ${a}\`.\n2. Declare secondary reservoir variable \`b = ${b}\`.\n3. Compute \`total = a + b\` representing combined power output.\n4. Output formatted f-string \`print(f"Energy: {total}")\` to terminal.`;
      correctBlocks = [
        { code: `a = ${a}`, explanation: `Sets primary energy variable a = ${a}.` },
        { code: `b = ${b}`, explanation: `Sets secondary battery variable b = ${b}.` },
        { code: `total = a + b`, explanation: 'Adds both energy sources.' },
        { code: `print(f"Energy: {total}")`, explanation: 'Prints total energy output using Python f-string.' },
      ];
      distractorBlocks = [
        { code: `total = a - b`, explanation: 'Incorrect math formula (subtraction).' },
        { code: `total = a * b`, explanation: 'Incorrect math formula (multiplication).' },
      ];
    }

    return {
      title: `L${levelNum}-M${qNum}: Grid Energy Supply Addition (${normLang.toUpperCase()})`,
      topic: 'Variables & Arithmetic Operators',
      story: `Welcome to Sector ${levelNum}! Central Power Node requires an immediate calibration calculation. You must assemble a ${normLang.toUpperCase()} script that reads primary reactor energy units (${a}) and combines them with secondary reservoir power (${b}) to output total available power.`,
      problemStatement,
      expectedOutput: `Energy: ${total}`,
      correctBlocks,
      distractorBlocks,
    };
  }

  if (templateType === 'tax') {
    const items = ['Drone', 'GPU', 'Server', 'Quantum Chip', 'Optical Sensor'];
    const basePrice = 200 * levelNum + qNum * 50;
    const taxRate = 5 + (levelNum % 3) * 5;
    const item = pickRandom(items);
    const tax = basePrice * (taxRate / 100);
    const total = basePrice + tax;

    let correctBlocks = [];
    let distractorBlocks = [];
    let problemStatement = '';

    if (normLang === 'javascript') {
      problemStatement = `Objective: Build a JS financial invoice calculation pipeline for cargo clearance.\n1. Initialize \`let price = ${basePrice}\`.\n2. Calculate municipal tax: \`let tax = price * ${taxRate / 100}\` (${taxRate}% rate).\n3. Compute total bill: \`let total = price + tax\`.\n4. Output log: \`console.log(\`Bill: \${total}\`)\`.`;
      correctBlocks = [
        { code: `let price = ${basePrice};`, explanation: 'Initializes base price variable.' },
        { code: `let tax = price * ${taxRate / 100};`, explanation: `Computes ${taxRate}% municipal tax.` },
        { code: `let total = price + tax;`, explanation: 'Adds calculated tax to price.' },
        { code: `console.log(\`Bill: \${total}\`);`, explanation: 'Prints formatted total bill log to JS console.' },
      ];
      distractorBlocks = [
        { code: `let tax = price / ${taxRate};`, explanation: 'Incorrect tax division formula.' },
        { code: `let total = price - tax;`, explanation: 'Subtracts tax instead of adding.' },
      ];
    } else if (normLang === 'c') {
      problemStatement = `Objective: Build a C financial invoice calculation pipeline.\n1. Initialize float \`float price = ${basePrice}\`.\n2. Compute tax \`float tax = price * ${taxRate / 100}\`.\n3. Compute total \`float total = price + tax\`.\n4. Print using \`printf("Bill: %.0f\\n", total)\`.`;
      correctBlocks = [
        { code: `float price = ${basePrice};`, explanation: 'Initializes float price.' },
        { code: `float tax = price * ${taxRate / 100};`, explanation: 'Calculates float tax.' },
        { code: `float total = price + tax;`, explanation: 'Calculates total sum in C.' },
        { code: `printf("Bill: %.0f\\n", total);`, explanation: 'Prints formatted bill total using printf.' },
      ];
      distractorBlocks = [
        { code: `float tax = price / ${taxRate};`, explanation: 'Division operator error.' },
        { code: `float total = price - tax;`, explanation: 'Subtraction operator error.' },
      ];
    } else if (normLang === 'cpp') {
      problemStatement = `Objective: Build a C++ financial invoice calculation pipeline.\n1. Initialize double \`double price = ${basePrice}\`.\n2. Compute tax \`double tax = price * ${taxRate / 100}\`.\n3. Compute total \`double total = price + tax\`.\n4. Output stream \`std::cout << "Bill: " << total << std::endl\`.`;
      correctBlocks = [
        { code: `double price = ${basePrice};`, explanation: 'Initializes double price.' },
        { code: `double tax = price * ${taxRate / 100};`, explanation: 'Calculates double tax.' },
        { code: `double total = price + tax;`, explanation: 'Calculates total sum in C++.' },
        { code: `std::cout << "Bill: " << total << std::endl;`, explanation: 'Outputs bill total using std::cout.' },
      ];
      distractorBlocks = [
        { code: `double tax = price / ${taxRate};`, explanation: 'Division error.' },
        { code: `double total = price - tax;`, explanation: 'Subtraction error.' },
      ];
    } else if (normLang === 'java') {
      problemStatement = `Objective: Build a Java financial invoice calculation pipeline.\n1. Initialize \`double price = ${basePrice}\`.\n2. Compute tax \`double tax = price * ${taxRate / 100}\`.\n3. Compute total \`double total = price + tax\`.\n4. Print using \`System.out.println("Bill: " + (int)total)\`.`;
      correctBlocks = [
        { code: `double price = ${basePrice};`, explanation: 'Initializes base price double in Java.' },
        { code: `double tax = price * ${taxRate / 100};`, explanation: `Calculates ${taxRate}% tax.` },
        { code: `double total = price + tax;`, explanation: 'Adds tax to price in Java.' },
        { code: `System.out.println("Bill: " + (int)total);`, explanation: 'Prints formatted bill log using System.out.println.' },
      ];
      distractorBlocks = [
        { code: `double tax = price / ${taxRate};`, explanation: 'Division operator error.' },
        { code: `double total = price - tax;`, explanation: 'Subtraction operator error.' },
      ];
    } else {
      // Python
      problemStatement = `Objective: Build a Python financial invoice calculation pipeline for cargo clearance.\n1. Initialize \`price = ${basePrice}\`.\n2. Calculate municipal tax: \`tax = price * ${taxRate / 100}\` (${taxRate}% rate).\n3. Compute total bill: \`total = price + tax\`.\n4. Output f-string: \`print(f"Bill: {total}")\`.`;
      correctBlocks = [
        { code: `price = ${basePrice}`, explanation: 'Initializes base price.' },
        { code: `tax = price * ${taxRate / 100}`, explanation: `Calculates ${taxRate}% tax.` },
        { code: `total = price + tax`, explanation: 'Adds tax to base price.' },
        { code: `print(f"Bill: {total}")`, explanation: 'Outputs final bill total using Python f-string.' },
      ];
      distractorBlocks = [
        { code: `tax = price / ${taxRate}`, explanation: 'Division error.' },
        { code: `total = price - tax`, explanation: 'Subtraction error.' },
      ];
    }

    return {
      title: `L${levelNum}-M${qNum}: ${item} Tax Calculator (${normLang.toUpperCase()})`,
      topic: 'Percentage & Math Calculations',
      story: `Attention Officer! Sector ${levelNum} ${item} Logistics Depot requires an invoice calculation. Base price is ${basePrice} credits with a ${taxRate}% municipal surcharge. Construct a ${normLang.toUpperCase()} script to compute tax and output total bill.`,
      problemStatement,
      expectedOutput: `Bill: ${total}`,
      correctBlocks,
      distractorBlocks,
    };
  }

  if (templateType === 'conditionals') {
    const val = 50 + qNum * 15;
    const threshold = 100 + levelNum * 10;
    const status = val > threshold ? 'APPROVED' : 'REJECTED';

    let correctBlocks = [];
    let distractorBlocks = [];
    let problemStatement = '';

    if (normLang === 'javascript') {
      problemStatement = `Objective: Implement a binary decision gate algorithm in JavaScript.\n1. Set variable \`let power = ${val}\`.\n2. Evaluate condition: if \`power > ${threshold}\` is true, assign \`status = "APPROVED"\`.\n3. In the fallback else block, assign \`status = "REJECTED"\`.\n4. Output status log: \`console.log(\`Status: \${status}\`)\`.`;
      correctBlocks = [
        { code: `let power = ${val};`, explanation: 'Initializes energy reading variable.' },
        { code: `if (power > ${threshold}) {`, explanation: 'Evaluates if power exceeds safety threshold.' },
        { code: `    status = "APPROVED";`, explanation: 'Assigns APPROVED state on condition match.' },
        { code: `} else {`, explanation: 'Fallback else branch.' },
        { code: `    status = "REJECTED";`, explanation: 'Assigns REJECTED state when power is under threshold.' },
        { code: `console.log(\`Status: \${status}\`);`, explanation: 'Logs security gate status to JS console.' },
      ];
      distractorBlocks = [
        { code: `if (power == ${threshold}) {`, explanation: 'Equality operator error (matches exact equality instead of greater than).' },
        { code: `    status = "REJECTED";`, explanation: 'Reversed branch assignment.' },
      ];
    } else if (normLang === 'c') {
      problemStatement = `Objective: Implement a binary decision gate algorithm in C.\n1. Initialize integer \`int power = ${val}\`.\n2. Evaluate condition: if \`power > ${threshold}\`, assign \`char* status = "APPROVED"\`.\n3. Else branch: assign \`char* status = "REJECTED"\`.\n4. Print using \`printf("Status: %s\\n", status)\`.`;
      correctBlocks = [
        { code: `int power = ${val};`, explanation: 'Initializes integer power level in C.' },
        { code: `if (power > ${threshold}) {`, explanation: 'If statement condition check in C.' },
        { code: `    char* status = "APPROVED";`, explanation: 'Assigns string APPROVED.' },
        { code: `} else {`, explanation: 'Else branch block.' },
        { code: `    char* status = "REJECTED";`, explanation: 'Assigns string REJECTED.' },
        { code: `printf("Status: %s\\n", status);`, explanation: 'Prints string status using printf.' },
      ];
      distractorBlocks = [
        { code: `if (power == ${threshold}) {`, explanation: 'Wrong relational operator.' },
        { code: `    char* status = "REJECTED";`, explanation: 'Reversed logic assignment.' },
      ];
    } else if (normLang === 'cpp') {
      problemStatement = `Objective: Implement a binary decision gate algorithm in C++.\n1. Initialize int \`int power = ${val}\`.\n2. Evaluate condition: if \`power > ${threshold}\`, set \`std::string status = "APPROVED"\`.\n3. Else branch: set \`std::string status = "REJECTED"\`.\n4. Output stream: \`std::cout << "Status: " << status << std::endl\`.`;
      correctBlocks = [
        { code: `int power = ${val};`, explanation: 'Initializes integer power in C++.' },
        { code: `if (power > ${threshold}) {`, explanation: 'If condition check in C++.' },
        { code: `    std::string status = "APPROVED";`, explanation: 'Assigns std::string APPROVED.' },
        { code: `} else {`, explanation: 'Else branch block.' },
        { code: `    std::string status = "REJECTED";`, explanation: 'Assigns std::string REJECTED.' },
        { code: `std::cout << "Status: " << status << std::endl;`, explanation: 'Outputs status using std::cout stream.' },
      ];
      distractorBlocks = [
        { code: `if (power == ${threshold}) {`, explanation: 'Wrong relational operator.' },
        { code: `    std::string status = "REJECTED";`, explanation: 'Reversed logic.' },
      ];
    } else if (normLang === 'java') {
      problemStatement = `Objective: Implement a binary decision gate algorithm in Java.\n1. Initialize int \`int power = ${val}\`.\n2. Evaluate condition: if \`power > ${threshold}\`, set \`String status = "APPROVED"\`.\n3. Else branch: set \`String status = "REJECTED"\`.\n4. Output: \`System.out.println("Status: " + status)\`.`;
      correctBlocks = [
        { code: `int power = ${val};`, explanation: 'Initializes integer power level in Java.' },
        { code: `if (power > ${threshold}) {`, explanation: 'Evaluates power threshold condition in Java.' },
        { code: `    status = "APPROVED";`, explanation: 'Assigns String APPROVED.' },
        { code: `} else {`, explanation: 'Fallback else branch in Java.' },
        { code: `    status = "REJECTED";`, explanation: 'Assigns String REJECTED.' },
        { code: `System.out.println("Status: " + status);`, explanation: 'Prints security gate status using System.out.println.' },
      ];
      distractorBlocks = [
        { code: `if (power == ${threshold}) {`, explanation: 'Wrong relational operator.' },
        { code: `    status = "REJECTED";`, explanation: 'Reversed logic assignment.' },
      ];
    } else {
      // Python
      problemStatement = `Objective: Implement a binary decision gate algorithm in Python 3.\n1. Set variable \`power = ${val}\`.\n2. Evaluate condition: if \`power > ${threshold}\`, assign \`status = "APPROVED"\`.\n3. In the else block, assign \`status = "REJECTED"\`.\n4. Output f-string: \`print(f"Status: {status}")\`.`;
      correctBlocks = [
        { code: `power = ${val}`, explanation: 'Initializes energy reading variable.' },
        { code: `if power > ${threshold}:`, explanation: 'Evaluates if power exceeds safety threshold.' },
        { code: `    status = "APPROVED"`, explanation: 'Assigns APPROVED state.' },
        { code: `else:`, explanation: 'Fallback else branch.' },
        { code: `    status = "REJECTED"`, explanation: 'Assigns REJECTED state.' },
        { code: `print(f"Status: {status}")`, explanation: 'Prints security gate status using Python f-string.' },
      ];
      distractorBlocks = [
        { code: `if power == ${threshold}:`, explanation: 'Equality error.' },
        { code: `    status = "REJECTED"`, explanation: 'Reversed logic.' },
      ];
    }

    return {
      title: `L${levelNum}-M${qNum}: Cyber Gate Security Check (${normLang.toUpperCase()})`,
      topic: 'If-Else Decision Branches & Relational Operators',
      story: `Security Alert! Sector ${levelNum} Automated Cyber Gate is reading vehicle power level ${val} against safety threshold ${threshold}. Construct a ${normLang.toUpperCase()} conditional decision script to grant or deny passage.`,
      problemStatement,
      expectedOutput: `Status: ${status}`,
      correctBlocks,
      distractorBlocks,
    };
  }

  if (templateType === 'loops') {
    const mult = 2 + (qNum % 4);
    const limit = 8 + levelNum * 2;
    const matches = [];
    for (let i = 1; i <= limit; i++) {
      if (i % mult === 0) matches.push(i);
    }
    const expectedOutput = matches.join(' ');

    let correctBlocks = [];
    let distractorBlocks = [];
    let problemStatement = '';

    if (normLang === 'javascript') {
      problemStatement = `Objective: Construct an iterative sequence scanner with modulo filtering in JS.\n1. Loop counter \`for (let i = 1; i <= ${limit}; i++)\`.\n2. Filter condition: \`if (i % ${mult} === 0)\` checking exact divisibility by ${mult}.\n3. Output matching multiples separated by space: \`process.stdout.write(i + " ")\`.`;
      correctBlocks = [
        { code: `for (let i = 1; i <= ${limit}; i++) {`, explanation: `Iterates counter i from 1 to ${limit}.` },
        { code: `    if (i % ${mult} === 0) {`, explanation: `Checks if counter is divisible by ${mult}.` },
        { code: `        process.stdout.write(i + " ");`, explanation: 'Prints matching number followed by space in JS.' },
      ];
      distractorBlocks = [
        { code: `for (let i = 1; i < ${limit}; i++) {`, explanation: 'Loop terminates one step before limit!' },
        { code: `    if (i % ${mult} !== 0) {`, explanation: 'Filters non-multiples instead of multiples!' },
      ];
    } else if (normLang === 'c') {
      problemStatement = `Objective: Construct an iterative sequence scanner with modulo filtering in C.\n1. Loop counter \`for (int i = 1; i <= ${limit}; i++)\`.\n2. Filter condition: \`if (i % ${mult} == 0)\`.\n3. Output formatted printf: \`printf("%d ", i)\`.`;
      correctBlocks = [
        { code: `for (int i = 1; i <= ${limit}; i++) {`, explanation: `C loop iterating from 1 to ${limit}.` },
        { code: `    if (i % ${mult} == 0) {`, explanation: 'Modulo divisibility check.' },
        { code: `        printf("%d ", i);`, explanation: 'Prints matching integer with trailing space.' },
      ];
      distractorBlocks = [
        { code: `for (int i = 1; i < ${limit}; i++) {`, explanation: 'Off-by-one loop error.' },
        { code: `    if (i % ${mult} != 0) {`, explanation: 'Inverse condition error.' },
      ];
    } else if (normLang === 'cpp') {
      problemStatement = `Objective: Construct an iterative sequence scanner with modulo filtering in C++.\n1. Loop counter \`for (int i = 1; i <= ${limit}; ++i)\`.\n2. Filter condition: \`if (i % ${mult} == 0)\`.\n3. Output stream: \`std::cout << i << " "\`.`;
      correctBlocks = [
        { code: `for (int i = 1; i <= ${limit}; ++i) {`, explanation: `C++ loop from 1 to ${limit}.` },
        { code: `    if (i % ${mult} == 0) {`, explanation: 'Modulo check in C++.' },
        { code: `        std::cout << i << " ";`, explanation: 'Outputs integer with space using std::cout.' },
      ];
      distractorBlocks = [
        { code: `for (int i = 1; i < ${limit}; ++i) {`, explanation: 'Off-by-one loop error.' },
        { code: `    if (i % ${mult} != 0) {`, explanation: 'Inverse condition error.' },
      ];
    } else if (normLang === 'java') {
      problemStatement = `Objective: Construct an iterative sequence scanner with modulo filtering in Java.\n1. Loop counter \`for (int i = 1; i <= ${limit}; i++)\`.\n2. Filter condition: \`if (i % ${mult} == 0)\`.\n3. Output System.out: \`System.out.print(i + " ")\`.`;
      correctBlocks = [
        { code: `for (int i = 1; i <= ${limit}; i++) {`, explanation: `Java for loop iterating from 1 to ${limit}.` },
        { code: `    if (i % ${mult} == 0) {`, explanation: 'Checks modulo divisibility in Java.' },
        { code: `        System.out.print(i + " ");`, explanation: 'Prints matching integer with space using System.out.print.' },
      ];
      distractorBlocks = [
        { code: `for (int i = 1; i < ${limit}; i++) {`, explanation: 'Off-by-one loop limit error.' },
        { code: `    if (i % ${mult} != 0) {`, explanation: 'Inverse condition error.' },
      ];
    } else {
      // Python
      problemStatement = `Objective: Construct an iterative sequence scanner with modulo filtering in Python.\n1. Loop counter \`for i in range(1, ${limit + 1})\`.\n2. Filter condition: \`if i % ${mult} == 0\`.\n3. Output print: \`print(i, end=" ")\`.`;
      correctBlocks = [
        { code: `for i in range(1, ${limit + 1}):`, explanation: `Python range loop iterating 1 to ${limit}.` },
        { code: `    if i % ${mult} == 0:`, explanation: 'Modulo divisibility check.' },
        { code: `        print(i, end=" ")`, explanation: 'Prints matched number with trailing space.' },
      ];
      distractorBlocks = [
        { code: `for i in range(1, ${limit}):`, explanation: 'Off-by-one range error.' },
        { code: `    if i % ${mult} != 0:`, explanation: 'Inverse condition error.' },
      ];
    }

    return {
      title: `L${levelNum}-M${qNum}: Multiples of ${mult} Scanner (${normLang.toUpperCase()})`,
      topic: 'For Loops & Modulo Operator (%)',
      story: `Data Packet Scan! Sector ${levelNum} Router needs to index specific data frames. Write an iteration loop in ${normLang.toUpperCase()} scanning range 1 to ${limit} and outputting multiples of ${mult}.`,
      problemStatement,
      expectedOutput,
      correctBlocks,
      distractorBlocks,
    };
  }

  // Squares / Array transformation template
  const n = 3 + (qNum % 4);
  const squares = Array.from({ length: n }, (_, i) => (i + 1) ** 2);
  const expectedOutput = `Squares: ${JSON.stringify(squares)}`;

  let correctBlocks = [];
  let distractorBlocks = [];
  let problemStatement = '';

  if (normLang === 'javascript') {
    problemStatement = `Objective: Assemble an array sequence generator and map transformation in JS.\n1. Create input array \`const nums = [${Array.from({ length: n }, (_, i) => i + 1).join(', ')}]\`.\n2. Transform elements using map: \`const sq = nums.map(x => x ** 2)\`.\n3. Output formatted log: \`console.log(\`Squares: [\${sq.join(', ')}]\`)\`.`;
    correctBlocks = [
      { code: `const nums = [${Array.from({ length: n }, (_, i) => i + 1).join(', ')}];`, explanation: 'Initializes input sequence array.' },
      { code: `const sq = nums.map(x => x ** 2);`, explanation: 'Maps each element to its squared value.' },
      { code: `console.log(\`Squares: [\${sq.join(', ')}]\`);`, explanation: 'Outputs formatted array log in JS.' },
    ];
    distractorBlocks = [
      { code: `const sq = nums.map(x => x * 2);`, explanation: 'Multiplication error: multiplies by 2 instead of squaring.' },
    ];
  } else if (normLang === 'c') {
    problemStatement = `Objective: Assemble an array sequence generator and loop transformation in C.\n1. Create input array \`int nums[] = {${Array.from({ length: n }, (_, i) => i + 1).join(', ')}}\`.\n2. Compute squared elements into \`int sq[${n}]\`.\n3. Print using \`printf("Squares: [${squares.join(', ')}]\\n")\`.`;
    correctBlocks = [
      { code: `int nums[] = {${Array.from({ length: n }, (_, i) => i + 1).join(', ')}};`, explanation: 'Initializes integer array in C.' },
      { code: `int sq[${n}]; for(int i=0; i<${n}; i++) sq[i] = nums[i]*nums[i];`, explanation: 'Fills squared array elements.' },
      { code: `printf("Squares: [${squares.join(', ')}]\\n");`, explanation: 'Outputs array result using printf.' },
    ];
    distractorBlocks = [
      { code: `int sq[${n}]; for(int i=0; i<${n}; i++) sq[i] = nums[i]+2;`, explanation: 'Addition operator error.' },
    ];
  } else if (normLang === 'cpp') {
    problemStatement = `Objective: Assemble a vector sequence generator and transformation pipeline in C++.\n1. Initialize \`std::vector<int> nums = {${Array.from({ length: n }, (_, i) => i + 1).join(', ')}}\`.\n2. Populate squared values: \`std::vector<int> sq; for(int x : nums) sq.push_back(x * x)\`.\n3. Output stream: \`std::cout << "Squares: [${squares.join(', ')}]" << std::endl\`.`;
    correctBlocks = [
      { code: `std::vector<int> nums = {${Array.from({ length: n }, (_, i) => i + 1).join(', ')}};`, explanation: 'Initializes C++ std::vector.' },
      { code: `std::vector<int> sq; for(int x : nums) sq.push_back(x * x);`, explanation: 'Pushes squared values to vector.' },
      { code: `std::cout << "Squares: [${squares.join(', ')}]" << std::endl;`, explanation: 'Outputs vector using std::cout.' },
    ];
    distractorBlocks = [
      { code: `std::vector<int> sq; for(int x : nums) sq.push_back(x + 2);`, explanation: 'Addition error.' },
    ];
  } else if (normLang === 'java') {
    problemStatement = `Objective: Assemble an array sequence generator and transformation loop in Java.\n1. Initialize \`int[] nums = {${Array.from({ length: n }, (_, i) => i + 1).join(', ')}}\`.\n2. Compute squared elements: \`int[] sq = new int[${n}]; for(int i=0; i<${n}; i++) sq[i] = nums[i]*nums[i]\`.\n3. Output log: \`System.out.println("Squares: " + Arrays.toString(sq))\`.`;
    correctBlocks = [
      { code: `int[] nums = {${Array.from({ length: n }, (_, i) => i + 1).join(', ')}};`, explanation: 'Initializes integer array in Java.' },
      { code: `int[] sq = new int[${n}]; for(int i=0; i<${n}; i++) sq[i] = nums[i]*nums[i];`, explanation: 'Fills squared array elements.' },
      { code: `System.out.println("Squares: " + Arrays.toString(sq));`, explanation: 'Prints array using System.out.println & Arrays.toString.' },
    ];
    distractorBlocks = [
      { code: `int[] sq = new int[${n}]; for(int i=0; i<${n}; i++) sq[i] = nums[i]+2;`, explanation: 'Addition operator error.' },
    ];
  } else {
    // Python
    problemStatement = `Objective: Assemble a list sequence generator and list comprehension in Python.\n1. Create input sequence \`nums = list(range(1, ${n + 1}))\`.\n2. Compute list comprehension: \`sq = [x**2 for x in nums]\`.\n3. Output f-string: \`print(f"Squares: {sq}")\`.`;
    correctBlocks = [
      { code: `nums = list(range(1, ${n + 1}))`, explanation: 'Creates number list sequence.' },
      { code: `sq = [x**2 for x in nums]`, explanation: 'Computes list comprehension of squared values.' },
      { code: `print(f"Squares: {sq}")`, explanation: 'Outputs resulting list using Python f-string.' },
    ];
    distractorBlocks = [
      { code: `sq = [x*2 for x in nums]`, explanation: 'Multiplies by 2 instead of squaring.' },
    ];
  }

  return {
    title: `L${levelNum}-M${qNum}: Quantum Array Squares (${normLang.toUpperCase()})`,
    topic: 'Arrays & Sequence Transformations',
    story: `Radar Array Calibration! Sector ${levelNum} sub-station requires a data array of squared frequencies. Construct a ${normLang.toUpperCase()} transformation script to compute squares of sequence 1 to ${n}.`,
    problemStatement,
    expectedOutput: `Squares: ${JSON.stringify(squares)}`,
    correctBlocks,
    distractorBlocks,
  };
}

// ── Master 20-Question Level Generator ────────────────────────────────────
export function generateLevelQuests(levelNum = 1, language = 'python') {
  const safeLvl = Math.max(1, parseInt(levelNum, 10) || 1);

  const quests = [];

  for (let qIdx = 1; qIdx <= 20; qIdx++) {
    // Select template based on question progression (1 to 20)
    const type = TEMPLATE_TYPES[(qIdx - 1) % TEMPLATE_TYPES.length];
    const raw = getSyntaxBlocks(type, safeLvl, qIdx, language);

    const allRawBlocks = [
      ...raw.correctBlocks.map((b, i) => ({ ...b, id: `l${levelNum}_q${qIdx}_c_${i}`, isCorrect: true })),
      ...raw.distractorBlocks.map((b, i) => ({ ...b, id: `l${levelNum}_q${qIdx}_w_${i}`, isCorrect: false })),
    ];

    const shuffledLocations = shuffle(MAP_LOCATIONS);
    const destinations = allRawBlocks.map((block, idx) => {
      const loc = shuffledLocations[idx % shuffledLocations.length];
      return {
        id: block.id,
        name: loc.name,
        category: loc.category,
        x: loc.x,
        y: loc.y,
        code: block.code,
        explanation: block.explanation,
        isCorrect: block.isCorrect,
      };
    });

    const solutionSequence = allRawBlocks.filter(b => b.isCorrect).map(b => b.id);

    quests.push({
      id: `quest_l${levelNum}_q${qIdx}_${Date.now()}`,
      missionNumber: qIdx,
      levelNumber: levelNum,
      title: raw.title,
      topic: raw.topic,
      story: raw.story,
      problemStatement: raw.problemStatement,
      expectedOutput: raw.expectedOutput,
      solutionSequence,
      destinations,
    });
  }

  return quests;
}

// Default fallback list
export const QUESTS = generateLevelQuests(1, 'python');

export function evaluateSolution(quest, assembledBlocks, language = 'python') {
  if (!quest || !Array.isArray(quest.solutionSequence)) {
    return { success: false, output: 'INVALID QUEST DATA', logs: ['⚠️ Quest configuration missing or corrupted.'] };
  }

  if (!assembledBlocks || assembledBlocks.length === 0) {
    return { success: false, output: 'No code blocks collected yet!', logs: ['Your deck is empty. Drive to destinations and click 📥 Collect to gather code blocks.'] };
  }

  const userSeq = (assembledBlocks || []).map(b => b?.id);
  const targetSeq = quest.solutionSequence || [];
  const langName = (language || 'python').toUpperCase();

  const isExactMatch = userSeq.length === targetSeq.length && userSeq.every((id, idx) => id === targetSeq[idx]);

  if (isExactMatch) {
    return {
      success: true,
      output: quest.expectedOutput || 'SUCCESS',
      logs: [
        `>>> Executing ${langName} script...`,
        ...((assembledBlocks || []).map(b => b?.code || '')),
        `>>> SUCCESS: Output matches expected: "${quest.expectedOutput || 'SUCCESS'}"`
      ]
    };
  }

  const hasWrongBlock = (assembledBlocks || []).some(b => !b?.isCorrect);
  const missingBlocks = targetSeq.filter(id => !userSeq.includes(id));

  let hint = '';
  if (hasWrongBlock) {
    hint = '⚠️ You have collected incorrect/distractor code blocks in your deck. Check your logic and drop bad blocks!';
  } else if (missingBlocks.length > 0) {
    hint = `⚠️ Missing ${missingBlocks.length} essential block(s). Keep exploring the city!`;
  } else if (userSeq.length !== targetSeq.length) {
    hint = '⚠️ Block count mismatch. Check for duplicate or extra blocks.';
  } else {
    hint = '⚠️ Code order is incorrect! Try reordering the blocks in your deck.';
  }

  return {
    success: false,
    output: 'EXECUTION FAILED / MISMATCH',
    logs: [
      `>>> Executing ${langName} script...`,
      ...((assembledBlocks || []).map(b => b?.code || '')),
      `>>> ERROR: Program output did not match "${quest.expectedOutput || ''}"`,
      hint
    ]
  };
}



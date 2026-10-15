module.exports = {
  1: [
    `let x = 5;\nlet y = 10;\nconsole.log(x + y);`,
    `const name = "world";\nconsole.log("hello " + name);`,
    `let total = 0;\nfor (let i = 0; i < 5; i++) {\n  total += i;\n}\nconsole.log(total);`,
    `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));`,
    `const numbers = [1, 2, 3, 4];\nconsole.log(numbers.length);`
  ],
  2: [
    `function greet(name) {\n  if (name === "") {\n    return "Hello, stranger!";\n  }\n  return \`Hello, \${name}!\`;\n}\nconsole.log(greet("Alice"));`,
    `const isEven = (n) => n % 2 === 0;\n\nfor (let i = 0; i < 10; i++) {\n  if (isEven(i)) console.log(i);\n}`,
    `function factorial(n) {\n  let result = 1;\n  for (let i = 1; i <= n; i++) {\n    result *= i;\n  }\n  return result;\n}\nconsole.log(factorial(6));`,
    `const students = { Alice: 90, Bob: 82, Cara: 76 };\nfor (const [name, score] of Object.entries(students)) {\n  console.log(\`\${name}: \${score}\`);\n}`,
    `function findMax(nums) {\n  let maxVal = nums[0];\n  for (const n of nums.slice(1)) {\n    if (n > maxVal) maxVal = n;\n  }\n  return maxVal;\n}`
  ],
  3: [
    `class Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n\n  area() {\n    return this.width * this.height;\n  }\n}\n\nconst r = new Rectangle(4, 5);\nconsole.log(r.area());`,
    `function fibonacci(n) {\n  let [a, b] = [0, 1];\n  const result = [];\n  while (result.length < n) {\n    result.push(a);\n    [a, b] = [b, a + b];\n  }\n  return result;\n}\nconsole.log(fibonacci(10));`,
    `const squares = Array.from({ length: 10 }, (_, x) => x)\n  .filter((x) => x % 2 === 0)\n  .map((x) => x ** 2);\nconsole.log(squares);`,
    `try {\n  const value = Number(prompt("Enter a number:"));\n  if (value === 0) throw new Error("Cannot divide by zero!");\n  console.log(100 / value);\n} catch (err) {\n  console.error(err.message);\n}`,
    `function mergeObjects(a, b) {\n  return { ...a, ...b };\n}\nconsole.log(mergeObjects({ x: 1 }, { y: 2 }));`
  ],
  4: [
    `function timer(fn) {\n  return function (...args) {\n    const start = performance.now();\n    const result = fn(...args);\n    console.log(\`\${fn.name} took \${(performance.now() - start).toFixed(2)}ms\`);\n    return result;\n  };\n}\n\nconst slowAdd = timer((a, b) => a + b);`,
    `const pattern = /^(\\w+)@(\\w+)\\.(com|org|net)$/;\nconst emails = ["a@b.com", "bad-email", "x@y.org"];\nconst valid = emails.filter((e) => pattern.test(e));\nconsole.log(valid);`,
    `class Stack {\n  #items = [];\n\n  push(item) {\n    this.#items.push(item);\n  }\n\n  pop() {\n    return this.#items.length ? this.#items.pop() : null;\n  }\n\n  toString() {\n    return \`Stack(\${JSON.stringify(this.#items)})\`;\n  }\n}`,
    `const data = { users: [{ id: 1, tags: ["a", "b"] }, { id: 2, tags: [] }] };\nconst result = Object.fromEntries(\n  data.users.filter((u) => u.tags.length).map((u) => [u.id, u.tags.length])\n);\nconsole.log(result);`,
    `function quicksort(arr) {\n  if (arr.length <= 1) return arr;\n  const [pivot, ...rest] = arr;\n  const left = rest.filter((x) => x < pivot);\n  const right = rest.filter((x) => x >= pivot);\n  return [...quicksort(left), pivot, ...quicksort(right)];\n}`
  ],
  5: [
    `class Node {\n  constructor(value, next = null) {\n    this.value = value;\n    this.next = next;\n  }\n\n  *[Symbol.iterator]() {\n    let node = this;\n    while (node !== null) {\n      yield node.value;\n      node = node.next;\n    }\n  }\n}\n\nconst filterFn = (x) => x % 2 === 0;`,
    `async function fetchData(url, { retries = 3 } = {}) {\n  for (let attempt = 0; attempt < retries; attempt++) {\n    try {\n      await new Promise((res) => setTimeout(res, 100));\n      return { url, status: 200 };\n    } catch (e) {\n      if (attempt === retries - 1) throw e;\n    }\n  }\n}\n\nconst results = await Promise.all([1, 2, 3].map((i) => fetchData(\`/api/\${i}\`)));`,
    `class Matrix {\n  constructor(rows) {\n    this.rows = rows;\n  }\n\n  multiply(other) {\n    const cols = other.rows[0].map((_, i) => other.rows.map((r) => r[i]));\n    return new Matrix(\n      this.rows.map((row) => cols.map((col) => row.reduce((sum, v, i) => sum + v * col[i], 0)))\n    );\n  }\n}`,
    `function tokenize(text) {\n  const counts = new Map();\n  const tokens = text.match(/[A-Za-z_]\\w*|[^\\sA-Za-z_]/g) ?? [];\n  for (const t of tokens) {\n    counts.set(t, (counts.get(t) ?? 0) + 1);\n  }\n  return [...counts.entries()].sort((a, b) => b[1] - a[1]);\n}`,
    `function memoize(fn) {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (!cache.has(key)) cache.set(key, fn(...args));\n    return cache.get(key);\n  };\n}\n\nconst nth = memoize((n) => (n < 2 ? n : nth(n - 1) + nth(n - 2)));`
  ]
};

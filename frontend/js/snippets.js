/* =========================================================
   CODE TYPE — local fallback snippet bank
   Used automatically if the backend API cannot be reached,
   so the app is fully functional even standalone (offline).
   Mirrors the structure of backend/data/*.js (a smaller subset).
   ========================================================= */

window.CodeTypeFallbackSnippets = {
  python: {
    1: [
      `x = 5\ny = 10\nprint(x + y)`,
      `name = "world"\nprint("hello " + name)`,
      `numbers = [1, 2, 3, 4]\nprint(len(numbers))`
    ],
    2: [
      `def greet(name):\n    if name == "":\n        return "Hello, stranger!"\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))`,
      `def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\nprint(factorial(6))`
    ],
    3: [
      `class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\nr = Rectangle(4, 5)\nprint(r.area())`,
      `squares = [x ** 2 for x in range(10) if x % 2 == 0]\nprint(squares)`
    ],
    4: [
      `import re\n\npattern = r"^(\\w+)@(\\w+)\\.(com|org|net)$"\nemails = ["a@b.com", "bad-email", "x@y.org"]\nvalid = [e for e in emails if re.match(pattern, e)]\nprint(valid)`,
      `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + mid + quicksort(right)`
    ],
    5: [
      `from dataclasses import dataclass, field\nfrom typing import Optional\n\n@dataclass\nclass Node:\n    value: int\n    next: Optional["Node"] = field(default=None, repr=False)\n\n    def __iter__(self):\n        node = self\n        while node is not None:\n            yield node.value\n            node = node.next`,
      `def memoize(fn):\n    cache = {}\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = fn(*args)\n        return cache[args]\n    return wrapper\n\n@memoize\ndef nth(n):\n    return n if n < 2 else nth(n - 1) + nth(n - 2)`
    ]
  },
  javascript: {
    1: [
      `let x = 5;\nlet y = 10;\nconsole.log(x + y);`,
      `const numbers = [1, 2, 3, 4];\nconsole.log(numbers.length);`
    ],
    2: [
      `function greet(name) {\n  if (name === "") {\n    return "Hello, stranger!";\n  }\n  return \`Hello, \${name}!\`;\n}\nconsole.log(greet("Alice"));`,
      `function factorial(n) {\n  let result = 1;\n  for (let i = 1; i <= n; i++) {\n    result *= i;\n  }\n  return result;\n}`
    ],
    3: [
      `class Rectangle {\n  constructor(width, height) {\n    this.width = width;\n    this.height = height;\n  }\n\n  area() {\n    return this.width * this.height;\n  }\n}`,
      `const squares = Array.from({ length: 10 }, (_, x) => x)\n  .filter((x) => x % 2 === 0)\n  .map((x) => x ** 2);`
    ],
    4: [
      `const pattern = /^(\\w+)@(\\w+)\\.(com|org|net)$/;\nconst emails = ["a@b.com", "bad-email", "x@y.org"];\nconst valid = emails.filter((e) => pattern.test(e));`,
      `function quicksort(arr) {\n  if (arr.length <= 1) return arr;\n  const [pivot, ...rest] = arr;\n  const left = rest.filter((x) => x < pivot);\n  const right = rest.filter((x) => x >= pivot);\n  return [...quicksort(left), pivot, ...quicksort(right)];\n}`
    ],
    5: [
      `async function fetchData(url, { retries = 3 } = {}) {\n  for (let attempt = 0; attempt < retries; attempt++) {\n    try {\n      await new Promise((res) => setTimeout(res, 100));\n      return { url, status: 200 };\n    } catch (e) {\n      if (attempt === retries - 1) throw e;\n    }\n  }\n}`,
      `function memoize(fn) {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (!cache.has(key)) cache.set(key, fn(...args));\n    return cache.get(key);\n  };\n}`
    ]
  },
  c: {
    1: [
      `int x = 5;\nint y = 10;\nprintf("%d\\n", x + y);`,
      `int numbers[4] = {1, 2, 3, 4};\nprintf("%d\\n", numbers[0]);`
    ],
    2: [
      `int is_even(int n) {\n    return n % 2 == 0;\n}\n\nint main() {\n    for (int i = 0; i < 10; i++) {\n        if (is_even(i)) printf("%d\\n", i);\n    }\n    return 0;\n}`,
      `long factorial(int n) {\n    long result = 1;\n    for (int i = 1; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}`
    ],
    3: [
      `struct Rectangle {\n    int width;\n    int height;\n};\n\nint area(struct Rectangle r) {\n    return r.width * r.height;\n}`,
      `void bubble_sort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int tmp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = tmp;\n            }\n        }\n    }\n}`
    ],
    4: [
      `typedef struct Node {\n    int value;\n    struct Node *next;\n} Node;\n\nNode *push(Node *head, int value) {\n    Node *n = (Node *)malloc(sizeof(Node));\n    n->value = value;\n    n->next = head;\n    return n;\n}`,
      `int binary_search(const int *arr, int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}`
    ],
    5: [
      `#define MAX(a, b) ((a) > (b) ? (a) : (b))\n#define SWAP(T, a, b) do { T tmp = (a); (a) = (b); (b) = tmp; } while (0)\n\nvoid quicksort(int *arr, int lo, int hi) {\n    if (lo >= hi) return;\n    int pivot = arr[hi], i = lo - 1;\n    for (int j = lo; j < hi; j++) {\n        if (arr[j] < pivot) { i++; SWAP(int, arr[i], arr[j]); }\n    }\n    SWAP(int, arr[i + 1], arr[hi]);\n    quicksort(arr, lo, i);\n    quicksort(arr, i + 2, hi);\n}`,
      `typedef int (*Operation)(int, int);\n\nint apply(Operation op, int a, int b) {\n    return op(a, b);\n}`
    ]
  },
  cpp: {
    1: [
      `int x = 5;\nint y = 10;\nstd::cout << x + y << std::endl;`,
      `std::vector<int> numbers = {1, 2, 3, 4};\nstd::cout << numbers.size() << std::endl;`
    ],
    2: [
      `bool isEven(int n) {\n    return n % 2 == 0;\n}\n\nfor (int i = 0; i < 10; i++) {\n    if (isEven(i)) std::cout << i << "\\n";\n}`,
      `long factorial(int n) {\n    long result = 1;\n    for (int i = 1; i <= n; i++) result *= i;\n    return result;\n}`
    ],
    3: [
      `class Rectangle {\npublic:\n    Rectangle(int w, int h) : width(w), height(h) {}\n    int area() const { return width * height; }\n\nprivate:\n    int width, height;\n};`,
      `template <typename T>\nT maxOf(T a, T b) {\n    return (a > b) ? a : b;\n}`
    ],
    4: [
      `class Stack {\npublic:\n    void push(int item) { items.push_back(item); }\n    std::optional<int> pop() {\n        if (items.empty()) return std::nullopt;\n        int val = items.back();\n        items.pop_back();\n        return val;\n    }\n\nprivate:\n    std::vector<int> items;\n};`,
      `void quicksort(std::vector<int>& arr, int lo, int hi) {\n    if (lo >= hi) return;\n    int pivot = arr[hi], i = lo - 1;\n    for (int j = lo; j < hi; j++) {\n        if (arr[j] < pivot) std::swap(arr[++i], arr[j]);\n    }\n    std::swap(arr[i + 1], arr[hi]);\n    quicksort(arr, lo, i);\n    quicksort(arr, i + 2, hi);\n}`
    ],
    5: [
      `template <typename T>\nclass Vector3 {\npublic:\n    T x, y, z;\n\n    Vector3 operator+(const Vector3& other) const {\n        return {x + other.x, y + other.y, z + other.z};\n    }\n};`,
      `template <typename Func>\nauto memoize(Func fn) {\n    return [fn, cache = std::map<int, int>{}](int n) mutable -> int {\n        auto it = cache.find(n);\n        if (it != cache.end()) return it->second;\n        return cache[n] = fn(n);\n    };\n}`
    ]
  },
  java: {
    1: [
      `int x = 5;\nint y = 10;\nSystem.out.println(x + y);`,
      `int[] numbers = {1, 2, 3, 4};\nSystem.out.println(numbers.length);`
    ],
    2: [
      `public static boolean isEven(int n) {\n    return n % 2 == 0;\n}\n\nfor (int i = 0; i < 10; i++) {\n    if (isEven(i)) System.out.println(i);\n}`,
      `public static long factorial(int n) {\n    long result = 1;\n    for (int i = 1; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}`
    ],
    3: [
      `class Rectangle {\n    private int width, height;\n\n    public Rectangle(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    public int area() {\n        return width * height;\n    }\n}`,
      `interface Shape {\n    double area();\n}\n\nclass Circle implements Shape {\n    private double radius;\n\n    public Circle(double radius) {\n        this.radius = radius;\n    }\n\n    public double area() {\n        return Math.PI * radius * radius;\n    }\n}`
    ],
    4: [
      `@FunctionalInterface\ninterface Operation {\n    int apply(int a, int b);\n}\n\npublic static int compute(Operation op, int a, int b) {\n    return op.apply(a, b);\n}`,
      `abstract class Animal {\n    protected String name;\n\n    Animal(String name) {\n        this.name = name;\n    }\n\n    abstract String speak();\n}`
    ],
    5: [
      `record Point(double x, double y) {\n    double distanceTo(Point other) {\n        return Math.sqrt(Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2));\n    }\n}`,
      `public static <T> Function<T, T> memoize(Function<T, T> fn) {\n    Map<T, T> cache = new ConcurrentHashMap<>();\n    return input -> cache.computeIfAbsent(input, fn);\n}`
    ]
  }
};

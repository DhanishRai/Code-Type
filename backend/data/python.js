// Python snippets, grouped by difficulty (1 = easiest, 5 = hardest)
// Difficulty rises through: line length, nesting, operators, symbols,
// comprehensions, decorators, type hints, regex, f-strings, lambdas.

module.exports = {
  1: [
    `x = 5\ny = 10\nprint(x + y)`,
    `name = "world"\nprint("hello " + name)`,
    `total = 0\nfor i in range(5):\n    total = total + i\nprint(total)`,
    `def add(a, b):\n    return a + b\n\nprint(add(2, 3))`,
    `numbers = [1, 2, 3, 4]\nprint(len(numbers))`
  ],
  2: [
    `def greet(name):\n    if name == "":\n        return "Hello, stranger!"\n    return f"Hello, {name}!"\n\nprint(greet("Alice"))`,
    `def is_even(n):\n    return n % 2 == 0\n\nfor i in range(10):\n    if is_even(i):\n        print(i)`,
    `def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\nprint(factorial(6))`,
    `students = {"Alice": 90, "Bob": 82, "Cara": 76}\nfor name, score in students.items():\n    print(f"{name}: {score}")`,
    `def find_max(nums):\n    max_val = nums[0]\n    for n in nums[1:]:\n        if n > max_val:\n            max_val = n\n    return max_val`
  ],
  3: [
    `class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\nr = Rectangle(4, 5)\nprint(r.area())`,
    `def fibonacci(n):\n    a, b = 0, 1\n    result = []\n    while len(result) < n:\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint(fibonacci(10))`,
    `squares = [x ** 2 for x in range(10) if x % 2 == 0]\nprint(squares)`,
    `try:\n    value = int(input("Enter a number: "))\n    print(100 / value)\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")\nexcept ValueError:\n    print("Invalid input!")`,
    `def merge_dicts(a: dict, b: dict) -> dict:\n    merged = {**a, **b}\n    return merged\n\nprint(merge_dicts({"x": 1}, {"y": 2}))`
  ],
  4: [
    `from functools import wraps\n\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        import time\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f"{func.__name__} took {time.time() - start:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow_add(a, b):\n    return a + b`,
    `import re\n\npattern = r"^(\\w+)@(\\w+)\\.(com|org|net)$"\nemails = ["a@b.com", "bad-email", "x@y.org"]\nvalid = [e for e in emails if re.match(pattern, e)]\nprint(valid)`,
    `class Stack:\n    def __init__(self):\n        self._items: list = []\n\n    def push(self, item) -> None:\n        self._items.append(item)\n\n    def pop(self):\n        return self._items.pop() if self._items else None\n\n    def __repr__(self):\n        return f"Stack({self._items!r})"`,
    `data = {"users": [{"id": 1, "tags": ["a", "b"]}, {"id": 2, "tags": []}]}\nresult = {u["id"]: len(u["tags"]) for u in data["users"] if u["tags"]}\nprint(result)`,
    `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + mid + quicksort(right)`
  ],
  5: [
    `from dataclasses import dataclass, field\nfrom typing import Optional, Callable\n\n@dataclass\nclass Node:\n    value: int\n    next: Optional["Node"] = field(default=None, repr=False)\n\n    def __iter__(self):\n        node: Optional["Node"] = self\n        while node is not None:\n            yield node.value\n            node = node.next\n\nfilter_fn: Callable[[int], bool] = lambda x: x % 2 == 0`,
    `import asyncio\n\nasync def fetch(url: str, *, retries: int = 3) -> dict:\n    for attempt in range(retries):\n        try:\n            await asyncio.sleep(0.1)\n            return {"url": url, "status": 200}\n        except Exception as e:\n            if attempt == retries - 1:\n                raise\n    return {}\n\nresults = asyncio.gather(*(fetch(f"/api/{i}") for i in range(3)))`,
    `class Matrix:\n    def __init__(self, rows: list[list[float]]):\n        self.rows = rows\n\n    def __matmul__(self, other: "Matrix") -> "Matrix":\n        result = [[sum(a * b for a, b in zip(row, col))\n                   for col in zip(*other.rows)] for row in self.rows]\n        return Matrix(result)\n\n    def __repr__(self) -> str:\n        return f"Matrix({self.rows!r})"`,
    `import re\nfrom collections import defaultdict\n\ndef tokenize(text: str) -> dict[str, int]:\n    counts: dict[str, int] = defaultdict(int)\n    for token in re.findall(r"[A-Za-z_]\\w*|[^\\sA-Za-z_]", text):\n        counts[token] += 1\n    return dict(sorted(counts.items(), key=lambda kv: -kv[1]))`,
    `def memoize(fn):\n    cache: dict = {}\n    def wrapper(*args):\n        key = args\n        if key not in cache:\n            cache[key] = fn(*args)\n        return cache[key]\n    wrapper.__dict__["cache_info"] = lambda: f"{len(cache)} entries"\n    return wrapper\n\n@memoize\ndef nth(n: int) -> int:\n    return n if n < 2 else nth(n - 1) + nth(n - 2)`
  ]
};

module.exports = {
  1: [
    `int x = 5;\nint y = 10;\nstd::cout << x + y << std::endl;`,
    `std::string name = "world";\nstd::cout << "hello " << name << std::endl;`,
    `int total = 0;\nfor (int i = 0; i < 5; i++) {\n    total += i;\n}\nstd::cout << total << std::endl;`,
    `int add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    std::cout << add(2, 3) << std::endl;\n}`,
    `std::vector<int> numbers = {1, 2, 3, 4};\nstd::cout << numbers.size() << std::endl;`
  ],
  2: [
    `bool isEven(int n) {\n    return n % 2 == 0;\n}\n\nfor (int i = 0; i < 10; i++) {\n    if (isEven(i)) std::cout << i << "\\n";\n}`,
    `long factorial(int n) {\n    long result = 1;\n    for (int i = 1; i <= n; i++) result *= i;\n    return result;\n}`,
    `int findMax(const std::vector<int>& nums) {\n    int maxVal = nums[0];\n    for (int n : nums) {\n        if (n > maxVal) maxVal = n;\n    }\n    return maxVal;\n}`,
    `void swap(int& a, int& b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}`,
    `std::map<std::string, int> students = {{"Alice", 90}, {"Bob", 82}};\nfor (const auto& [name, score] : students) {\n    std::cout << name << ": " << score << "\\n";\n}`
  ],
  3: [
    `class Rectangle {\npublic:\n    Rectangle(int w, int h) : width(w), height(h) {}\n    int area() const { return width * height; }\n\nprivate:\n    int width, height;\n};`,
    `std::vector<int> fibonacci(int n) {\n    std::vector<int> result;\n    int a = 0, b = 1;\n    while ((int)result.size() < n) {\n        result.push_back(a);\n        std::tie(a, b) = std::make_pair(b, a + b);\n    }\n    return result;\n}`,
    `std::vector<int> squares;\nfor (int x = 0; x < 10; x++) {\n    if (x % 2 == 0) squares.push_back(x * x);\n}`,
    `try {\n    int value;\n    std::cin >> value;\n    if (value == 0) throw std::runtime_error("Cannot divide by zero!");\n    std::cout << 100 / value << std::endl;\n} catch (const std::exception& e) {\n    std::cerr << e.what() << std::endl;\n}`,
    `template <typename T>\nT maxOf(T a, T b) {\n    return (a > b) ? a : b;\n}\n\nstd::cout << maxOf(3, 7) << std::endl;`
  ],
  4: [
    `class Stack {\npublic:\n    void push(int item) { items.push_back(item); }\n    std::optional<int> pop() {\n        if (items.empty()) return std::nullopt;\n        int val = items.back();\n        items.pop_back();\n        return val;\n    }\n\nprivate:\n    std::vector<int> items;\n};`,
    `std::regex pattern(R"(^(\\w+)@(\\w+)\\.(com|org|net)$)");\nstd::vector<std::string> emails = {"a@b.com", "bad-email", "x@y.org"};\nfor (const auto& e : emails) {\n    if (std::regex_match(e, pattern)) std::cout << e << "\\n";\n}`,
    `template <typename T>\nclass LinkedList {\npublic:\n    void push_front(T value) {\n        head = std::make_unique<Node>(Node{value, std::move(head)});\n    }\n\nprivate:\n    struct Node {\n        T value;\n        std::unique_ptr<Node> next;\n    };\n    std::unique_ptr<Node> head;\n};`,
    `void quicksort(std::vector<int>& arr, int lo, int hi) {\n    if (lo >= hi) return;\n    int pivot = arr[hi], i = lo - 1;\n    for (int j = lo; j < hi; j++) {\n        if (arr[j] < pivot) std::swap(arr[++i], arr[j]);\n    }\n    std::swap(arr[i + 1], arr[hi]);\n    quicksort(arr, lo, i);\n    quicksort(arr, i + 2, hi);\n}`,
    `class Animal {\npublic:\n    virtual std::string speak() const = 0;\n    virtual ~Animal() = default;\n};\n\nclass Dog : public Animal {\npublic:\n    std::string speak() const override { return "Woof!"; }\n};`
  ],
  5: [
    `template <typename T>\nclass Vector3 {\npublic:\n    T x, y, z;\n\n    Vector3 operator+(const Vector3& other) const {\n        return {x + other.x, y + other.y, z + other.z};\n    }\n\n    T dot(const Vector3& other) const {\n        return x * other.x + y * other.y + z * other.z;\n    }\n};`,
    `template <typename Func>\nauto memoize(Func fn) {\n    return [fn, cache = std::map<int, int>{}](int n) mutable -> int {\n        auto it = cache.find(n);\n        if (it != cache.end()) return it->second;\n        return cache[n] = fn(n);\n    };\n}`,
    `class EventBus {\npublic:\n    template <typename T>\n    void subscribe(std::function<void(const T&)> handler) {\n        handlers[typeid(T)].push_back([handler](const void* e) {\n            handler(*static_cast<const T*>(e));\n        });\n    }\n\nprivate:\n    std::unordered_map<std::type_index, std::vector<std::function<void(const void*)>>> handlers;\n};`,
    `struct Matrix {\n    std::vector<std::vector<double>> data;\n\n    Matrix operator*(const Matrix& other) const {\n        size_t n = data.size(), m = other.data[0].size(), k = other.data.size();\n        std::vector<std::vector<double>> result(n, std::vector<double>(m, 0));\n        for (size_t i = 0; i < n; ++i)\n            for (size_t j = 0; j < m; ++j)\n                for (size_t l = 0; l < k; ++l)\n                    result[i][j] += data[i][l] * other.data[l][j];\n        return {result};\n    }\n};`,
    `auto tokenize(const std::string& text) {\n    std::unordered_map<std::string, int> counts;\n    std::regex re(R"([A-Za-z_]\\w*|[^\\sA-Za-z_])");\n    auto begin = std::sregex_iterator(text.begin(), text.end(), re);\n    for (auto it = begin; it != std::sregex_iterator(); ++it) {\n        counts[it->str()]++;\n    }\n    return counts;\n}`
  ]
};

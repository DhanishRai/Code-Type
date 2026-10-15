module.exports = {
  1: [
    `int x = 5;\nint y = 10;\nSystem.out.println(x + y);`,
    `String name = "world";\nSystem.out.println("hello " + name);`,
    `int total = 0;\nfor (int i = 0; i < 5; i++) {\n    total += i;\n}\nSystem.out.println(total);`,
    `public static int add(int a, int b) {\n    return a + b;\n}`,
    `int[] numbers = {1, 2, 3, 4};\nSystem.out.println(numbers.length);`
  ],
  2: [
    `public static String greet(String name) {\n    if (name.isEmpty()) {\n        return "Hello, stranger!";\n    }\n    return "Hello, " + name + "!";\n}`,
    `public static boolean isEven(int n) {\n    return n % 2 == 0;\n}\n\nfor (int i = 0; i < 10; i++) {\n    if (isEven(i)) System.out.println(i);\n}`,
    `public static long factorial(int n) {\n    long result = 1;\n    for (int i = 1; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}`,
    `Map<String, Integer> students = new HashMap<>();\nstudents.put("Alice", 90);\nfor (Map.Entry<String, Integer> e : students.entrySet()) {\n    System.out.println(e.getKey() + ": " + e.getValue());\n}`,
    `public static int findMax(int[] nums) {\n    int maxVal = nums[0];\n    for (int n : nums) {\n        if (n > maxVal) maxVal = n;\n    }\n    return maxVal;\n}`
  ],
  3: [
    `class Rectangle {\n    private int width, height;\n\n    public Rectangle(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    public int area() {\n        return width * height;\n    }\n}`,
    `public static List<Integer> fibonacci(int n) {\n    List<Integer> result = new ArrayList<>();\n    int a = 0, b = 1;\n    while (result.size() < n) {\n        result.add(a);\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n    return result;\n}`,
    `List<Integer> squares = IntStream.range(0, 10)\n    .filter(x -> x % 2 == 0)\n    .map(x -> x * x)\n    .boxed()\n    .collect(Collectors.toList());`,
    `try {\n    Scanner sc = new Scanner(System.in);\n    int value = sc.nextInt();\n    System.out.println(100 / value);\n} catch (ArithmeticException e) {\n    System.out.println("Cannot divide by zero!");\n}`,
    `interface Shape {\n    double area();\n}\n\nclass Circle implements Shape {\n    private double radius;\n\n    public Circle(double radius) {\n        this.radius = radius;\n    }\n\n    public double area() {\n        return Math.PI * radius * radius;\n    }\n}`
  ],
  4: [
    `@FunctionalInterface\ninterface Operation {\n    int apply(int a, int b);\n}\n\npublic static int compute(Operation op, int a, int b) {\n    return op.apply(a, b);\n}\n\nOperation add = (a, b) -> a + b;`,
    `public class Stack<T> {\n    private List<T> items = new ArrayList<>();\n\n    public void push(T item) {\n        items.add(item);\n    }\n\n    public Optional<T> pop() {\n        if (items.isEmpty()) return Optional.empty();\n        return Optional.of(items.remove(items.size() - 1));\n    }\n}`,
    `Pattern pattern = Pattern.compile("^(\\\\w+)@(\\\\w+)\\\\.(com|org|net)$");\nList<String> emails = Arrays.asList("a@b.com", "bad-email", "x@y.org");\nList<String> valid = emails.stream()\n    .filter(e -> pattern.matcher(e).matches())\n    .collect(Collectors.toList());`,
    `public static <T extends Comparable<T>> void quicksort(List<T> arr, int lo, int hi) {\n    if (lo >= hi) return;\n    T pivot = arr.get(hi);\n    int i = lo - 1;\n    for (int j = lo; j < hi; j++) {\n        if (arr.get(j).compareTo(pivot) < 0) {\n            i++;\n            Collections.swap(arr, i, j);\n        }\n    }\n    Collections.swap(arr, i + 1, hi);\n    quicksort(arr, lo, i);\n    quicksort(arr, i + 2, hi);\n}`,
    `abstract class Animal {\n    protected String name;\n\n    Animal(String name) {\n        this.name = name;\n    }\n\n    abstract String speak();\n\n    @Override\n    public String toString() {\n        return name + " says " + speak();\n    }\n}`
  ],
  5: [
    `class Node<T> implements Iterable<T> {\n    T value;\n    Node<T> next;\n\n    Node(T value, Node<T> next) {\n        this.value = value;\n        this.next = next;\n    }\n\n    @Override\n    public Iterator<T> iterator() {\n        return new Iterator<T>() {\n            Node<T> current = Node.this;\n\n            public boolean hasNext() {\n                return current != null;\n            }\n\n            public T next() {\n                T val = current.value;\n                current = current.next;\n                return val;\n            }\n        };\n    }\n}`,
    `public class EventBus {\n    private final Map<Class<?>, List<Consumer<Object>>> handlers = new ConcurrentHashMap<>();\n\n    public <T> void subscribe(Class<T> type, Consumer<T> handler) {\n        handlers.computeIfAbsent(type, k -> new ArrayList<>())\n                .add((Consumer<Object>) handler);\n    }\n\n    public void publish(Object event) {\n        handlers.getOrDefault(event.getClass(), Collections.emptyList())\n                .forEach(h -> h.accept(event));\n    }\n}`,
    `public static <K, V> Map<K, Long> tokenize(List<K> tokens) {\n    return tokens.stream()\n        .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))\n        .entrySet().stream()\n        .sorted(Map.Entry.<K, Long>comparingByValue().reversed())\n        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue,\n            (a, b) -> a, LinkedHashMap::new));\n}`,
    `public static <T> Function<T, T> memoize(Function<T, T> fn) {\n    Map<T, T> cache = new ConcurrentHashMap<>();\n    return input -> cache.computeIfAbsent(input, fn);\n}\n\nFunction<Integer, Integer> square = memoize(x -> x * x);`,
    `record Point(double x, double y) {\n    double distanceTo(Point other) {\n        return Math.sqrt(Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2));\n    }\n}\n\nvar points = List.of(new Point(0, 0), new Point(3, 4));`
  ]
};

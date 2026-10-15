module.exports = {
  1: [
    `int x = 5;\nint y = 10;\nprintf("%d\\n", x + y);`,
    `int total = 0;\nfor (int i = 0; i < 5; i++) {\n    total += i;\n}\nprintf("%d\\n", total);`,
    `int add(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    printf("%d\\n", add(2, 3));\n    return 0;\n}`,
    `char name[] = "world";\nprintf("hello %s\\n", name);`,
    `int numbers[4] = {1, 2, 3, 4};\nprintf("%d\\n", numbers[0]);`
  ],
  2: [
    `int is_even(int n) {\n    return n % 2 == 0;\n}\n\nint main() {\n    for (int i = 0; i < 10; i++) {\n        if (is_even(i)) printf("%d\\n", i);\n    }\n    return 0;\n}`,
    `long factorial(int n) {\n    long result = 1;\n    for (int i = 1; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}`,
    `int find_max(int arr[], int size) {\n    int max_val = arr[0];\n    for (int i = 1; i < size; i++) {\n        if (arr[i] > max_val) max_val = arr[i];\n    }\n    return max_val;\n}`,
    `void swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}`,
    `int sum_digits(int n) {\n    int sum = 0;\n    while (n > 0) {\n        sum += n % 10;\n        n /= 10;\n    }\n    return sum;\n}`
  ],
  3: [
    `struct Rectangle {\n    int width;\n    int height;\n};\n\nint area(struct Rectangle r) {\n    return r.width * r.height;\n}\n\nint main() {\n    struct Rectangle r = {4, 5};\n    printf("%d\\n", area(r));\n    return 0;\n}`,
    `void fibonacci(int n, int *result) {\n    int a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        result[i] = a;\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n}`,
    `int *allocate_array(int size) {\n    int *arr = (int *)malloc(size * sizeof(int));\n    if (arr == NULL) {\n        fprintf(stderr, "Allocation failed!\\n");\n        exit(1);\n    }\n    return arr;\n}`,
    `int string_length(const char *str) {\n    int len = 0;\n    while (str[len] != '\\0') {\n        len++;\n    }\n    return len;\n}`,
    `void bubble_sort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int tmp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = tmp;\n            }\n        }\n    }\n}`
  ],
  4: [
    `typedef struct Node {\n    int value;\n    struct Node *next;\n} Node;\n\nNode *push(Node *head, int value) {\n    Node *n = (Node *)malloc(sizeof(Node));\n    n->value = value;\n    n->next = head;\n    return n;\n}`,
    `#include <string.h>\n\nint count_vowels(const char *s) {\n    int count = 0;\n    const char *vowels = "aeiouAEIOU";\n    for (int i = 0; s[i] != '\\0'; i++) {\n        if (strchr(vowels, s[i]) != NULL) count++;\n    }\n    return count;\n}`,
    `double average(double *arr, size_t n) {\n    double sum = 0.0;\n    for (size_t i = 0; i < n; i++) {\n        sum += arr[i];\n    }\n    return (n > 0) ? sum / (double)n : 0.0;\n}`,
    `void free_matrix(int **matrix, int rows) {\n    for (int i = 0; i < rows; i++) {\n        free(matrix[i]);\n    }\n    free(matrix);\n}`,
    `int binary_search(const int *arr, int n, int target) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}`
  ],
  5: [
    `typedef struct {\n    int *data;\n    size_t size;\n    size_t capacity;\n} Vector;\n\nvoid vector_push(Vector *v, int value) {\n    if (v->size >= v->capacity) {\n        v->capacity = v->capacity ? v->capacity * 2 : 4;\n        v->data = (int *)realloc(v->data, v->capacity * sizeof(int));\n    }\n    v->data[v->size++] = value;\n}`,
    `int compare(const void *a, const void *b) {\n    return (*(const int *)a - *(const int *)b);\n}\n\nvoid sort_array(int *arr, size_t n) {\n    qsort(arr, n, sizeof(int), compare);\n}`,
    `#define MAX(a, b) ((a) > (b) ? (a) : (b))\n#define SWAP(T, a, b) do { T tmp = (a); (a) = (b); (b) = tmp; } while (0)\n\nvoid quicksort(int *arr, int lo, int hi) {\n    if (lo >= hi) return;\n    int pivot = arr[hi], i = lo - 1;\n    for (int j = lo; j < hi; j++) {\n        if (arr[j] < pivot) { i++; SWAP(int, arr[i], arr[j]); }\n    }\n    SWAP(int, arr[i + 1], arr[hi]);\n    quicksort(arr, lo, i);\n    quicksort(arr, i + 2, hi);\n}`,
    `typedef int (*Operation)(int, int);\n\nint apply(Operation op, int a, int b) {\n    return op(a, b);\n}\n\nint mul(int a, int b) { return a * b; }\n\nint main() {\n    Operation ops[] = { mul };\n    printf("%d\\n", apply(ops[0], 3, 4));\n    return 0;\n}`,
    `union Data {\n    int i;\n    float f;\n    char str[20];\n};\n\nvoid print_union(union Data *d, char type) {\n    switch (type) {\n        case 'i': printf("%d\\n", d->i); break;\n        case 'f': printf("%f\\n", d->f); break;\n        default: printf("%s\\n", d->str);\n    }\n}`
  ]
};

import mongoose from "mongoose";
import dotenv from "dotenv";
import Resource from "./models/resource.model.ts";

dotenv.config();

const dsaNotes = [
  {
    title: "Arrays — Complete Guide",
    slug: "arrays-complete-guide",
    type: "dsa-note",
    category: "Arrays",
    difficulty: "Beginner",
    description: "Master array operations, two-pointer technique, and sliding window algorithm with real examples and placement-focused practice patterns.",
    coverColor: "from-blue-500 to-blue-700",
    tags: ["Arrays", "Two Pointer", "Sliding Window", "Prefix Sum"],
    readTime: 12,
    authorName: "BeyondBasic Team",
    order: 1,
    content: `# Arrays — Complete Guide

## What is an Array?

An **array** is a contiguous block of memory that stores elements of the same type. It is the most fundamental data structure in programming and forms the basis for many algorithms asked in placement tests.

\`\`\`python
arr = [1, 2, 3, 4, 5]
print(arr[0])        # Access:           O(1)
arr.append(6)        # Insert at end:    O(1) amortised
arr.insert(2, 99)    # Insert at index:  O(n)
arr.pop()            # Delete from end:  O(1)
arr.remove(99)       # Delete by value:  O(n)
\`\`\`

## Complexity Reference

| Operation | Time  |
|-----------|-------|
| Access    | O(1)  |
| Search    | O(n)  |
| Insert (end) | O(1) amortised |
| Insert (middle) | O(n) |
| Delete    | O(n)  |

---

## Pattern 1 — Two Pointer

Two pointers reduce an O(n²) brute force to O(n). There are two variants:

### Opposite ends → inward
Best for: pair sum in sorted array, container with most water.

\`\`\`python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:   return [left, right]
        elif s < target:  left += 1
        else:             right -= 1
    return []
\`\`\`

### Same direction (fast & slow pointer)
Best for: remove duplicates in-place, partition.

\`\`\`python
def remove_duplicates(arr):
    if not arr: return 0
    slow = 0
    for fast in range(1, len(arr)):
        if arr[fast] != arr[slow]:
            slow += 1
            arr[slow] = arr[fast]
    return slow + 1
\`\`\`

---

## Pattern 2 — Sliding Window

Maintain a window of size k (fixed) or variable and slide it across the array.

### Fixed window — max sum of k elements

\`\`\`python
def max_sum_k(arr, k):
    window = sum(arr[:k])
    best = window
    for i in range(k, len(arr)):
        window += arr[i] - arr[i - k]
        best = max(best, window)
    return best
\`\`\`

### Variable window — longest subarray with sum ≤ k

\`\`\`python
def longest_subarray(arr, k):
    left = curr = result = 0
    for right in range(len(arr)):
        curr += arr[right]
        while curr > k:
            curr -= arr[left]
            left += 1
        result = max(result, right - left + 1)
    return result
\`\`\`

---

## Pattern 3 — Prefix Sum

Pre-compute cumulative sums for **O(1)** range queries after O(n) setup.

\`\`\`python
def build_prefix(arr):
    prefix = [0] * (len(arr) + 1)
    for i, v in enumerate(arr):
        prefix[i + 1] = prefix[i] + v
    return prefix

# sum of arr[l..r]
def range_sum(prefix, l, r):
    return prefix[r + 1] - prefix[l]
\`\`\`

**Classic use:** Count subarrays with sum equal to k using a hash map of prefix sums.

---

## Kadane's Algorithm — Maximum Subarray

\`\`\`python
def max_subarray(arr):
    curr = best = arr[0]
    for x in arr[1:]:
        curr = max(x, curr + x)
        best = max(best, curr)
    return best
\`\`\`

---

## Top Interview Problems

| Problem | Pattern | Difficulty |
|---------|---------|------------|
| Two Sum | Hash Map | Easy |
| Best Time to Buy Stock | Single pass | Easy |
| Maximum Subarray | Kadane's | Medium |
| Product Except Self | Prefix + Suffix | Medium |
| Merge Intervals | Sort + scan | Medium |
| Trapping Rain Water | Two pointer | Hard |

---

## Quick Tips for Placements

> Always ask: Is the array sorted? If yes, binary search or two-pointer likely applies.

- Off-by-one errors kill marks — verify loop bounds on paper
- For subarray problems, always consider prefix sum before brute force
- "Contiguous subarray" → Kadane's or sliding window
- "Pair with sum" → two pointer (sorted) or hash set (unsorted)
`,
  },
  {
    title: "Linked Lists — From Basics to Advanced",
    slug: "linked-lists-basics-to-advanced",
    type: "dsa-note",
    category: "Linked Lists",
    difficulty: "Intermediate",
    description: "Singly and doubly linked lists, node manipulation, Floyd's cycle detection, reversal, and merge — everything asked in campus placements.",
    coverColor: "from-violet-500 to-purple-700",
    tags: ["Linked List", "Floyd's Cycle", "Two Pointer", "Reversal"],
    readTime: 14,
    authorName: "BeyondBasic Team",
    order: 2,
    content: `# Linked Lists — From Basics to Advanced

## Structure

A linked list is a sequence of **nodes**. Each node holds data and a pointer to the next node. Unlike arrays there is no contiguous memory, so random access is O(n).

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Build: 1 -> 2 -> 3
head = ListNode(1, ListNode(2, ListNode(3)))
\`\`\`

## Complexity

| Operation | Singly LL | Array |
|-----------|-----------|-------|
| Access by index | O(n) | O(1) |
| Insert at head | O(1) | O(n) |
| Insert at tail | O(1) with tail ptr | O(1) |
| Delete at head | O(1) | O(n) |
| Search | O(n) | O(n) |

---

## Pattern 1 — Reversal

Reverse a linked list iteratively in O(n) time and O(1) space.

\`\`\`python
def reverse(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev   # new head
\`\`\`

**Reverse k nodes at a time:** repeat the above for every group of k.

---

## Pattern 2 — Floyd's Cycle Detection

Uses fast (2 steps) and slow (1 step) pointers. If they meet, a cycle exists.

\`\`\`python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

def find_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None      # no cycle
    # reset one pointer to head
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    return slow          # entry of cycle
\`\`\`

---

## Pattern 3 — Fast & Slow for Middle

\`\`\`python
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow   # middle node
\`\`\`

Use this to split a list in half for merge sort.

---

## Pattern 4 — Merge Two Sorted Lists

\`\`\`python
def merge(l1, l2):
    dummy = ListNode(0)
    cur = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            cur.next = l1; l1 = l1.next
        else:
            cur.next = l2; l2 = l2.next
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next
\`\`\`

---

## Pattern 5 — Nth Node from End

Use two pointers separated by n steps.

\`\`\`python
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next
\`\`\`

---

## Doubly Linked List

Each node has both **prev** and **next** pointers. Insertion and deletion at both ends is O(1).

\`\`\`python
class DNode:
    def __init__(self, val):
        self.val = val
        self.prev = None
        self.next = None
\`\`\`

Used internally to implement: LRU Cache, Deque (collections.deque).

---

## Top Interview Problems

| Problem | Key Idea |
|---------|----------|
| Reverse Linked List | Iterative / Recursive |
| Detect Cycle | Floyd's algorithm |
| Find cycle start | Floyd's + head reset |
| Merge two sorted lists | Dummy head + pointers |
| Remove Nth from end | Two-pointer gap n |
| Palindrome Linked List | Reverse second half |
| Copy List with Random Pointer | Hash map / interleave |

> **Placement tip:** Always handle the edge case of an empty list or single-node list first. Interviewers love catching that.
`,
  },
  {
    title: "Binary Trees — Traversals & Key Techniques",
    slug: "binary-trees-traversals-techniques",
    type: "dsa-note",
    category: "Trees",
    difficulty: "Intermediate",
    description: "Complete guide to binary trees: DFS & BFS traversals, BST properties, height, LCA, and the most common patterns in placement exams.",
    coverColor: "from-green-500 to-emerald-700",
    tags: ["Trees", "DFS", "BFS", "BST", "Recursion"],
    readTime: 16,
    authorName: "BeyondBasic Team",
    order: 3,
    content: `# Binary Trees — Traversals & Key Techniques

## Structure

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
\`\`\`

A **binary tree** has at most 2 children per node. A **BST** (Binary Search Tree) satisfies: left subtree < node < right subtree.

---

## DFS Traversals (Recursive)

\`\`\`python
def inorder(root):    # Left → Node → Right  (gives sorted order for BST)
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def preorder(root):   # Node → Left → Right  (serialize tree)
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def postorder(root):  # Left → Right → Node  (delete tree, evaluate expressions)
    if not root: return []
    return postorder(root.left) + postorder(root.right) + [root.val]
\`\`\`

### Iterative Inorder (stack)

\`\`\`python
def inorder_iter(root):
    stack, result, curr = [], [], root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    return result
\`\`\`

---

## BFS — Level Order Traversal

\`\`\`python
from collections import deque

def level_order(root):
    if not root: return []
    q = deque([root])
    result = []
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result
\`\`\`

---

## Height & Diameter

\`\`\`python
def height(root):
    if not root: return 0
    return 1 + max(height(root.left), height(root.right))

def diameter(root):
    """Longest path between any two nodes"""
    best = [0]
    def dfs(node):
        if not node: return 0
        l, r = dfs(node.left), dfs(node.right)
        best[0] = max(best[0], l + r)
        return 1 + max(l, r)
    dfs(root)
    return best[0]
\`\`\`

---

## Lowest Common Ancestor (LCA)

\`\`\`python
def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    left  = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right: return root   # p and q on different sides
    return left or right
\`\`\`

**For BST specifically:**

\`\`\`python
def lca_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
\`\`\`

---

## BST Operations

\`\`\`python
def search(root, val):
    if not root or root.val == val: return root
    if val < root.val: return search(root.left, val)
    return search(root.right, val)

def insert(root, val):
    if not root: return TreeNode(val)
    if val < root.val: root.left  = insert(root.left, val)
    else:              root.right = insert(root.right, val)
    return root

def validate_bst(root, lo=float('-inf'), hi=float('inf')):
    if not root: return True
    if not (lo < root.val < hi): return False
    return (validate_bst(root.left, lo, root.val) and
            validate_bst(root.right, root.val, hi))
\`\`\`

---

## Top Interview Problems

| Problem | Technique |
|---------|-----------|
| Maximum Depth | DFS height |
| Symmetric Tree | Mirror check |
| Path Sum | DFS with target |
| Level Order | BFS |
| Lowest Common Ancestor | Recursive DFS |
| Validate BST | Range DFS |
| Serialize / Deserialize | Preorder |
| Binary Tree to DLL | In-order + prev pointer |

> **Exam tip:** Most tree problems reduce to a single recursive DFS. Ask yourself: "What does this function return for a null node?" Then build the recurrence.
`,
  },
  {
    title: "Dynamic Programming — Master the Patterns",
    slug: "dynamic-programming-master-patterns",
    type: "dsa-note",
    category: "Dynamic Programming",
    difficulty: "Advanced",
    description: "Memoization vs tabulation, identifying DP problems, and a breakdown of the five core DP patterns that appear in 90% of placement exams.",
    coverColor: "from-orange-500 to-red-600",
    tags: ["DP", "Memoization", "Tabulation", "Knapsack", "LCS"],
    readTime: 18,
    authorName: "BeyondBasic Team",
    order: 4,
    content: `# Dynamic Programming — Master the Patterns

## When to use DP?

Apply DP when a problem has **overlapping subproblems** and **optimal substructure** — the optimal solution can be built from optimal solutions to smaller subproblems.

**Signs a problem is DP:**
- "Count the number of ways to..."
- "Find the minimum / maximum..."
- "Is it possible to reach..."
- Problem involves choices at each step

---

## Approach 1 — Top-down (Memoization)

Write the recursive solution first, then cache results.

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
\`\`\`

---

## Approach 2 — Bottom-up (Tabulation)

Fill a table iteratively from the smallest subproblem.

\`\`\`python
def fib_tab(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

Bottom-up is usually faster (no recursion overhead) and avoids stack overflow.

---

## Pattern 1 — 1D DP (Linear)

**Climbing Stairs / Coin Change**

\`\`\`python
def climb_stairs(n):
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
\`\`\`

---

## Pattern 2 — 0/1 Knapsack

Each item is taken at most once.

\`\`\`python
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i-1][w]           # skip item i
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                               dp[i-1][w - weights[i-1]] + values[i-1])
    return dp[n][capacity]
\`\`\`

**Space optimised (1D dp):** iterate w from capacity down to weight.

---

## Pattern 3 — LCS / Edit Distance (2D DP)

\`\`\`python
def lcs(s, t):
    m, n = len(s), len(t)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i-1] == t[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

def edit_distance(s, t):
    m, n = len(s), len(t)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i-1] == t[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]
\`\`\`

---

## Pattern 4 — Interval DP

\`\`\`python
def matrix_chain(dims):
    """Minimum multiplications to multiply chain of matrices"""
    n = len(dims) - 1
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]
                dp[i][j] = min(dp[i][j], cost)
    return dp[0][n-1]
\`\`\`

---

## Pattern 5 — DP on Subsequences (LIS)

\`\`\`python
import bisect

def lis(arr):
    """Longest Increasing Subsequence — O(n log n)"""
    tails = []
    for x in arr:
        pos = bisect.bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
    return len(tails)
\`\`\`

---

## Classic DP Problems — Quick Reference

| Problem | Pattern | Complexity |
|---------|---------|------------|
| Fibonacci | 1D linear | O(n) |
| Coin Change | Unbounded knapsack | O(n·W) |
| 0/1 Knapsack | 2D DP | O(n·W) |
| LCS | 2D string DP | O(m·n) |
| Edit Distance | 2D string DP | O(m·n) |
| LIS | Patience sort | O(n log n) |
| Partition Equal Subset | 0/1 knapsack variant | O(n·S) |
| Unique Paths | Grid DP | O(m·n) |

> **Strategy:** First solve the recurrence relation on paper. State = what changes, transition = what choice you make. Then code top-down, then optimise to bottom-up.
`,
  },
  {
    title: "Graph Algorithms — BFS, DFS & Shortest Paths",
    slug: "graph-algorithms-bfs-dfs-shortest-paths",
    type: "dsa-note",
    category: "Graphs",
    difficulty: "Advanced",
    description: "Graph representations, BFS and DFS for traversal and cycle detection, Dijkstra's and Bellman-Ford for shortest paths, and topological sort.",
    coverColor: "from-teal-500 to-cyan-700",
    tags: ["Graphs", "BFS", "DFS", "Dijkstra", "Topological Sort"],
    readTime: 20,
    authorName: "BeyondBasic Team",
    order: 5,
    content: `# Graph Algorithms — BFS, DFS & Shortest Paths

## Representations

\`\`\`python
# Adjacency List (most common)
graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0, 3],
    3: [1, 2]
}

# Adjacency Matrix (dense graphs)
n = 4
adj = [[0] * n for _ in range(n)]
adj[0][1] = 1   # edge 0 → 1 with weight 1

# Edge List
edges = [(0,1), (0,2), (1,3), (2,3)]
\`\`\`

**Use adjacency list** unless the graph is dense (E ≈ V²).

---

## BFS — Breadth-First Search

Explores level by level. Used for shortest path in **unweighted** graphs.

\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = {start}
    q = deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nbr in graph[node]:
            if nbr not in visited:
                visited.add(nbr)
                q.append(nbr)
    return order

def shortest_path_bfs(graph, src, dst):
    visited = {src}
    q = deque([(src, 0)])
    while q:
        node, dist = q.popleft()
        if node == dst: return dist
        for nbr in graph[node]:
            if nbr not in visited:
                visited.add(nbr)
                q.append((nbr, dist + 1))
    return -1   # unreachable
\`\`\`

---

## DFS — Depth-First Search

Explores as deep as possible. Used for cycle detection, topological sort, connected components.

\`\`\`python
def dfs(graph, node, visited=None):
    if visited is None: visited = set()
    visited.add(node)
    for nbr in graph[node]:
        if nbr not in visited:
            dfs(graph, nbr, visited)
    return visited

# Iterative DFS
def dfs_iter(graph, start):
    visited, stack, order = set(), [start], []
    while stack:
        node = stack.pop()
        if node in visited: continue
        visited.add(node)
        order.append(node)
        stack.extend(graph[node])
    return order
\`\`\`

### Cycle Detection (Directed Graph)

\`\`\`python
def has_cycle_directed(graph, n):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n

    def dfs(u):
        color[u] = GRAY
        for v in graph[u]:
            if color[v] == GRAY: return True   # back edge
            if color[v] == WHITE and dfs(v): return True
        color[u] = BLACK
        return False

    return any(dfs(u) for u in range(n) if color[u] == WHITE)
\`\`\`

---

## Topological Sort (Kahn's BFS)

For DAGs — order tasks so every dependency comes before the task that needs it.

\`\`\`python
from collections import deque

def topo_sort(n, edges):
    graph = [[] for _ in range(n)]
    indegree = [0] * n
    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1

    q = deque(i for i in range(n) if indegree[i] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)

    return order if len(order) == n else []   # [] means cycle exists
\`\`\`

---

## Dijkstra's Algorithm — Weighted Shortest Path

\`\`\`python
import heapq

def dijkstra(graph, src, n):
    """graph[u] = [(weight, v), ...]"""
    dist = [float('inf')] * n
    dist[src] = 0
    heap = [(0, src)]   # (distance, node)

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue   # stale entry
        for w, v in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))
    return dist
\`\`\`

**Time:** O((V + E) log V).
**Works for:** non-negative weights only.

---

## Union-Find (Disjoint Set)

Detects cycles and finds connected components in O(α(n)) ≈ O(1).

\`\`\`python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank   = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False   # already connected
        if self.rank[px] < self.rank[py]: px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]: self.rank[px] += 1
        return True
\`\`\`

---

## Problem → Algorithm Cheatsheet

| Problem Type | Use |
|-------------|-----|
| Shortest path, unweighted | BFS |
| Shortest path, weighted (no negative) | Dijkstra |
| Shortest path, negative edges | Bellman-Ford |
| Cycle detection in directed graph | DFS with colours |
| Cycle detection in undirected graph | Union-Find or DFS |
| Task ordering / prerequisites | Topological Sort |
| Connected components | BFS / DFS / Union-Find |
| Bipartite check | BFS 2-coloring |

> **Placement tip:** Most graph problems boil down to BFS/DFS + careful visited tracking. Practice on grids (2D arrays) where cells are nodes and moves are edges.
`,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Connected to MongoDB");

  await Resource.deleteMany({ type: "dsa-note" });
  console.log("Cleared existing DSA notes");

  const created = await Resource.insertMany(dsaNotes);
  console.log(`Seeded ${created.length} DSA notes:`);
  created.forEach((r) => console.log(`  ✓ ${r.title}`));

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import slugify from "slugify";

import User from "./models/user.model.ts";
import Course from "./models/course.model.ts";
import Topic from "./models/topic.model.ts";
import Subtopic from "./models/subtopic.model.ts";
import Enrollment from "./models/enrollment.model.ts";
import UserProfile from "./models/userProfile.model.ts";
import Problem from "./models/problem.model.ts";
import UserProblemStatus from "./models/userProblemStatus.model.ts";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/beyondbasic";

const articlesData = {
  "intro-to-arrays": [
    { type: "heading", data: { level: 2, text: "What is an Array?" } },
    { type: "paragraph", data: { text: "An array is the most fundamental data structure in computer science — think of it as a row of labeled boxes, each holding a value. Every box has a unique index (starting from 0) that lets you instantly jump to it, no searching needed." } },
    { type: "info", data: { title: "Core Idea", text: "Arrays store elements at contiguous (next-to-each-other) memory locations. Because of this layout, accessing any element by its index takes the same time — O(1) — regardless of array size." } },
    { type: "heading", data: { level: 2, text: "Visualizing Memory Layout" } },
    { type: "paragraph", data: { text: "When you create an array like [10, 20, 30, 40, 50], the operating system allocates a block of contiguous memory. If the first element sits at memory address 1000, and each integer takes 4 bytes, then:" } },
    { type: "table", data: { headers: ["Index", "Value", "Memory Address"], rows: [["0", "10", "1000"], ["1", "20", "1004"], ["2", "30", "1008"], ["3", "40", "1012"], ["4", "50", "1016"]] } },
    { type: "heading", data: { level: 2, text: "Creating Arrays" } },
    { type: "code", data: { language: "python", title: "Python — Arrays (Lists)", code: `# Creating an array (list in Python)
nums = [10, 20, 30, 40, 50]

# Access by index — O(1)
print(nums[0])   # 10
print(nums[-1])  # 50  (negative index = from end)

# Modify an element — O(1)
nums[2] = 99
print(nums)  # [10, 20, 99, 40, 50]

# Length
print(len(nums))  # 5` } },
    { type: "code", data: { language: "javascript", title: "JavaScript — Arrays", code: `// Creating an array
const nums = [10, 20, 30, 40, 50];

// Access by index — O(1)
console.log(nums[0]);    // 10
console.log(nums.at(-1)); // 50 (last element)

// Modify — O(1)
nums[2] = 99;
console.log(nums); // [10, 20, 99, 40, 50]` } },
    { type: "heading", data: { level: 2, text: "Time Complexity Cheat Sheet" } },
    { type: "comparison", data: { title: "Array Operations", items: [{ operation: "Access by index", complexity: "O(1)", note: "Constant time — the killer feature" }, { operation: "Search (unsorted)", complexity: "O(n)", note: "Must check every element" }, { operation: "Insert at end", complexity: "O(1)*", note: "Amortized — sometimes O(n) for resize" }, { operation: "Insert at middle", complexity: "O(n)", note: "Must shift elements right" }, { operation: "Delete at end", complexity: "O(1)", note: "Just decrease length" }, { operation: "Delete at middle", complexity: "O(n)", note: "Must shift elements left" }] } },
    { type: "tip", data: { text: "When asked 'can we do better than O(n) search?' on an array, the answer is usually: sort it first, then use binary search for O(log n) lookups." } },
    { type: "heading", data: { level: 2, text: "Common Pitfalls" } },
    { type: "warning", data: { title: "Index Out of Bounds", text: "Accessing nums[10] when nums has only 5 elements causes an IndexError (Python) or returns undefined (JavaScript). Always validate your indices!" } },
    { type: "keyPoints", data: { title: "Key Takeaways", points: ["Arrays provide O(1) random access via index — this is their superpower", "Insertions/deletions in the middle cost O(n) due to shifting", "Arrays are cache-friendly: contiguous memory = fewer cache misses", "Dynamic arrays (Python lists, JS arrays) auto-resize but this is amortized O(1)", "Use arrays when you need fast index-based access and the size is roughly known"] } },
    { type: "quiz", data: { question: "You have an array of 1 million elements. How long does it take to access the element at index 500,000?", options: ["O(n) — proportional to array size", "O(log n) — like binary search", "O(1) — constant time always", "O(n/2) — halfway through"], correctIndex: 2, explanation: "Array access by index is always O(1) regardless of size, because the address is computed directly: base_address + (index × element_size). No searching required." } },
  ],

  "two-pointers": [
    { type: "heading", data: { level: 2, text: "The Two Pointers Technique" } },
    { type: "paragraph", data: { text: "Two Pointers is an elegant technique where you maintain two indices (pointers) that move through a data structure — usually from both ends toward the middle, or both moving in the same direction. It converts many O(n²) brute force solutions into O(n)." } },
    { type: "success", data: { title: "When to Use It", text: "Look for two-pointer when: the array is sorted (or can be sorted), you need pairs/triplets summing to a target, or you need to find a subarray satisfying some condition." } },
    { type: "heading", data: { level: 2, text: "Pattern 1: Opposite Direction" } },
    { type: "paragraph", data: { text: "Start one pointer at the beginning (left = 0) and one at the end (right = n-1). Move them toward each other based on your condition. This is the classic pattern for finding pairs." } },
    { type: "code", data: { language: "python", title: "Two Sum II — Sorted Array", code: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1   # Need bigger sum → move left pointer right
        else:
            right -= 1  # Need smaller sum → move right pointer left

    return []  # No solution found

# Example
print(two_sum_sorted([2, 7, 11, 15], 9))  # [1, 2]` } },
    { type: "heading", data: { level: 2, text: "Pattern 2: Same Direction (Fast & Slow)" } },
    { type: "paragraph", data: { text: "Both pointers start at the beginning but move at different speeds. The 'slow' pointer tracks a position while the 'fast' pointer explores ahead." } },
    { type: "code", data: { language: "python", title: "Remove Duplicates from Sorted Array", code: `def remove_duplicates(nums):
    if not nums:
        return 0

    slow = 0  # Points to the last unique element

    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]  # Place next unique element

    return slow + 1  # Length of unique portion

# Trace through [1, 1, 2, 3, 3]:
# fast=1: nums[1]=1 == nums[0]=1 → skip
# fast=2: nums[2]=2 != nums[0]=1 → slow=1, nums[1]=2
# fast=3: nums[3]=3 != nums[1]=2 → slow=2, nums[2]=3
# fast=4: nums[4]=3 == nums[2]=3 → skip
# Result: [1, 2, 3, _, _], return 3` } },
    { type: "tip", data: { text: "Draw it out! Two pointer problems become crystal clear when you trace the pointer positions step by step on paper. This also helps in interviews." } },
    { type: "keyPoints", data: { title: "Two Pointers Checklist", points: ["Sorted array + pair/triplet sum → opposite direction pointers", "In-place array modification → fast/slow pointers", "Time complexity: O(n) — each element visited at most twice", "Space complexity: O(1) — no extra data structures needed", "Common problems: Valid Palindrome, Container With Most Water, 3Sum, Trapping Rain Water"] } },
    { type: "quiz", data: { question: "For the Two Sum problem on a SORTED array, what is the time complexity of the two-pointer approach vs brute force?", options: ["Both O(n²)", "Two-pointer O(n), brute force O(n²)", "Two-pointer O(n log n), brute force O(n)", "Both O(n)"], correctIndex: 1, explanation: "Two pointers achieve O(n) because each pointer moves at most n steps total. Brute force checks all pairs → O(n²). The sorted property lets us make informed decisions about which pointer to move." } },
  ],

  "sliding-window": [
    { type: "heading", data: { level: 2, text: "The Sliding Window Pattern" } },
    { type: "paragraph", data: { text: "Sliding window is a technique for problems involving subarrays or substrings. Instead of recalculating results from scratch as we move, we slide a window across the data, efficiently adding new elements and removing old ones." } },
    { type: "info", data: { title: "The Core Insight", text: "When you need results for every window of size k, naively recomputing each window is O(n·k). But most window operations (sum, max, count) can be updated in O(1) when you slide: remove the element leaving, add the element entering." } },
    { type: "heading", data: { level: 2, text: "Fixed Window Size" } },
    { type: "code", data: { language: "python", title: "Maximum Sum Subarray of Size K", code: `def max_sum_subarray(nums, k):
    # Build initial window
    window_sum = sum(nums[:k])
    max_sum = window_sum

    # Slide window — O(n)
    for i in range(k, len(nums)):
        window_sum += nums[i]        # Add incoming element
        window_sum -= nums[i - k]    # Remove outgoing element
        max_sum = max(max_sum, window_sum)

    return max_sum

# Example: nums=[2,1,5,1,3,2], k=3
# Window 1: [2,1,5] → sum=8
# Window 2: [1,5,1] → sum=7  (add 1, remove 2)
# Window 3: [5,1,3] → sum=9  (add 3, remove 1) ← MAX
# Window 4: [1,3,2] → sum=6  (add 2, remove 5)
print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))  # 9` } },
    { type: "heading", data: { level: 2, text: "Variable Window Size" } },
    { type: "paragraph", data: { text: "Sometimes the window needs to grow and shrink dynamically. We expand when we can, and shrink when we violate a constraint." } },
    { type: "code", data: { language: "python", title: "Longest Substring Without Repeating Characters", code: `def length_of_longest_substring(s):
    char_set = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        # Shrink window until no duplicate
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1

        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)

    return max_len

# Trace "abcabcbb":
# right=0 (a): set={a}, len=1
# right=1 (b): set={a,b}, len=2
# right=2 (c): set={a,b,c}, len=3
# right=3 (a): 'a' in set → remove s[0]='a', left=1 → set={b,c,a}, len=3
# ...
print(length_of_longest_substring("abcabcbb"))  # 3` } },
    { type: "warning", data: { title: "Common Mistake", text: "Forgetting to update your data structure when shrinking the window. If you add to a hashmap when expanding, you must remove from it when shrinking!" } },
    { type: "keyPoints", data: { title: "Sliding Window Cheat Sheet", points: ["Fixed window: maintain sum/count, add right element, remove left element each step", "Variable window: expand until constraint violated, then shrink from left", "Identify the 'window invariant' — the condition your window must always satisfy", "Time: O(n) — each element enters and exits window at most once", "Common problems: Max Sum Subarray, Longest Substring K Distinct, Minimum Window Substring, Fruit Into Baskets"] } },
    { type: "quiz", data: { question: "Finding max sum subarray of size k naively is O(n·k). Sliding window reduces this to:", options: ["O(n log n)", "O(k)", "O(n)", "O(n + k)"], correctIndex: 2, explanation: "Sliding window processes each element exactly twice (once entering, once leaving the window), giving O(n) regardless of window size k." } },
  ],

  "linked-list-basics": [
    { type: "heading", data: { level: 2, text: "What is a Linked List?" } },
    { type: "paragraph", data: { text: "A linked list is a chain of nodes, where each node holds a value and a pointer to the next node. Unlike arrays, nodes don't need to be contiguous in memory — they're scattered around and connected by pointers." } },
    { type: "comparison", data: { title: "Array vs Linked List", items: [{ operation: "Access by index", complexity: "Array: O(1) / LL: O(n)", note: "Arrays win here" }, { operation: "Insert at beginning", complexity: "Array: O(n) / LL: O(1)", note: "Linked List wins" }, { operation: "Insert at end", complexity: "Array: O(1)* / LL: O(n) or O(1)*", note: "Similar with tail pointer" }, { operation: "Memory overhead", complexity: "Array: Low / LL: High", note: "Each LL node stores a pointer" }, { operation: "Cache performance", complexity: "Array: Excellent / LL: Poor", note: "Arrays are contiguous" }] } },
    { type: "heading", data: { level: 2, text: "Building a Linked List" } },
    { type: "code", data: { language: "python", title: "Node and LinkedList Implementation", code: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None  # Pointer to next node

class LinkedList:
    def __init__(self):
        self.head = None  # Start of the list

    def append(self, val):
        """Add to end — O(n)"""
        new_node = Node(val)
        if not self.head:
            self.head = new_node
            return

        current = self.head
        while current.next:  # Walk to last node
            current = current.next
        current.next = new_node

    def prepend(self, val):
        """Add to beginning — O(1)"""
        new_node = Node(val)
        new_node.next = self.head
        self.head = new_node

    def print_list(self):
        current = self.head
        while current:
            print(current.val, end=" → ")
            current = current.next
        print("None")

# Usage
ll = LinkedList()
ll.append(1)
ll.append(2)
ll.append(3)
ll.prepend(0)
ll.print_list()  # 0 → 1 → 2 → 3 → None` } },
    { type: "tip", data: { text: "Always draw boxes and arrows when working with linked lists. Pointer manipulation is easy to get wrong mentally — visualizing it prevents bugs." } },
    { type: "heading", data: { level: 2, text: "Traversal and Common Operations" } },
    { type: "code", data: { language: "python", title: "Search, Delete, Reverse", code: `def search(head, target):
    """Returns node if found, None otherwise — O(n)"""
    current = head
    while current:
        if current.val == target:
            return current
        current = current.next
    return None

def delete_node(head, target):
    """Delete first node with given value — O(n)"""
    dummy = Node(0)        # Dummy node simplifies edge cases
    dummy.next = head
    prev = dummy

    while prev.next:
        if prev.next.val == target:
            prev.next = prev.next.next  # Skip over target
            return dummy.next
        prev = prev.next

    return dummy.next

def reverse(head):
    """Reverse linked list in-place — O(n)"""
    prev = None
    current = head

    while current:
        next_node = current.next  # Save next
        current.next = prev       # Reverse pointer
        prev = current            # Move prev forward
        current = next_node       # Move current forward

    return prev  # New head` } },
    { type: "info", data: { title: "The Dummy Node Trick", text: "Prepending a dummy (sentinel) node before the head eliminates special-casing for operations on the head. After the operation, return dummy.next as the new head." } },
    { type: "keyPoints", data: { title: "Linked List Essentials", points: ["Use a dummy/sentinel head node to simplify deletion and insertion edge cases", "For reverse, track three pointers: prev, current, next", "Two-pointer (fast/slow) technique detects cycles and finds midpoints", "Always check for null pointers before dereferencing!", "Singly linked list: O(1) prepend, O(n) everything else without tail pointer"] } },
    { type: "quiz", data: { question: "What is the time complexity of inserting a node at the BEGINNING of a singly linked list?", options: ["O(n) — must traverse to end", "O(log n)", "O(1) — just update head pointer", "O(n²)"], correctIndex: 2, explanation: "Prepending to a linked list is O(1): create a new node, point it to the current head, then update head = new_node. No traversal needed!" } },
  ],

  "stack-fundamentals": [
    { type: "heading", data: { level: 2, text: "The Stack Data Structure" } },
    { type: "paragraph", data: { text: "A stack is a Last-In-First-Out (LIFO) structure — like a stack of plates. You can only add to the top (push) or remove from the top (pop). This simple constraint makes stacks incredibly powerful for certain problems." } },
    { type: "info", data: { title: "Real-World Analogies", text: "Browser back button, undo in text editors, function call stack, balanced parentheses checking — stacks are everywhere in computing." } },
    { type: "code", data: { language: "python", title: "Stack Implementation & Operations", code: `# Python list works perfectly as a stack
stack = []

# Push — O(1)
stack.append(1)
stack.append(2)
stack.append(3)
print(stack)  # [1, 2, 3] — 3 is on top

# Peek (top without removing) — O(1)
top = stack[-1]
print(top)    # 3

# Pop — O(1)
popped = stack.pop()
print(popped) # 3
print(stack)  # [1, 2]

# Check empty — O(1)
print(len(stack) == 0)  # False` } },
    { type: "heading", data: { level: 2, text: "Classic Problem: Valid Parentheses" } },
    { type: "code", data: { language: "python", title: "LeetCode #20 — Valid Parentheses", code: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in '({[':
            stack.append(char)        # Push opening brackets
        elif char in ')}]':
            if not stack or stack[-1] != mapping[char]:
                return False          # Mismatch or empty stack
            stack.pop()               # Pop matching opener

    return len(stack) == 0            # Stack must be empty

# Test cases
print(is_valid("()[]{}"))    # True
print(is_valid("([)]"))      # False — wrong order
print(is_valid("{[]}"))      # True
print(is_valid("("))         # False — unclosed` } },
    { type: "heading", data: { level: 2, text: "Monotonic Stack" } },
    { type: "paragraph", data: { text: "A monotonic stack maintains elements in increasing or decreasing order. It's the secret weapon for 'next greater element' type problems." } },
    { type: "code", data: { language: "python", title: "Next Greater Element", code: `def next_greater_element(nums):
    result = [-1] * len(nums)
    stack = []  # Stores indices, not values

    for i in range(len(nums)):
        # Pop elements smaller than current — found their answer
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)

    return result

# nums = [2, 1, 2, 4, 3]
# result = [4, 2, 4, -1, -1]
print(next_greater_element([2, 1, 2, 4, 3]))` } },
    { type: "keyPoints", data: { title: "Stack Key Takeaways", points: ["All operations (push, pop, peek) are O(1)", "Perfect for: matching brackets, undo operations, expression evaluation", "Monotonic stack: O(n) solution for 'next greater/smaller' problems", "Call stack depth → recursive algorithms use implicit stacks", "When you see 'previous/next larger/smaller element', think monotonic stack"] } },
    { type: "quiz", data: { question: "Which problem is a PERFECT use case for a stack?", options: ["Finding the minimum in an array", "Checking balanced parentheses", "Binary search on sorted array", "Finding the median"], correctIndex: 1, explanation: "Balanced parentheses is a textbook stack problem. Opening brackets push onto the stack; closing brackets must match the top. If they don't, or the stack is non-empty at the end, brackets are unbalanced." } },
  ],
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clean existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Topic.deleteMany({}),
      Subtopic.deleteMany({}),
      Enrollment.deleteMany({}),
      UserProfile.deleteMany({}),
      Problem.deleteMany({}),
      UserProblemStatus.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // Create instructor
    const hashedPassword = await bcrypt.hash("password123", 10);
    const instructor = await User.create({
      username: "instructor_raj",
      email: "instructor@beyondbasic.in",
      password: hashedPassword,
      role: "instructor",
    });

    // Create admin
    await User.create({
      username: "admin",
      email: "admin@beyondbasic.in",
      password: hashedPassword,
      role: "admin",
    });

    // Create student
    const studentUser = await User.create({
      username: "student_demo",
      email: "student@beyondbasic.in",
      password: hashedPassword,
      role: "student",
    });

    console.log("Created users");

    // ── DSA Mastery Course ──
    const dsaCourse = await Course.create({
      title: "DSA Mastery",
      slug: "dsa-mastery",
      description: "Master Data Structures and Algorithms from scratch to advanced level. This comprehensive course covers every important topic you need to crack FAANG interviews. Build strong fundamentals with hands-on practice problems and detailed explanations.",
      shortDescription: "From arrays to dynamic programming — everything you need for technical interviews.",
      coverImageUrl: null,
      tags: ["DSA", "Algorithms", "Data Structures", "FAANG", "Interview Prep"],
      category: "Computer Science",
      level: "Intermediate",
      author: instructor._id,
      isPublished: true,
      price: 999,
      totalEnrollments: 12450,
      rating: 4.8,
      totalRatings: 3241,
      estimatedDuration: "45 hours",
      color: "from-blue-500 to-cyan-500",
      icon: "Code2",
      whatYouWillLearn: [
        "Master all fundamental data structures: arrays, linked lists, trees, graphs",
        "Solve 200+ LeetCode problems with optimized solutions",
        "Understand time and space complexity analysis (Big O)",
        "Learn 15+ algorithm patterns: two pointers, sliding window, BFS/DFS, DP",
        "Crack FAANG and top tech company interviews confidently",
        "Implement data structures from scratch in Python and JavaScript",
      ],
      requirements: [
        "Basic programming knowledge in any language (Python or JavaScript preferred)",
        "Understanding of variables, loops, and functions",
        "No prior DSA experience required — we start from basics",
      ],
    });

    // ── Chapter 1: Arrays & Strings ──
    const arraysChapter = await Topic.create({
      title: "Arrays & Strings",
      course: dsaCourse._id,
      order: 1,
    });

    const arraysSubtopics = [
      {
        title: "Introduction to Arrays",
        slug: "intro-to-arrays",
        order: 1,
        isFreePreview: true,
        estimatedReadTime: 8,
        summary: "Learn what arrays are, how they work in memory, and their time complexities.",
        content: articlesData["intro-to-arrays"],
      },
      {
        title: "Two Pointers Technique",
        slug: "two-pointers",
        order: 2,
        isFreePreview: false,
        estimatedReadTime: 10,
        summary: "Master the two pointers pattern for solving array problems in O(n) time.",
        content: articlesData["two-pointers"],
      },
      {
        title: "Sliding Window Pattern",
        slug: "sliding-window",
        order: 3,
        isFreePreview: false,
        estimatedReadTime: 12,
        summary: "Learn fixed and variable sliding window for substring and subarray problems.",
        content: articlesData["sliding-window"],
      },
      {
        title: "Binary Search",
        slug: "binary-search",
        order: 4,
        isFreePreview: false,
        estimatedReadTime: 10,
        summary: "Understand when and how to apply binary search, including on answer spaces.",
        content: [
          { type: "heading", data: { level: 2, text: "Binary Search: Search in O(log n)" } },
          { type: "paragraph", data: { text: "Binary search is the most elegant algorithm for searching in a sorted collection. By repeatedly halving the search space, it finds the target in O(log n) time — that's searching 1 billion elements in just 30 steps!" } },
          { type: "info", data: { title: "Requirement", text: "Binary search requires a SORTED array (or a monotonic condition). If the array isn't sorted, sort it first, but account for the O(n log n) sorting cost." } },
          { type: "code", data: { language: "python", title: "Classic Binary Search Template", code: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2  # Avoids integer overflow

        if nums[mid] == target:
            return mid          # Found!
        elif nums[mid] < target:
            left = mid + 1      # Target is in right half
        else:
            right = mid - 1     # Target is in left half

    return -1  # Not found` } },
          { type: "keyPoints", data: { title: "Binary Search Essentials", points: ["Use left + (right - left) // 2 instead of (left + right) // 2 to prevent overflow", "Three variants: exact match, leftmost position, rightmost position", "Can be applied to 'search on answer space' problems (e.g., minimum capacity)", "O(log n) time, O(1) space"] } },
          { type: "quiz", data: { question: "How many steps does binary search take to find a target in a sorted array of 1,000,000 elements?", options: ["1,000,000 steps", "500,000 steps", "About 20 steps", "About 1,000 steps"], correctIndex: 2, explanation: "log₂(1,000,000) ≈ 20. Binary search halves the search space each step, so it only needs ~20 comparisons to search a million elements." } },
        ],
      },
    ];

    for (const st of arraysSubtopics) {
      await Subtopic.create({ ...st, topic: arraysChapter._id });
    }

    // ── Chapter 2: Linked Lists ──
    const linkedListChapter = await Topic.create({
      title: "Linked Lists",
      course: dsaCourse._id,
      order: 2,
    });

    await Subtopic.create({
      title: "Singly Linked List",
      slug: "linked-list-basics",
      topic: linkedListChapter._id,
      order: 1,
      isFreePreview: false,
      estimatedReadTime: 12,
      summary: "Build a linked list from scratch and master traversal, insertion, and deletion.",
      content: articlesData["linked-list-basics"],
    });

    await Subtopic.create({
      title: "Fast & Slow Pointers",
      slug: "fast-slow-pointers",
      topic: linkedListChapter._id,
      order: 2,
      isFreePreview: false,
      estimatedReadTime: 10,
      summary: "Detect cycles, find middle nodes, and solve linked list problems with two pointers.",
      content: [
        { type: "heading", data: { level: 2, text: "Fast & Slow Pointer Technique (Floyd's Algorithm)" } },
        { type: "paragraph", data: { text: "Also known as Floyd's Cycle Detection Algorithm, the fast & slow pointer technique uses two pointers that move at different speeds. The slow pointer moves one step at a time; the fast pointer moves two. If there's a cycle, they will eventually meet." } },
        { type: "code", data: { language: "python", title: "Detect Cycle in Linked List", code: `def has_cycle(head):
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps

        if slow == fast:        # They met → cycle exists
            return True

    return False  # fast reached end → no cycle

def find_middle(head):
    """Find middle node — slow pointer is at middle when fast reaches end"""
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    return slow  # Middle node` } },
        { type: "keyPoints", data: { title: "Fast & Slow Pointer Patterns", points: ["Cycle detection: slow moves 1, fast moves 2 — they meet iff cycle exists", "Find middle: when fast reaches end, slow is at middle", "Palindrome check: find middle, reverse second half, compare", "Kth from end: advance fast k steps, then move both until fast hits end"] } },
        { type: "quiz", data: { question: "In Floyd's cycle detection, why does the fast pointer move 2 steps instead of 3 or more?", options: ["Moving 2 is always faster", "Moving 2 guarantees they meet without skipping over each other in a cycle", "Moving 3 would cause errors", "It's just a convention"], correctIndex: 1, explanation: "With a gap of 2 and 1 steps, the difference between pointers decreases by 1 each iteration in a cycle, guaranteeing they meet. With larger gaps, they could potentially skip past each other in certain cycle lengths." } },
      ],
    });

    // ── Chapter 3: Stacks & Queues ──
    const stacksChapter = await Topic.create({
      title: "Stacks & Queues",
      course: dsaCourse._id,
      order: 3,
    });

    await Subtopic.create({
      title: "Stack Fundamentals",
      slug: "stack-fundamentals",
      topic: stacksChapter._id,
      order: 1,
      isFreePreview: false,
      estimatedReadTime: 10,
      summary: "Learn LIFO stacks, classic problems, and the powerful monotonic stack pattern.",
      content: articlesData["stack-fundamentals"],
    });

    await Subtopic.create({
      title: "Queue & Deque",
      slug: "queue-deque",
      topic: stacksChapter._id,
      order: 2,
      isFreePreview: false,
      estimatedReadTime: 8,
      summary: "Understand FIFO queues, BFS foundations, and sliding window maximum with deque.",
      content: [
        { type: "heading", data: { level: 2, text: "Queue: First In, First Out" } },
        { type: "paragraph", data: { text: "A queue is the opposite of a stack — elements exit in the same order they entered. Think of a checkout line: first person in line is first to be served." } },
        { type: "code", data: { language: "python", title: "Queue with collections.deque", code: `from collections import deque

# Always use deque for queues in Python
# Regular list: O(n) for pop(0) — deque: O(1)
queue = deque()

queue.append(1)      # Enqueue — O(1)
queue.append(2)
queue.append(3)

front = queue[0]     # Peek — O(1)
popped = queue.popleft()  # Dequeue — O(1)

print(queue)  # deque([2, 3])

# BFS Template using queue
def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order` } },
        { type: "keyPoints", data: { title: "Queue Essentials", points: ["Always use collections.deque in Python — list.pop(0) is O(n)", "Queue = BFS backbone — level-order traversal, shortest path in unweighted graphs", "Deque (double-ended queue) supports O(1) operations on both ends", "Sliding window maximum uses a monotonic deque — O(n) total"] } },
        { type: "quiz", data: { question: "Why should you use collections.deque instead of a Python list as a queue?", options: ["deque is more memory efficient", "list.pop(0) is O(n) because it shifts all elements; deque.popleft() is O(1)", "deque supports more operations", "lists don't support queues at all"], correctIndex: 1, explanation: "Removing from the front of a Python list requires shifting all remaining elements left, making it O(n). deque uses a doubly-linked-list internally, making front removal O(1)." } },
      ],
    });

    // ── Chapter 4: Trees ──
    const treesChapter = await Topic.create({
      title: "Trees & Binary Search Trees",
      course: dsaCourse._id,
      order: 4,
    });

    await Subtopic.create({
      title: "Binary Tree Traversals",
      slug: "binary-tree-traversals",
      topic: treesChapter._id,
      order: 1,
      isFreePreview: false,
      estimatedReadTime: 12,
      summary: "Master inorder, preorder, postorder, and level-order traversals recursively and iteratively.",
      content: [
        { type: "heading", data: { level: 2, text: "Tree Traversals — The Four Patterns" } },
        { type: "paragraph", data: { text: "Traversal means visiting every node in a tree. There are 4 fundamental ways to do this, each useful for different problems. Mastering all four is essential for tree interviews." } },
        { type: "info", data: { title: "DFS vs BFS", text: "Inorder/Preorder/Postorder use Depth-First Search (go deep before wide). Level-order uses Breadth-First Search (visit level by level)." } },
        { type: "code", data: { language: "python", title: "All Four Traversals", code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# INORDER: Left → Root → Right
# Result is SORTED for BST!
def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# PREORDER: Root → Left → Right
# Great for serializing trees
def preorder(root):
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)

# POSTORDER: Left → Right → Root
# Used for deletion, evaluating expressions
def postorder(root):
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]

# LEVEL ORDER (BFS): Level by level
from collections import deque
def level_order(root):
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result` } },
        { type: "tip", data: { text: "Memorize the mnemonic: Inorder = In the middle (Left-ROOT-Right), Preorder = ROOT comes first (ROOT-Left-Right), Postorder = ROOT comes last (Left-Right-ROOT)." } },
        { type: "keyPoints", data: { title: "Tree Traversal Cheat Sheet", points: ["Inorder of BST → sorted sequence", "Preorder → useful for tree cloning/serialization", "Postorder → used for tree deletion and expression evaluation", "Level order → useful for finding shortest path, right-side view", "All four are O(n) time and O(h) space where h = tree height"] } },
        { type: "quiz", data: { question: "Which traversal of a Binary Search Tree gives elements in sorted order?", options: ["Preorder", "Inorder", "Postorder", "Level order"], correctIndex: 1, explanation: "Inorder traversal (Left → Root → Right) of a BST visits nodes in ascending sorted order, because all left children are smaller and all right children are larger than the root." } },
      ],
    });

    // ── System Design Course ──
    const systemDesignCourse = await Course.create({
      title: "System Design",
      slug: "system-design-fundamentals",
      description: "Learn how to design scalable, fault-tolerant distributed systems that handle millions of users. From load balancing to database sharding, master every concept needed to ace system design interviews at top tech companies.",
      shortDescription: "Design systems that scale to millions. Master distributed systems fundamentals.",
      coverImageUrl: null,
      tags: ["System Design", "Distributed Systems", "Scalability", "Architecture"],
      category: "Computer Science",
      level: "Advanced",
      author: instructor._id,
      isPublished: true,
      price: 1299,
      totalEnrollments: 8320,
      rating: 4.9,
      totalRatings: 2156,
      estimatedDuration: "30 hours",
      color: "from-purple-500 to-pink-500",
      icon: "BarChart3",
      whatYouWillLearn: [
        "Design systems that handle 1M+ requests per second",
        "Understand CAP theorem, consistency, and availability trade-offs",
        "Master horizontal and vertical scaling strategies",
        "Design databases: SQL vs NoSQL, sharding, replication",
        "Implement caching strategies with Redis",
        "Design real systems: URL shortener, Twitter, Netflix",
      ],
      requirements: [
        "Basic understanding of web development",
        "Familiarity with databases (SQL or NoSQL)",
        "Understanding of HTTP and REST APIs",
      ],
    });

    const sdBasicsChapter = await Topic.create({
      title: "Scalability Fundamentals",
      course: systemDesignCourse._id,
      order: 1,
    });

    await Subtopic.create({
      title: "Horizontal vs Vertical Scaling",
      slug: "horizontal-vs-vertical-scaling",
      topic: sdBasicsChapter._id,
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 8,
      summary: "Understand the two fundamental strategies for handling growing load.",
      content: [
        { type: "heading", data: { level: 2, text: "Scaling Your System" } },
        { type: "paragraph", data: { text: "When your application grows, a single server eventually hits its limits. You have two fundamental strategies to handle more traffic: scale up (vertical) or scale out (horizontal)." } },
        { type: "comparison", data: { title: "Vertical vs Horizontal Scaling", items: [{ operation: "Approach", complexity: "Vertical: Upgrade single server | Horizontal: Add more servers", note: "" }, { operation: "Cost", complexity: "Vertical: Expensive hardware | Horizontal: Commodity machines", note: "" }, { operation: "Limit", complexity: "Vertical: Physical hardware limit | Horizontal: Nearly unlimited", note: "" }, { operation: "Downtime", complexity: "Vertical: Requires downtime | Horizontal: Rolling updates", note: "" }, { operation: "Complexity", complexity: "Vertical: Simple | Horizontal: Needs load balancer, stateless design", note: "" }] } },
        { type: "info", data: { title: "The Rule of Thumb", text: "Start with vertical scaling (simpler), but design your application to be stateless from day one so you can scale horizontally when needed." } },
        { type: "keyPoints", data: { title: "Scaling Essentials", points: ["Vertical scaling (scale up): add more CPU/RAM to existing server — has hard limits", "Horizontal scaling (scale out): add more machines — practically unlimited", "Stateless services scale horizontally easily; stateful services are harder", "Load balancers distribute traffic across horizontal servers", "Start simple, measure, then scale where the bottleneck is"] } },
        { type: "quiz", data: { question: "Why does horizontal scaling require stateless services?", options: ["Stateless services use less memory", "Any server can handle any request if no state is stored locally", "Horizontal scaling only works with microservices", "Stateful services can't run on Linux"], correctIndex: 1, explanation: "With horizontal scaling, any of the N servers might handle the next request. If state is stored locally on server A, and the next request goes to server B, the session/state is lost. Stateless services store state externally (database/cache), so any server can handle any request." } },
      ],
    });

    await Subtopic.create({
      title: "Load Balancers",
      slug: "load-balancers",
      topic: sdBasicsChapter._id,
      order: 2,
      isFreePreview: false,
      estimatedReadTime: 10,
      summary: "Learn how load balancers distribute traffic and prevent single points of failure.",
      content: [
        { type: "heading", data: { level: 2, text: "Load Balancers: Traffic Distribution" } },
        { type: "paragraph", data: { text: "A load balancer sits in front of your servers and routes incoming requests to prevent any single server from being overwhelmed. It's the gateway to horizontal scaling." } },
        { type: "info", data: { title: "Algorithms", text: "Round Robin: requests go to servers in rotation. Least Connections: goes to server with fewest active connections. IP Hash: same client always goes to same server (useful for sessions)." } },
        { type: "code", data: { language: "python", title: "Simple Round Robin Load Balancer Simulation", code: `class LoadBalancer:
    def __init__(self, servers):
        self.servers = servers
        self.current = 0

    def get_server(self):
        """Round Robin — O(1)"""
        server = self.servers[self.current]
        self.current = (self.current + 1) % len(self.servers)
        return server

    def add_server(self, server):
        self.servers.append(server)

    def remove_server(self, server):
        self.servers.remove(server)

lb = LoadBalancer(["server-1", "server-2", "server-3"])
for _ in range(6):
    print(lb.get_server())
# server-1, server-2, server-3, server-1, server-2, server-3` } },
        { type: "keyPoints", data: { title: "Load Balancer Essentials", points: ["Layer 4 (Transport): routes based on IP/TCP — faster but less intelligent", "Layer 7 (Application): routes based on HTTP content — can route /api to API servers, /static to CDN", "Health checks: automatically remove unhealthy servers from rotation", "Sticky sessions: route same user to same server (conflicts with stateless design)", "Load balancer itself can be a single point of failure — use multiple LBs with DNS failover"] } },
        { type: "quiz", data: { question: "A user's shopping cart is stored in server memory. They add an item, then their next request goes to a different server. What happens?", options: ["Nothing, it works fine", "The cart is lost because the new server has no memory of previous state", "The load balancer copies state between servers", "The browser resends the cart data"], correctIndex: 1, explanation: "This is the stateful service problem. Each server has its own memory, and if requests route to different servers, local state is invisible to other servers. Fix: store sessions in a shared Redis cache, not in server memory." } },
      ],
    });

    // ── Web Dev Course ──
    const webDevCourse = await Course.create({
      title: "Full Stack Web Development",
      slug: "fullstack-web-development",
      description: "Build production-ready web applications with React, Node.js, and MongoDB. Learn modern web development from the ground up — frontend, backend, databases, authentication, deployment, and everything in between.",
      shortDescription: "React + Node.js + MongoDB. Build real projects and get hired.",
      coverImageUrl: null,
      tags: ["React", "Node.js", "MongoDB", "JavaScript", "TypeScript", "Full Stack"],
      category: "Web Development",
      level: "Beginner",
      author: instructor._id,
      isPublished: true,
      price: 799,
      totalEnrollments: 15230,
      rating: 4.7,
      totalRatings: 4521,
      estimatedDuration: "60 hours",
      color: "from-green-500 to-emerald-500",
      icon: "Globe",
      whatYouWillLearn: [
        "Build complete full-stack applications with React and Node.js",
        "Master modern JavaScript (ES6+) and TypeScript",
        "Design and build REST APIs with Express.js",
        "Work with MongoDB and Mongoose for database design",
        "Implement authentication with JWT and bcrypt",
        "Deploy applications to production with Docker and AWS",
      ],
      requirements: [
        "Basic HTML and CSS knowledge",
        "Familiarity with any programming language",
        "A computer with internet connection",
      ],
    });

    const jsChapter = await Topic.create({
      title: "JavaScript Fundamentals",
      course: webDevCourse._id,
      order: 1,
    });

    await Subtopic.create({
      title: "ES6+ Modern JavaScript",
      slug: "es6-modern-javascript",
      topic: jsChapter._id,
      order: 1,
      isFreePreview: true,
      estimatedReadTime: 15,
      summary: "Master arrow functions, destructuring, spread, promises, async/await, and more.",
      content: [
        { type: "heading", data: { level: 2, text: "Modern JavaScript (ES6+)" } },
        { type: "paragraph", data: { text: "ES6 (2015) transformed JavaScript from a quirky scripting language into a powerful, expressive language for building complex applications. These features are used in every modern codebase." } },
        { type: "code", data: { language: "javascript", title: "Destructuring & Spread", code: `// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first); // 1
console.log(rest);  // [3, 4, 5]

// Object destructuring with rename
const { name: fullName, age = 25 } = { name: "Rahul" };
console.log(fullName); // "Rahul"
console.log(age);      // 25 (default value)

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }` } },
        { type: "code", data: { language: "javascript", title: "Async/Await", code: `// The modern way to handle asynchronous code
async function fetchUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Usage
const user = await fetchUser(123);
console.log(user.name);` } },
        { type: "keyPoints", data: { title: "ES6+ Must-Know Features", points: ["Arrow functions: shorter syntax + lexical 'this' binding", "Destructuring: extract array/object values into variables elegantly", "Template literals: multi-line strings with embedded expressions `Hello ${name}`", "Async/await: write async code that reads like synchronous code", "Optional chaining: user?.address?.city — no more 'cannot read property of undefined'", "Nullish coalescing: value ?? 'default' — only falls back for null/undefined"] } },
        { type: "quiz", data: { question: "What does optional chaining (?.) protect against?", options: ["Syntax errors in code", "TypeError when accessing properties of null or undefined", "Performance issues with deep object access", "Type coercion bugs"], correctIndex: 1, explanation: "Optional chaining (user?.profile?.avatar) short-circuits and returns undefined if any intermediate value is null or undefined, instead of throwing 'Cannot read properties of null'." } },
      ],
    });

    const reactChapter = await Topic.create({
      title: "React Fundamentals",
      course: webDevCourse._id,
      order: 2,
    });

    await Subtopic.create({
      title: "React Hooks Deep Dive",
      slug: "react-hooks",
      topic: reactChapter._id,
      order: 1,
      isFreePreview: false,
      estimatedReadTime: 15,
      summary: "Master useState, useEffect, useContext, useReducer, and custom hooks.",
      content: [
        { type: "heading", data: { level: 2, text: "React Hooks — Modern State & Side Effects" } },
        { type: "paragraph", data: { text: "Hooks are functions that let you 'hook into' React state and lifecycle features from function components. They replaced class components and made React code dramatically cleaner." } },
        { type: "code", data: { language: "javascript", title: "useState and useEffect Patterns", code: `import { useState, useEffect, useCallback } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(\`/api/users/\${userId}\`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);  // Re-run when userId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user?.name}</div>;
}` } },
        { type: "tip", data: { text: "Use the dependency array in useEffect carefully. An empty [] means run once (on mount). Including variables means run when those variables change. Missing dependencies cause stale closure bugs." } },
        { type: "keyPoints", data: { title: "Hooks Cheat Sheet", points: ["useState: local component state — returns [value, setter]", "useEffect: side effects (fetch data, subscriptions) with cleanup", "useCallback: memoize functions to prevent unnecessary re-renders", "useMemo: memoize expensive computed values", "useContext: consume context without prop drilling", "Custom hooks: extract reusable stateful logic into useXxx functions"] } },
        { type: "quiz", data: { question: "When does useEffect with an empty dependency array [] run?", options: ["On every render", "Only once after the initial render (mount)", "Never", "Only when state changes"], correctIndex: 1, explanation: "useEffect with [] runs once after the component first mounts (appears in DOM). It's equivalent to componentDidMount in class components. The returned cleanup function runs on unmount." } },
      ],
    });

    // ─── Seed student_demo dashboard data ────────────────────────────────────
    const allCourses = await Course.find({});
    const dsaCourseDoc = allCourses.find((c) => c.slug === "dsa-mastery");
    const sdCourseDoc = allCourses.find((c) => c.slug === "system-design-fundamentals");
    const fsCourseDoc = allCourses.find((c) => c.slug === "fullstack-web-development");

    // Helper: get N random subtopic IDs from a course
    async function getNSubtopicIds(courseId: any, n: number) {
      const topics = await Topic.find({ course: courseId });
      const topicIds = topics.map((t) => t._id);
      const subtopics = await Subtopic.find({ topic: { $in: topicIds } }).sort({ order: 1 });
      return subtopics.slice(0, n).map((s) => s._id);
    }

    if (dsaCourseDoc && sdCourseDoc && fsCourseDoc) {
      // DSA: 29/45 completed (64%)
      const dsaTopics = await Topic.find({ course: dsaCourseDoc._id });
      const dsaTopicIds = dsaTopics.map((t) => t._id);
      const dsaTotalSubtopics = await Subtopic.countDocuments({ topic: { $in: dsaTopicIds } });
      const dsaCompleted = await getNSubtopicIds(dsaCourseDoc._id, Math.min(29, dsaTotalSubtopics));

      // SD: 10/30 completed (33%)
      const sdTopics = await Topic.find({ course: sdCourseDoc._id });
      const sdTopicIds = sdTopics.map((t) => t._id);
      const sdTotalSubtopics = await Subtopic.countDocuments({ topic: { $in: sdTopicIds } });
      const sdCompleted = await getNSubtopicIds(sdCourseDoc._id, Math.min(10, sdTotalSubtopics));

      // FS: 16/20 completed (80%)
      const fsTopics = await Topic.find({ course: fsCourseDoc._id });
      const fsTopicIds = fsTopics.map((t) => t._id);
      const fsTotalSubtopics = await Subtopic.countDocuments({ topic: { $in: fsTopicIds } });
      const fsCompleted = await getNSubtopicIds(fsCourseDoc._id, Math.min(16, fsTotalSubtopics));

      await Promise.all([
        Enrollment.create({
          user: studentUser._id,
          course: dsaCourseDoc._id,
          completedSubtopics: dsaCompleted,
          lastAccessedSubtopic: dsaCompleted[dsaCompleted.length - 1] || null,
          progress: dsaTotalSubtopics > 0 ? Math.round((dsaCompleted.length / dsaTotalSubtopics) * 100) : 64,
          isCompleted: false,
        }),
        Enrollment.create({
          user: studentUser._id,
          course: sdCourseDoc._id,
          completedSubtopics: sdCompleted,
          lastAccessedSubtopic: sdCompleted[sdCompleted.length - 1] || null,
          progress: sdTotalSubtopics > 0 ? Math.round((sdCompleted.length / sdTotalSubtopics) * 100) : 33,
          isCompleted: false,
        }),
        Enrollment.create({
          user: studentUser._id,
          course: fsCourseDoc._id,
          completedSubtopics: fsCompleted,
          lastAccessedSubtopic: fsCompleted[fsCompleted.length - 1] || null,
          progress: fsTotalSubtopics > 0 ? Math.round((fsCompleted.length / fsTotalSubtopics) * 100) : 80,
          isCompleted: false,
        }),
      ]);

      // Update totalEnrollments counter
      await Promise.all([
        Course.findByIdAndUpdate(dsaCourseDoc._id, { $inc: { totalEnrollments: 1 } }),
        Course.findByIdAndUpdate(sdCourseDoc._id, { $inc: { totalEnrollments: 1 } }),
        Course.findByIdAndUpdate(fsCourseDoc._id, { $inc: { totalEnrollments: 1 } }),
      ]);
    }

    // Build activity calendar for student_demo (past 30 days, mostly active)
    const today = new Date();
    const calendarDays: { date: string; level: number }[] = [];
    const activeDays = [1,2,4,5,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,28,29]; // days ago that were active
    for (let d = 30; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      const dateStr = date.toISOString().split("T")[0];
      const isActive = activeDays.includes(d);
      const level = isActive ? (d % 3 === 0 ? 3 : d % 2 === 0 ? 2 : 1) : 0;
      calendarDays.push({ date: dateStr, level });
    }

    // Create UserProfile for student_demo (full stats like in screenshots)
    await UserProfile.create({
      user: studentUser._id,
      problemsSolved: 156,
      currentStreak: 21,
      longestStreak: 45,
      contestRating: 1654,
      codingTimeHours: 42.5,
      activityCalendar: calendarDays,
      recentActivity: [
        { action: "Solved 'Merge Intervals'",    activityType: "solved",    createdAt: new Date(Date.now() - 2 * 3600000) },
        { action: "Completed 'Arrays Module'",   activityType: "completed", createdAt: new Date(Date.now() - 5 * 3600000) },
        { action: "Earned '7-Day Streak' badge", activityType: "badge",     createdAt: new Date(Date.now() - 24 * 3600000) },
        { action: "Attempted 'LRU Cache'",       activityType: "attempted", createdAt: new Date(Date.now() - 48 * 3600000) },
        { action: "Enrolled in DSA Mastery",     activityType: "enrolled",  createdAt: new Date(Date.now() - 72 * 3600000) },
      ],
      achievements: [
        { id: "first_blood",   title: "First Blood",    description: "Solve your first problem", achievementType: "problem", unlocked: true,  unlockedAt: new Date(Date.now() - 30 * 86400000) },
        { id: "week_warrior",  title: "Week Warrior",   description: "7-day streak",             achievementType: "streak",  unlocked: true,  unlockedAt: new Date(Date.now() - 14 * 86400000) },
        { id: "problem_solver",title: "Problem Solver", description: "Solve 100 problems",       achievementType: "problem", unlocked: false },
        { id: "top_performer", title: "Top Performer",  description: "Reach top 10",             achievementType: "rank",    unlocked: false },
      ],
    });

    console.log("Created student_demo profile & enrollments");

    // ─── Seed Problems for DSA Course ─────────────────────────────────────────────
    const dsaProblems = [
      // ── Arrays ──
      {
        title: "Two Sum", slug: "two-sum", difficulty: "Easy", frequency: 5,
        topicTag: "Arrays", order: 1, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/two-sum/",
        description: `Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input has **exactly one solution**, and you may not use the same element twice. You can return the answer in any order.

**Constraints:**
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- Only one valid answer exists`,
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9, so return [0, 1]." },
          { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6, so return [1, 2]." },
        ],
        testCases: [
          { input: "[2,7,11,15]\n9", expectedOutput: "[0, 1]" },
          { input: "[3,2,4]\n6", expectedOutput: "[1, 2]" },
        ],
        starterCode: {
          python: `def two_sum(nums, target):
    # Your solution here
    # Hint: Use a hash map for O(n) time
    pass

# Tests
print(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]
print(two_sum([3, 2, 4], 6))        # Expected: [1, 2]
print(two_sum([3, 3], 6))           # Expected: [0, 1]`,
          javascript: `function twoSum(nums, target) {
    // Your solution here
    // Hint: Use a Map for O(n) time
}

// Tests
console.log(twoSum([2, 7, 11, 15], 9));  // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6));        // Expected: [1, 2]
console.log(twoSum([3, 3], 6));           // Expected: [0, 1]`,
          cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your solution here
    return {};
}

int main() {
    vector<int> n1 = {2, 7, 11, 15};
    auto r1 = twoSum(n1, 9);
    cout << "[" << r1[0] << ", " << r1[1] << "]" << endl; // [0, 1]

    vector<int> n2 = {3, 2, 4};
    auto r2 = twoSum(n2, 6);
    cout << "[" << r2[0] << ", " << r2[1] << "]" << endl; // [1, 2]
    return 0;
}`,
          java: `import java.util.*;
public class Main {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[]{};
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9)));
        System.out.println(Arrays.toString(sol.twoSum(new int[]{3,2,4}, 6)));
    }
}`,
        },
      },
      {
        title: "Move Zeroes", slug: "move-zeroes", difficulty: "Easy", frequency: 5,
        topicTag: "Arrays", order: 2, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/move-zeroes/",
        description: `Given an integer array \`nums\`, move all \`0\`s to the end while maintaining the relative order of the non-zero elements.

**Note:** You must do this in-place without making a copy of the array.

**Constraints:**
- 1 ≤ nums.length ≤ 10⁴
- -2³¹ ≤ nums[i] ≤ 2³¹ - 1`,
        examples: [
          { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]", explanation: "" },
          { input: "nums = [0]", output: "[0]", explanation: "" },
        ],
        testCases: [
          { input: "[0,1,0,3,12]", expectedOutput: "[1, 3, 12, 0, 0]" },
          { input: "[0]", expectedOutput: "[0]" },
        ],
        starterCode: {
          python: `def move_zeroes(nums):
    # Modify nums in-place, do not return anything
    # Hint: Use two pointers
    pass

# Tests
nums1 = [0, 1, 0, 3, 12]
move_zeroes(nums1)
print(nums1)  # Expected: [1, 3, 12, 0, 0]

nums2 = [0]
move_zeroes(nums2)
print(nums2)  # Expected: [0]`,
          javascript: `function moveZeroes(nums) {
    // Modify nums in-place
    // Hint: Two pointers approach
}

// Tests
let nums1 = [0, 1, 0, 3, 12];
moveZeroes(nums1);
console.log(nums1);  // Expected: [1, 3, 12, 0, 0]

let nums2 = [0];
moveZeroes(nums2);
console.log(nums2);  // Expected: [0]`,
          cpp: `#include <bits/stdc++.h>
using namespace std;

void moveZeroes(vector<int>& nums) {
    // Modify in-place using two pointers
}

int main() {
    vector<int> n1 = {0, 1, 0, 3, 12};
    moveZeroes(n1);
    for (int x : n1) cout << x << " "; cout << endl; // 1 3 12 0 0
    return 0;
}`,
          java: `import java.util.*;
public class Main {
    public void moveZeroes(int[] nums) {
        // Modify in-place
    }
    public static void main(String[] args) {
        Main sol = new Main();
        int[] n = {0, 1, 0, 3, 12};
        sol.moveZeroes(n);
        System.out.println(Arrays.toString(n)); // [1, 3, 12, 0, 0]
    }
}`,
        },
      },
      {
        title: "Maximum Subarray", slug: "maximum-subarray", difficulty: "Medium", frequency: 5,
        topicTag: "Arrays", order: 3, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
        description: `Given an integer array \`nums\`, find the **subarray** with the largest sum, and return its sum.

**Constraints:**
- 1 ≤ nums.length ≤ 10⁵
- -10⁴ ≤ nums[i] ≤ 10⁴

**Follow up:** If you've solved the O(n) solution, try using **Kadane's algorithm** to understand why it works.`,
        examples: [
          { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
          { input: "nums = [1]", output: "1", explanation: "" },
          { input: "nums = [5,4,-1,7,8]", output: "23", explanation: "" },
        ],
        testCases: [
          { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
          { input: "[5,4,-1,7,8]", expectedOutput: "23" },
        ],
        starterCode: {
          python: `def max_subarray(nums):
    # Hint: Kadane's Algorithm - track current and global max
    pass

# Tests
print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # Expected: 6
print(max_subarray([1]))                                  # Expected: 1
print(max_subarray([5, 4, -1, 7, 8]))                    # Expected: 23`,
          javascript: `function maxSubArray(nums) {
    // Hint: Kadane's Algorithm
}

// Tests
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));  // Expected: 6
console.log(maxSubArray([1]));                                  // Expected: 1
console.log(maxSubArray([5, 4, -1, 7, 8]));                    // Expected: 23`,
          cpp: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Kadane's Algorithm
    return 0;
}

int main() {
    vector<int> n1 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << maxSubArray(n1) << endl; // 6
    vector<int> n2 = {5, 4, -1, 7, 8};
    cout << maxSubArray(n2) << endl; // 23
    return 0;
}`,
          java: `import java.util.*;
public class Main {
    public int maxSubArray(int[] nums) {
        // Kadane's Algorithm
        return 0;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // 6
        System.out.println(sol.maxSubArray(new int[]{5,4,-1,7,8})); // 23
    }
}`,
        },
      },
      {
        title: "Product of Array Except Self", slug: "product-except-self", difficulty: "Medium", frequency: 4,
        topicTag: "Arrays", order: 4, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/",
        description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of nums is **guaranteed** to fit in a 32-bit integer.

You must write an algorithm that runs in **O(n)** time and without using the division operation.

**Constraints:**
- 2 ≤ nums.length ≤ 10⁵
- -30 ≤ nums[i] ≤ 30`,
        examples: [
          { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "" },
          { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]", explanation: "" },
        ],
        testCases: [
          { input: "[1,2,3,4]", expectedOutput: "[24, 12, 8, 6]" },
          { input: "[-1,1,0,-3,3]", expectedOutput: "[0, 0, 9, 0, 0]" },
        ],
        starterCode: {
          python: `def product_except_self(nums):
    # Hint: Use prefix and suffix products (no division!)
    pass

# Tests
print(product_except_self([1, 2, 3, 4]))         # Expected: [24, 12, 8, 6]
print(product_except_self([-1, 1, 0, -3, 3]))    # Expected: [0, 0, 9, 0, 0]`,
          javascript: `function productExceptSelf(nums) {
    // Hint: Prefix and suffix products
}

console.log(productExceptSelf([1, 2, 3, 4]));       // [24, 12, 8, 6]
console.log(productExceptSelf([-1, 1, 0, -3, 3]));  // [0, 0, 9, 0, 0]`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> productExceptSelf(vector<int>& nums) {
    // Prefix and suffix products
    return {};
}
int main() {
    vector<int> n = {1, 2, 3, 4};
    auto r = productExceptSelf(n);
    for (int x : r) cout << x << " "; cout << endl; // 24 12 8 6
    return 0;
}`,
          java: `import java.util.*;
public class Main {
    public int[] productExceptSelf(int[] nums) {
        return new int[]{};
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(Arrays.toString(sol.productExceptSelf(new int[]{1,2,3,4}))); // [24, 12, 8, 6]
    }
}`,
        },
      },

      // ── Two Pointers ──
      {
        title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy", frequency: 4,
        topicTag: "Two Pointers", order: 1, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
        description: `A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

**Constraints:**
- 1 ≤ s.length ≤ 2 * 10⁵
- s consists only of printable ASCII characters`,
        examples: [
          { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
          { input: 's = "race a car"', output: "false", explanation: '"raceacar" is not a palindrome.' },
        ],
        testCases: [
          { input: "A man, a plan, a canal: Panama", expectedOutput: "true" },
          { input: "race a car", expectedOutput: "false" },
        ],
        starterCode: {
          python: `def is_palindrome(s):
    # Hint: Two pointers from both ends, skip non-alphanumeric
    pass

# Tests
print(is_palindrome("A man, a plan, a canal: Panama"))  # True
print(is_palindrome("race a car"))                        # False
print(is_palindrome(" "))                                 # True`,
          javascript: `function isPalindrome(s) {
    // Two pointers from both ends
}

console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car"));                      // false`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
bool isPalindrome(string s) {
    // Two pointers
    return false;
}
int main() {
    cout << isPalindrome("A man, a plan, a canal: Panama") << endl; // 1
    cout << isPalindrome("race a car") << endl; // 0
    return 0;
}`,
          java: `public class Main {
    public boolean isPalindrome(String s) {
        return false;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.isPalindrome("A man, a plan, a canal: Panama")); // true
        System.out.println(sol.isPalindrome("race a car")); // false
    }
}`,
        },
      },
      {
        title: "Container With Most Water", slug: "container-with-most-water", difficulty: "Medium", frequency: 4,
        topicTag: "Two Pointers", order: 2, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/container-with-most-water/",
        description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the i-th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the **maximum amount of water** a container can store.

**Constraints:**
- n == height.length
- 2 ≤ n ≤ 10⁵
- 0 ≤ height[i] ≤ 10⁴`,
        examples: [
          { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Lines at index 1 (h=8) and 8 (h=7): area = min(8,7) × (8-1) = 49." },
          { input: "height = [1,1]", output: "1", explanation: "" },
        ],
        testCases: [
          { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
          { input: "[1,1]", expectedOutput: "1" },
        ],
        starterCode: {
          python: `def max_area(height):
    # Hint: Two pointers — always move the shorter line inward
    pass

# Tests
print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))  # Expected: 49
print(max_area([1, 1]))                           # Expected: 1`,
          javascript: `function maxArea(height) {
    // Two pointers approach
}

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1]));                          // 1`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int maxArea(vector<int>& height) {
    return 0;
}
int main() {
    vector<int> h = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    cout << maxArea(h) << endl; // 49
    return 0;
}`,
          java: `public class Main {
    public int maxArea(int[] height) {
        return 0;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // 49
    }
}`,
        },
      },
      {
        title: "3Sum", slug: "three-sum", difficulty: "Medium", frequency: 5,
        topicTag: "Two Pointers", order: 3, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/3sum/",
        description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

The solution set must **not contain duplicate triplets**.

**Constraints:**
- 3 ≤ nums.length ≤ 3000
- -10⁵ ≤ nums[i] ≤ 10⁵`,
        examples: [
          { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "" },
          { input: "nums = [0,1,1]", output: "[]", explanation: "" },
          { input: "nums = [0,0,0]", output: "[[0,0,0]]", explanation: "" },
        ],
        testCases: [
          { input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]" },
          { input: "[0,0,0]", expectedOutput: "[[0,0,0]]" },
        ],
        starterCode: {
          python: `def three_sum(nums):
    # Hint: Sort first, then fix one element and use two pointers for the rest
    pass

# Tests
print(three_sum([-1, 0, 1, 2, -1, -4]))  # Expected: [[-1,-1,2],[-1,0,1]]
print(three_sum([0, 0, 0]))               # Expected: [[0,0,0]]`,
          javascript: `function threeSum(nums) {
    // Sort, then fix one + two pointers
}

console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]
console.log(threeSum([0, 0, 0]));               // [[0,0,0]]`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> threeSum(vector<int>& nums) {
    return {};
}
int main() {
    vector<int> n = {-1, 0, 1, 2, -1, -4};
    auto r = threeSum(n);
    for (auto& t : r) { for (int x : t) cout << x << " "; cout << endl; }
    return 0;
}`,
          java: `import java.util.*;
public class Main {
    public List<List<Integer>> threeSum(int[] nums) {
        return new ArrayList<>();
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.threeSum(new int[]{-1,0,1,2,-1,-4}));
    }
}`,
        },
      },

      // ── Sliding Window ──
      {
        title: "Longest Substring Without Repeating Characters", slug: "longest-substring-no-repeat",
        difficulty: "Medium", frequency: 5, topicTag: "Sliding Window", order: 1, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.

**Constraints:**
- 0 ≤ s.length ≤ 5 * 10⁴
- s consists of English letters, digits, symbols and spaces`,
        examples: [
          { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
          { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
          { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with the length of 3.' },
        ],
        testCases: [
          { input: "abcabcbb", expectedOutput: "3" },
          { input: "pwwkew", expectedOutput: "3" },
        ],
        starterCode: {
          python: `def length_of_longest_substring(s):
    # Hint: Sliding window with a set or hash map
    pass

# Tests
print(length_of_longest_substring("abcabcbb"))  # Expected: 3
print(length_of_longest_substring("bbbbb"))      # Expected: 1
print(length_of_longest_substring("pwwkew"))     # Expected: 3`,
          javascript: `function lengthOfLongestSubstring(s) {
    // Sliding window with Map
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("pwwkew"));   // 3`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int lengthOfLongestSubstring(string s) {
    return 0;
}
int main() {
    cout << lengthOfLongestSubstring("abcabcbb") << endl; // 3
    cout << lengthOfLongestSubstring("pwwkew") << endl;   // 3
    return 0;
}`,
          java: `public class Main {
    public int lengthOfLongestSubstring(String s) {
        return 0;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.lengthOfLongestSubstring("abcabcbb")); // 3
        System.out.println(sol.lengthOfLongestSubstring("pwwkew"));   // 3
    }
}`,
        },
      },
      {
        title: "Minimum Window Substring", slug: "minimum-window-substring",
        difficulty: "Hard", frequency: 4, topicTag: "Sliding Window", order: 2, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
        description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.

**Constraints:**
- m == s.length, n == t.length
- 1 ≤ m, n ≤ 10⁵`,
        examples: [
          { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: "The minimum window substring is BANC." },
          { input: 's = "a", t = "a"', output: '"a"', explanation: "" },
        ],
        testCases: [
          { input: "ADOBECODEBANC\nABC", expectedOutput: "BANC" },
          { input: "a\na", expectedOutput: "a" },
        ],
        starterCode: {
          python: `def min_window(s, t):
    # Hint: Sliding window with two frequency maps and a 'have/need' counter
    pass

# Tests
print(min_window("ADOBECODEBANC", "ABC"))  # Expected: "BANC"
print(min_window("a", "a"))                # Expected: "a"
print(min_window("a", "aa"))               # Expected: ""`,
          javascript: `function minWindow(s, t) {
    // Sliding window with frequency maps
}

console.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
console.log(minWindow("a", "a"));               // "a"`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
string minWindow(string s, string t) {
    return "";
}
int main() {
    cout << minWindow("ADOBECODEBANC", "ABC") << endl; // BANC
    return 0;
}`,
          java: `public class Main {
    public String minWindow(String s, String t) {
        return "";
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.minWindow("ADOBECODEBANC", "ABC")); // BANC
    }
}`,
        },
      },

      // ── Stacks ──
      {
        title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", frequency: 5,
        topicTag: "Stacks", order: 1, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
        description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is **valid**.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Constraints:**
- 1 ≤ s.length ≤ 10⁴
- s consists of parentheses only \`'()[]{}''\``,
        examples: [
          { input: 's = "()"', output: "true", explanation: "" },
          { input: 's = "()[]{}"', output: "true", explanation: "" },
          { input: 's = "(]"', output: "false", explanation: "" },
        ],
        testCases: [
          { input: "()", expectedOutput: "true" },
          { input: "()[]{}", expectedOutput: "true" },
          { input: "(]", expectedOutput: "false" },
        ],
        starterCode: {
          python: `def is_valid(s):
    # Hint: Use a stack — push open brackets, pop and check on close brackets
    pass

# Tests
print(is_valid("()"))      # True
print(is_valid("()[]{}"))  # True
print(is_valid("(]"))      # False
print(is_valid("([)]"))    # False`,
          javascript: `function isValid(s) {
    // Stack approach
}

console.log(isValid("()"));      // true
console.log(isValid("()[]{}"));  // true
console.log(isValid("(]"));      // false`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
bool isValid(string s) {
    return false;
}
int main() {
    cout << isValid("()") << endl;     // 1
    cout << isValid("()[]{}") << endl; // 1
    cout << isValid("(]") << endl;     // 0
    return 0;
}`,
          java: `import java.util.*;
public class Main {
    public boolean isValid(String s) {
        return false;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.isValid("()"));     // true
        System.out.println(sol.isValid("()[]{}")); // true
        System.out.println(sol.isValid("(]"));     // false
    }
}`,
        },
      },
      {
        title: "Daily Temperatures", slug: "daily-temperatures", difficulty: "Medium", frequency: 4,
        topicTag: "Stacks", order: 2, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/",
        description: `Given an array of integers \`temperatures\` representing the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the i-th day to get a warmer temperature. If there is no future day for which this is possible, keep \`answer[i] == 0\`.

**Constraints:**
- 1 ≤ temperatures.length ≤ 10⁵
- 30 ≤ temperatures[i] ≤ 100`,
        examples: [
          { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]", explanation: "" },
          { input: "temperatures = [30,60,90]", output: "[1,1,0]", explanation: "" },
        ],
        testCases: [
          { input: "[73,74,75,71,69,72,76,73]", expectedOutput: "[1, 1, 4, 2, 1, 1, 0, 0]" },
          { input: "[30,60,90]", expectedOutput: "[1, 1, 0]" },
        ],
        starterCode: {
          python: `def daily_temperatures(temperatures):
    # Hint: Monotonic stack — store indices of temperatures seen so far
    pass

# Tests
print(daily_temperatures([73,74,75,71,69,72,76,73]))  # [1, 1, 4, 2, 1, 1, 0, 0]
print(daily_temperatures([30,60,90]))                  # [1, 1, 0]`,
          javascript: `function dailyTemperatures(temperatures) {
    // Monotonic stack
}

console.log(dailyTemperatures([73,74,75,71,69,72,76,73])); // [1,1,4,2,1,1,0,0]
console.log(dailyTemperatures([30,60,90]));                 // [1,1,0]`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> dailyTemperatures(vector<int>& t) {
    return {};
}
int main() {
    vector<int> t = {73,74,75,71,69,72,76,73};
    auto r = dailyTemperatures(t);
    for (int x : r) cout << x << " "; cout << endl; // 1 1 4 2 1 1 0 0
    return 0;
}`,
          java: `import java.util.*;
public class Main {
    public int[] dailyTemperatures(int[] temperatures) {
        return new int[]{};
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(Arrays.toString(sol.dailyTemperatures(new int[]{73,74,75,71,69,72,76,73})));
    }
}`,
        },
      },

      // ── Binary Search ──
      {
        title: "Binary Search", slug: "binary-search", difficulty: "Easy", frequency: 4,
        topicTag: "Binary Search", order: 1, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/binary-search/",
        description: `Given an array of integers \`nums\` which is **sorted in ascending order**, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.

**Constraints:**
- 1 ≤ nums.length ≤ 10⁴
- -10⁴ < nums[i], target < 10⁴
- All integers in nums are unique
- nums is sorted in ascending order`,
        examples: [
          { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." },
          { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1." },
        ],
        testCases: [
          { input: "[-1,0,3,5,9,12]\n9", expectedOutput: "4" },
          { input: "[-1,0,3,5,9,12]\n2", expectedOutput: "-1" },
        ],
        starterCode: {
          python: `def search(nums, target):
    # Classic binary search — O(log n)
    pass

# Tests
print(search([-1, 0, 3, 5, 9, 12], 9))   # Expected: 4
print(search([-1, 0, 3, 5, 9, 12], 2))   # Expected: -1`,
          javascript: `function search(nums, target) {
    // Binary search — O(log n)
}

console.log(search([-1, 0, 3, 5, 9, 12], 9));  // 4
console.log(search([-1, 0, 3, 5, 9, 12], 2));  // -1`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int search(vector<int>& nums, int target) {
    return -1;
}
int main() {
    vector<int> n = {-1, 0, 3, 5, 9, 12};
    cout << search(n, 9) << endl;  // 4
    cout << search(n, 2) << endl;  // -1
    return 0;
}`,
          java: `public class Main {
    public int search(int[] nums, int target) {
        return -1;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.search(new int[]{-1,0,3,5,9,12}, 9)); // 4
        System.out.println(sol.search(new int[]{-1,0,3,5,9,12}, 2)); // -1
    }
}`,
        },
      },
      {
        title: "Search in Rotated Sorted Array", slug: "search-rotated-sorted",
        difficulty: "Medium", frequency: 4, topicTag: "Binary Search", order: 2, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values). Prior to being passed to your function, nums is possibly **rotated** at an unknown pivot index.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the **index** of target if it is in nums, or \`-1\` if it is not in nums. Must run in **O(log n)** time.

**Constraints:**
- 1 ≤ nums.length ≤ 5000
- All values of nums are unique`,
        examples: [
          { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "" },
          { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1", explanation: "" },
        ],
        testCases: [
          { input: "[4,5,6,7,0,1,2]\n0", expectedOutput: "4" },
          { input: "[4,5,6,7,0,1,2]\n3", expectedOutput: "-1" },
        ],
        starterCode: {
          python: `def search(nums, target):
    # Hint: Modified binary search — determine which half is sorted
    pass

# Tests
print(search([4, 5, 6, 7, 0, 1, 2], 0))   # Expected: 4
print(search([4, 5, 6, 7, 0, 1, 2], 3))   # Expected: -1
print(search([1], 0))                        # Expected: -1`,
          javascript: `function search(nums, target) {
    // Modified binary search
}

console.log(search([4, 5, 6, 7, 0, 1, 2], 0));  // 4
console.log(search([4, 5, 6, 7, 0, 1, 2], 3));  // -1`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int search(vector<int>& nums, int target) {
    return -1;
}
int main() {
    vector<int> n = {4, 5, 6, 7, 0, 1, 2};
    cout << search(n, 0) << endl;  // 4
    cout << search(n, 3) << endl;  // -1
    return 0;
}`,
          java: `public class Main {
    public int search(int[] nums, int target) {
        return -1;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.search(new int[]{4,5,6,7,0,1,2}, 0)); // 4
        System.out.println(sol.search(new int[]{4,5,6,7,0,1,2}, 3)); // -1
    }
}`,
        },
      },

      // ── Dynamic Programming ──
      {
        title: "Climbing Stairs", slug: "climbing-stairs", difficulty: "Easy", frequency: 5,
        topicTag: "Dynamic Programming", order: 1, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
        description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?

**Constraints:**
- 1 ≤ n ≤ 45

**Hint:** This is essentially the Fibonacci sequence. Think about what choices you have at each step.`,
        examples: [
          { input: "n = 2", output: "2", explanation: "Two ways: 1+1 or 2." },
          { input: "n = 3", output: "3", explanation: "Three ways: 1+1+1, 1+2, 2+1." },
        ],
        testCases: [
          { input: "2", expectedOutput: "2" },
          { input: "3", expectedOutput: "3" },
          { input: "10", expectedOutput: "89" },
        ],
        starterCode: {
          python: `def climb_stairs(n):
    # Hint: dp[i] = dp[i-1] + dp[i-2] (Fibonacci pattern)
    pass

# Tests
print(climb_stairs(2))   # Expected: 2
print(climb_stairs(3))   # Expected: 3
print(climb_stairs(10))  # Expected: 89`,
          javascript: `function climbStairs(n) {
    // Fibonacci pattern with DP
}

console.log(climbStairs(2));   // 2
console.log(climbStairs(3));   // 3
console.log(climbStairs(10));  // 89`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int climbStairs(int n) {
    return 0;
}
int main() {
    cout << climbStairs(2) << endl;  // 2
    cout << climbStairs(3) << endl;  // 3
    cout << climbStairs(10) << endl; // 89
    return 0;
}`,
          java: `public class Main {
    public int climbStairs(int n) {
        return 0;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.climbStairs(2));  // 2
        System.out.println(sol.climbStairs(3));  // 3
        System.out.println(sol.climbStairs(10)); // 89
    }
}`,
        },
      },
      {
        title: "House Robber", slug: "house-robber", difficulty: "Medium", frequency: 4,
        topicTag: "Dynamic Programming", order: 2, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/house-robber/",
        description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint stopping you from robbing each of them is that **adjacent houses have security systems connected** — robbing two adjacent houses will alert the police.

Given an integer array \`nums\` representing the amount of money at each house, return the **maximum amount of money you can rob** without alerting the police.

**Constraints:**
- 1 ≤ nums.length ≤ 100
- 0 ≤ nums[i] ≤ 400`,
        examples: [
          { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob houses 1 and 3. 1 + 3 = 4." },
          { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob houses 1, 3, and 5. 2 + 9 + 1 = 12." },
        ],
        testCases: [
          { input: "[1,2,3,1]", expectedOutput: "4" },
          { input: "[2,7,9,3,1]", expectedOutput: "12" },
        ],
        starterCode: {
          python: `def rob(nums):
    # Hint: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    pass

# Tests
print(rob([1, 2, 3, 1]))     # Expected: 4
print(rob([2, 7, 9, 3, 1]))  # Expected: 12`,
          javascript: `function rob(nums) {
    // DP: at each house, choose rob or skip
}

console.log(rob([1, 2, 3, 1]));     // 4
console.log(rob([2, 7, 9, 3, 1]));  // 12`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int rob(vector<int>& nums) {
    return 0;
}
int main() {
    vector<int> n1 = {1, 2, 3, 1};
    cout << rob(n1) << endl; // 4
    vector<int> n2 = {2, 7, 9, 3, 1};
    cout << rob(n2) << endl; // 12
    return 0;
}`,
          java: `public class Main {
    public int rob(int[] nums) {
        return 0;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.rob(new int[]{1,2,3,1}));    // 4
        System.out.println(sol.rob(new int[]{2,7,9,3,1})); // 12
    }
}`,
        },
      },
      {
        title: "Coin Change", slug: "coin-change", difficulty: "Medium", frequency: 4,
        topicTag: "Dynamic Programming", order: 3, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/coin-change/",
        description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the **fewest number of coins** that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an **infinite number** of each kind of coin.

**Constraints:**
- 1 ≤ coins.length ≤ 12
- 1 ≤ coins[i] ≤ 2³¹ - 1
- 0 ≤ amount ≤ 10⁴`,
        examples: [
          { input: "coins = [1,5,2], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1." },
          { input: "coins = [2], amount = 3", output: "-1", explanation: "" },
        ],
        testCases: [
          { input: "[1,5,2]\n11", expectedOutput: "3" },
          { input: "[2]\n3", expectedOutput: "-1" },
        ],
        starterCode: {
          python: `def coin_change(coins, amount):
    # Hint: Bottom-up DP. dp[i] = min coins to make amount i
    pass

# Tests
print(coin_change([1, 5, 2], 11))  # Expected: 3
print(coin_change([2], 3))          # Expected: -1
print(coin_change([1], 0))          # Expected: 0`,
          javascript: `function coinChange(coins, amount) {
    // Bottom-up DP
}

console.log(coinChange([1, 5, 2], 11));  // 3
console.log(coinChange([2], 3));          // -1`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int coinChange(vector<int>& coins, int amount) {
    return -1;
}
int main() {
    vector<int> c = {1, 5, 2};
    cout << coinChange(c, 11) << endl; // 3
    vector<int> c2 = {2};
    cout << coinChange(c2, 3) << endl;  // -1
    return 0;
}`,
          java: `public class Main {
    public int coinChange(int[] coins, int amount) {
        return -1;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.coinChange(new int[]{1,5,2}, 11)); // 3
        System.out.println(sol.coinChange(new int[]{2}, 3));       // -1
    }
}`,
        },
      },

      // ── Graphs ──
      {
        title: "Number of Islands", slug: "number-of-islands", difficulty: "Medium", frequency: 5,
        topicTag: "Graphs", order: 1, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
        description: `Given an \`m x n\` 2D binary grid where \`'1'\` represents land and \`'0'\` represents water, return the **number of islands**.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.

**Constraints:**
- m == grid.length, n == grid[i].length
- 1 ≤ m, n ≤ 300
- grid[i][j] is \`'0'\` or \`'1'\``,
        examples: [
          { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1", explanation: "" },
          { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3", explanation: "" },
        ],
        testCases: [
          { input: '1110\n1101\n1100\n0000', expectedOutput: "1" },
          { input: '1100\n1100\n0010\n0011', expectedOutput: "3" },
        ],
        starterCode: {
          python: `def num_islands(grid):
    # Hint: DFS/BFS — sink each island as you find it (change '1' to '0')
    pass

# Tests
grid1 = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]
print(num_islands(grid1))  # Expected: 1

grid2 = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]
print(num_islands(grid2))  # Expected: 3`,
          javascript: `function numIslands(grid) {
    // DFS — sink visited islands
}

const grid1 = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]];
console.log(numIslands(grid1));  // 1

const grid2 = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]];
console.log(numIslands(grid2));  // 3`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int numIslands(vector<vector<char>>& grid) {
    return 0;
}
int main() {
    vector<vector<char>> g = {{'1','1','0','0','0'},{'1','1','0','0','0'},
                               {'0','0','1','0','0'},{'0','0','0','1','1'}};
    cout << numIslands(g) << endl; // 3
    return 0;
}`,
          java: `public class Main {
    public int numIslands(char[][] grid) {
        return 0;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        char[][] g = {{'1','1','0','0','0'},{'1','1','0','0','0'},
                      {'0','0','1','0','0'},{'0','0','0','1','1'}};
        System.out.println(sol.numIslands(g)); // 3
    }
}`,
        },
      },
      {
        title: "Course Schedule", slug: "course-schedule", difficulty: "Medium", frequency: 4,
        topicTag: "Graphs", order: 2, course: dsaCourse._id,
        leetcodeUrl: "https://leetcode.com/problems/course-schedule/",
        description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a_i, b_i]\` indicates that you must take course \`b_i\` first if you want to take course \`a_i\`.

Return \`true\` if you can finish all courses. Otherwise, return \`false\`.

**Constraints:**
- 1 ≤ numCourses ≤ 2000
- 0 ≤ prerequisites.length ≤ 5000`,
        examples: [
          { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take course 0 first, then course 1." },
          { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "Cycle detected — cannot finish." },
        ],
        testCases: [
          { input: "2\n[[1,0]]", expectedOutput: "true" },
          { input: "2\n[[1,0],[0,1]]", expectedOutput: "false" },
        ],
        starterCode: {
          python: `def can_finish(numCourses, prerequisites):
    # Hint: Topological sort (Kahn's or DFS cycle detection)
    pass

# Tests
print(can_finish(2, [[1, 0]]))          # Expected: True
print(can_finish(2, [[1, 0], [0, 1]]))  # Expected: False`,
          javascript: `function canFinish(numCourses, prerequisites) {
    // Topological sort — detect cycle
}

console.log(canFinish(2, [[1, 0]]));          // true
console.log(canFinish(2, [[1, 0], [0, 1]]));  // false`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    return false;
}
int main() {
    vector<vector<int>> p1 = {{1, 0}};
    cout << canFinish(2, p1) << endl;  // 1
    vector<vector<int>> p2 = {{1, 0}, {0, 1}};
    cout << canFinish(2, p2) << endl;  // 0
    return 0;
}`,
          java: `import java.util.*;
public class Main {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        return false;
    }
    public static void main(String[] args) {
        Main sol = new Main();
        System.out.println(sol.canFinish(2, new int[][]{{1,0}}));       // true
        System.out.println(sol.canFinish(2, new int[][]{{1,0},{0,1}})); // false
    }
}`,
        },
      },
    ];

    await Promise.all(dsaProblems.map((p) => Problem.create(p)));
    console.log(`✅ Created ${dsaProblems.length} practice problems`);

    console.log("Seed complete!");
    console.log(`
  ✅ Created courses:
    - DSA Mastery (slug: dsa-mastery)
    - System Design (slug: system-design-fundamentals)
    - Full Stack Web Dev (slug: fullstack-web-development)

  ✅ Login credentials:
    - Instructor: instructor@beyondbasic.in / password123
    - Admin: admin@beyondbasic.in / password123
    - Student: student@beyondbasic.in / password123
    `);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Seed failed:", err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();

import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import Problem from "./models/problem.model.ts";
import Contest from "./models/contest.model.ts";

dotenv.config();

// ── Problems ──────────────────────────────────────────────────────────────────

const problems = [
  {
    title: "Two Sum",
    slug:  "two-sum-contest",
    difficulty: "Easy" as const,
    frequency: 5,
    topicTag: "Arrays",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "",
      },
    ],
    testCases: [
      { input: "4\n2 7 11 15\n9",  expectedOutput: "0 1", isHidden: false },
      { input: "3\n3 2 4\n6",       expectedOutput: "1 2", isHidden: false },
      { input: "2\n3 3\n6",         expectedOutput: "0 1", isHidden: false },
      { input: "5\n1 5 3 8 2\n10",  expectedOutput: "1 4", isHidden: true  },
      { input: "6\n0 4 3 0 2 1\n0", expectedOutput: "0 3", isHidden: true  },
    ],
    starterCode: {
      python: `import sys
input = sys.stdin.readline

def two_sum(nums, target):
    # Write your solution here
    pass

n = int(input())
nums = list(map(int, input().split()))
target = int(input())
result = two_sum(nums, target)
print(result[0], result[1])
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const nums = lines[1].split(' ').map(Number);
const target = parseInt(lines[2]);

function twoSum(nums, target) {
    // Write your solution here
}

const result = twoSum(nums, target);
console.log(result[0], result[1]);
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target; cin >> target;

    auto res = twoSum(nums, target);
    cout << res[0] << " " << res[1] << endl;
    return 0;
}
`,
      java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        int[] res = twoSum(nums, target);
        System.out.println(res[0] + " " + res[1]);
    }
}
`,
    },
  },

  {
    title: "Valid Parentheses",
    slug:  "valid-parentheses-contest",
    difficulty: "Easy" as const,
    frequency: 4,
    topicTag: "Stack",
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is **valid**.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"',       output: "true",  explanation: "" },
      { input: 's = "()[]{}"',   output: "true",  explanation: "" },
      { input: 's = "(]"',       output: "false", explanation: "Mismatched bracket types." },
    ],
    testCases: [
      { input: "()",       expectedOutput: "true",  isHidden: false },
      { input: "()[]{}",  expectedOutput: "true",  isHidden: false },
      { input: "(]",       expectedOutput: "false", isHidden: false },
      { input: "([)]",     expectedOutput: "false", isHidden: true  },
      { input: "{[]}",     expectedOutput: "true",  isHidden: true  },
      { input: "(((",       expectedOutput: "false", isHidden: true  },
    ],
    starterCode: {
      python: `import sys
input = sys.stdin.readline

def is_valid(s):
    # Write your solution here
    pass

s = input().strip()
print("true" if is_valid(s) else "false")
`,
      javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();

function isValid(s) {
    // Write your solution here
}

console.log(isValid(s) ? 'true' : 'false');
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool isValid(string s) {
    // Write your solution here
    return false;
}

int main() {
    string s; cin >> s;
    cout << (isValid(s) ? "true" : "false") << endl;
    return 0;
}
`,
      java: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        // Write your solution here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(isValid(s) ? "true" : "false");
    }
}
`,
    },
  },

  {
    title: "Maximum Subarray",
    slug:  "maximum-subarray-contest",
    difficulty: "Medium" as const,
    frequency: 5,
    topicTag: "Dynamic Programming",
    leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/",
    description: `Given an integer array \`nums\`, find the **subarray** with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.

**Hint:** Try Kadane's Algorithm — keep a running max and reset when the sum goes negative.`,
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "Single element.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The entire array [5,4,-1,7,8] has sum 23.",
      },
    ],
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6",   isHidden: false },
      { input: "1\n1",                       expectedOutput: "1",   isHidden: false },
      { input: "5\n5 4 -1 7 8",             expectedOutput: "23",  isHidden: false },
      { input: "4\n-1 -2 -3 -4",            expectedOutput: "-1",  isHidden: true  },
      { input: "6\n3 -1 2 -1 2 -5",         expectedOutput: "5",   isHidden: true  },
      { input: "8\n-2 -3 4 -1 -2 1 5 -3",   expectedOutput: "7",   isHidden: true  },
    ],
    starterCode: {
      python: `import sys
input = sys.stdin.readline

def max_subarray(nums):
    # Write your solution here
    pass

n = int(input())
nums = list(map(int, input().split()))
print(max_subarray(nums))
`,
      javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const nums = lines[1].split(' ').map(Number);

function maxSubArray(nums) {
    // Write your solution here
}

console.log(maxSubArray(nums));
`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cout << maxSubArray(nums) << endl;
    return 0;
}
`,
      java: `import java.util.*;

public class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        System.out.println(maxSubArray(nums));
    }
}
`,
    },
  },
];

// ── Contest ───────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Connected to MongoDB");

  // Clean up any previous seed run
  const slugs = problems.map((p) => p.slug);
  await Problem.deleteMany({ slug: { $in: slugs } });
  await Contest.deleteMany({ slug: "beyondbasic-weekly-contest-1" });
  console.log("Cleared old seed data");

  // Insert problems
  const created = await Problem.insertMany(problems);
  console.log(`Inserted ${created.length} problems`);

  // Insert contest — ongoing: started yesterday, ends 3 days from now
  const now = new Date();
  const startTime = new Date(now);
  startTime.setDate(startTime.getDate() - 1);  // yesterday
  startTime.setHours(10, 0, 0, 0);

  const endTime = new Date(now);
  endTime.setDate(endTime.getDate() + 3);       // 3 days ahead
  endTime.setHours(22, 0, 0, 0);

  const contest = await Contest.create({
    title:       "BeyondBasic Weekly Contest #1",
    slug:        "beyondbasic-weekly-contest-1",
    description: "Kick off the weekly contest season! Solve 3 classic DSA problems — Arrays, Stack, and DP — and compete for the top spot on the leaderboard.",
    startTime,
    endTime,
    banner:      "from-blue-600 to-indigo-700",
    isPublished: true,
    problems: created.map((p, i) => ({
      problem: p._id,
      points:  i === 0 ? 100 : i === 1 ? 100 : 150,  // Easy, Easy, Medium
      order:   i,
    })),
  });

  console.log(`Contest created: "${contest.title}"`);
  console.log(`  Status:     ongoing (started yesterday, ends in 3 days)`);
  console.log(`  Problems:`);
  created.forEach((p, i) => {
    console.log(`    ${String.fromCharCode(65 + i)}. ${p.title} (${p.difficulty}) — ${i === 2 ? 150 : 100} pts`);
  });
  console.log("\nDone! Run the backend and visit /contests to see it.");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

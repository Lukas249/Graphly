const problem = {
    id: 1,
    title: "Two Sum",
    description: `<p>&nbsp;</p>
    <p>
    Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
    </p>
    <p>&nbsp;</p>
    <p>
    You may assume that each input would have exactly one solution, and you may not use the same element twice.
    </p>
    <p>&nbsp;</p>
    <p>
    You can return the answer in any order.
    </p>
    <p>&nbsp;</p>
    
    <div>
        <strong>Example 1:</strong>

        <pre style="white-space: pre-wrap;">
<strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
        </pre>
    </div>`,
    testcases: ["1 0", "1 1", "1 2"],
    outputs: ["1", "2", "3"],
    code: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}`,
    driver: `
int main() {
    int t;
    cin >> t;
    while (t--) {
        int a, b;
        cin >> a >> b;
        cout << add(a, b) << endl;
    }
    return 0;
}
    `
}

export { problem }
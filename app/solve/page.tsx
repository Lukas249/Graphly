"use client"

export default function Solve() {

   const testcases = `3
1 0
1 1
1 2`;

const expected_outputs = `1
2
3`;

const source_code = `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    int t;
    cin >> t;
    while (t--) {
        int a, b;
        cin >> a >> b;
        cout << add(a, b) << endl;
    }
    return 0;
}`;

let intervalId: NodeJS.Timeout, timeoutId: NodeJS.Timeout;

 const cleanup = () => {
      if (intervalId !== undefined) clearInterval(intervalId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
  };

fetch("http://localhost:2358/submissions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    source_code,
    language_id: 54,
    stdin: testcases,
    expected_output: expected_outputs,
    base64_encoded: false
  })
})
  .then(res => res.json())
  .then(data => {
    const token = data.token;
    console.log("TOKEN:", token);

    timeoutId = setTimeout(() => {
      cleanup()
    }, 60_000)

    intervalId = setInterval(() => {
        fetch(`http://localhost:2358/submissions/${token}?base64_encoded=false`)
          .then(res => {
            return res.json()
          })
          .then(result => {
            if (result.status.id <= 2) {
              console.log("Czekam...");
              return;
            }
            cleanup()
            console.log("OUTPUT:", result.stdout?.trim());
            console.log("STATUS:", result.status.description);
            console.log(result)
          })
          .catch(() => {
            cleanup()
          })
    }, 1000);
  });

    return (
        <p>123</p>
    )
}
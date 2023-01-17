const fs = require("fs");

/*
console.log("A");
const result = fs.readFileSync("append/sample.txt", "utf-8");
console.log(result);
console.log("C");
*/

console.log("A");
fs.readFile("append/sample.txt", "utf-8", (err, result) => {
    console.log(result);
});
console.log("C");

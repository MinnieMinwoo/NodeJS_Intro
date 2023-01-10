import { odd, even } from "./var.mjs";

function checkOddOrEven(number) {
    if (number % 2) {
        return odd;
    } else {
        return even;
    }
}

export default checkOddOrEven;

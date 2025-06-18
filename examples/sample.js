import { universalPreprocess } from "../src/preprocessor.js";

const input = `
// #if FEATURE_A
console.log("Feature A");
// #else
console.log("Fallback");
// #endif
`;

const output = universalPreprocess(input, ["FEATURE_A"]);
console.log(output);

// console.log("Feature A");
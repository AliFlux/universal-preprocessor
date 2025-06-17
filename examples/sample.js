const { applyPreprocessor } = require('../src/preprocessor');

const input = `
// #if FEATURE_A
console.log("Feature A");
// #else
console.log("Fallback");
// #endif
`;

const output = applyPreprocessor(input, ["FEATURE_A"]);
console.log(output);

// console.log("Feature A");
import { universalPreprocess } from "../src/preprocessor.js";

describe("Preprocessor Directive Handling", () => {

    it("will throw error due to missing of value of directive", () => {
        const input = `
// #if
console.log("A");
`;
        expect(() => universalPreprocess(input, []))
            .toThrow("Missing feature in #if directive");
    });

    it("will throw error if #endif is missing", () => {
        const input = `
// #if FEATURE_A
console.log("A");
`;
        expect(() => universalPreprocess(input, ["FEATURE_A"]))
            .toThrow("Missing #endif for ");
    });

    it("will not have anything as anoutput due to enabledFeatures are empty", () => {
        const input = `
// #if FEATURE_A
console.log("A");
// #endif
`;
        const out = universalPreprocess(input, []);
        expect(out).not.toContain('console.log("A");');
    });

    it("allow nested code of directive if outer and inner both #if directives are true", () => {
        const input = `
// #if FEATURE_A
console.log("A");
  // #if FEATURE_B
  console.log("B");
  // #endif
// #endif
console.log("end");
`;
        const out = universalPreprocess(input, ["FEATURE_A", "FEATURE_B"]);
        expect(out).toContain('console.log("A");');
        expect(out).toContain('console.log("B");');
        expect(out).toContain('console.log("end");');
    });

    it("skip all nested blocks if outer #if is false", () => {
        const input = `
// #if FEATURE_A
console.log("A");
  // #if FEATURE_B
  console.log("B");
  // #endif
// #endif
console.log("end");
`;
        const out = universalPreprocess(input, []);
        expect(out).not.toContain('console.log("A");');
        expect(out).not.toContain('console.log("B");');
        expect(out).toContain('console.log("end");');
    });

    it("throw error due to extra #endif", () => {
        const input = `
// #if FEATURE_X
console.log("X");
// #endif
// #endif
`;
        expect(() => universalPreprocess(input, ["FEATURE_X"]))
            .toThrow("Unexpected #endif without matching #if");
    });

    it("throw error on #else without #if", () => {
        const input = `
// #else
console.log("Unexpected else");
// #endif
`;
        expect(() => universalPreprocess(input, []))
            .toThrow("Unexpected #else without matching #if");
    });

    it("throw error on duplicated #else in same block", () => {
        const input = `
// #if FEATURE_X
console.log("Yes");
// #else
console.log("No1");
// #else
console.log("No2");
// #endif
`;
        expect(() => universalPreprocess(input, []))
            .toThrow("Duplicate #else in #if");
    });

    it("will correctly handle nested #if blocks", () => {
        const input = `
// #if FEATURE_A
console.log("A");
  // #if FEATURE_B
  console.log("B");
  // #endif
// #endif
`;
        const out = universalPreprocess(input, ["FEATURE_A", "FEATURE_B"]);
        expect(out).toContain('console.log("A");');
        expect(out).toContain('console.log("B");');
    });

    it("will just include else block if condition fails", () => {
        const input = `
// #if FEATURE_Z
console.log("Z");
// #else
console.log("No Z");
// #endif
`;
        const out = universalPreprocess(input, []);
        expect(out).not.toContain('console.log("Z");');
        expect(out).toContain('console.log("No Z");');
    });

    it("will skip else block if condition succeeds", () => {
        const input = `
// #if FEATURE_Z
console.log("Z");
// #else
console.log("No Z");
// #endif
`;
        const out = universalPreprocess(input, ["FEATURE_Z"]);
        expect(out).toContain('console.log("Z");');
        expect(out).not.toContain('console.log("No Z");');
    });
});

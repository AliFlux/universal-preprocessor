#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { applyPreprocessor } = require("../src/preprocessor");

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Usage:
  preprocessor <sourceDir> <outDir> <FEATURE1,FEATURE2,...>

Example:
  preprocessor project dist FEATURE_CHAT,FEATURE_AUTH
    `);
    process.exit(0);
}

// Validate required args
if (args.length < 3) {
    console.error("Invalid usage.\n");
    console.log(`Expected:
  preprocessor <sourceDir> <outDir> <FEATURE1,FEATURE2,...>

Example:
  preprocessor project dist FEATURE_CHAT,FEATURE_AUTH
    `);
    process.exit(1);
}

const [srcArg, distArg, featureArg] = args;
const enabled = featureArg.split(",").map(f => f.trim()).filter(Boolean);

const codeExtensions = [".js", ".ts", ".jsx", ".py", ".txt", ".html", ".css"];
const SKIP_LIST = ["node_modules", "dist", ".git", ".DS_Store"];

const fullSrc = path.resolve(process.cwd(), srcArg);
const fullDist = path.resolve(process.cwd(), distArg);

if (!fs.existsSync(fullSrc)) {
    console.error(`Source directory "${fullSrc}" not found.
        
Please provide a valid source directory.`);
    process.exit(1);
}

fs.rmSync(fullDist, { recursive: true, force: true });

copyRecursive(fullSrc, fullDist, enabled);

console.log(`Built from "${srcArg}" → "${distArg}" with features:`, enabled);

function copyRecursive(src, dest, enabled) {
    const stats = fs.statSync(src);
    const name = path.basename(src);

    if (SKIP_LIST.includes(name)) return;

    if (stats.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const item of fs.readdirSync(src)) {
            copyRecursive(
                path.join(src, item),
                path.join(dest, item),
                enabled
            );
        }
    } else {
        const ext = path.extname(src);
        const shouldProcess = codeExtensions.includes(ext);
        const content = fs.readFileSync(src, "utf-8");
        const filtered = shouldProcess ? applyPreprocessor(content, enabled) : content;

        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, filtered);
    }
}

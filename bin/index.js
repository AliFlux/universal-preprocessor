#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { universalPreprocess } from "../src/preprocessor.js";

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
const fullSrc = path.resolve(process.cwd(), srcArg);
const fullDist = path.resolve(process.cwd(), distArg);

// Load ignore list from .preprocessorignore if present
let SKIP_LIST = [];
const ignorePath = path.join(fullSrc, ".preprocessorignore");

if (fs.existsSync(ignorePath)) {
    const ignoreContent = fs.readFileSync(ignorePath, "utf-8");
    SKIP_LIST = ignoreContent
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean)
        .filter(l => !l.startsWith("#"))
}

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

    if (name === ".preprocessorignore" || SKIP_LIST.includes(name)) return;

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
        const filtered = shouldProcess ? universalPreprocess(content, enabled) : content;

        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, filtered);
    }
}

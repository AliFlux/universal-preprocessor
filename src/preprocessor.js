import { isDirective } from "./utils.js"

function universalPreprocess(content, enabledFeatures = []) {
    const lines = content.split("\n");
    const result = [];

    const stack = [];
    let skip = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (isDirective(trimmed, "if")) {
            const parts = trimmed.split(" ");
            const feature = parts[2];

            if (!feature) {
                throw new Error(`Line ${i + 1}: Missing feature in #if directive`);
            }

            const conditionMet = enabledFeatures.includes(feature);
            stack.push({ feature, conditionMet, elseSeen: false });
            skip = stack.some(s => s.conditionMet === false);
            continue;
        }

        if (isDirective(trimmed, "else")) {
            if (stack.length === 0) {
                throw new Error(`Line ${i + 1}: Unexpected #else without matching #if`);
            }

            const top = stack[stack.length - 1];
            if (top.elseSeen) {
                throw new Error(`Line ${i + 1}: Duplicate #else in #if ${top.feature}`); 3
            }

            top.elseSeen = true;
            top.conditionMet = !top.conditionMet;
            skip = stack.some(s => s.conditionMet === false);
            continue;
        }

        if (isDirective(trimmed, "endif")) {
            if (stack.length === 0) {
                throw new Error(`Line ${i + 1}: Unexpected #endif without matching #if`);
            }

            stack.pop();
            skip = stack.some(s => s.conditionMet === false);
            continue;
        }

        if (!skip) {
            result.push(line);
        }
    }

    if (stack.length > 0) {
        throw new Error(`Missing #endif for ${stack.length} unmatched #if directive(s)`);
    }

    return result.join("\n");
}


export {universalPreprocess};
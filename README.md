# universal-preprocessor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2012.0.0-brightgreen)](https://nodejs.org/)

A lightweight, zero-dependency universal preprocessor that enables conditional compilation through feature flags. Built for developers who need to maintain multiple builds or feature variants of their codebase without complex build tooling.

## Important Notice
> **&#9888; Testing Disclaimer**: While this universal-preprocessor supports multiple file formats (JavaScript, TypeScript, Python, HTML, CSS, and plain text), it has been thoroughly tested only with JavaScript files. Other file types are supported but may require additional testing in your specific use case.

## Overview

universal-preprocessor provides a simple yet powerful way to conditionally include or exclude code blocks based on feature flags. It supports multiple file formats and comment styles, making it versatile for various project types.

### Key Benefits

- **Zero Dependencies**: No external libraries required
- **Multiple File Format Support**: Works with JavaScript, TypeScript, Python, HTML, CSS, and plain text files
- **Robust Error Handling**: Comprehensive validation with helpful error messages
- **Nested Directives**: Full support for nested conditional blocks
- **CLI Integration**: Easy integration into build pipelines
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

### NPM (Recommended)
```bash
npm install -g universal-preprocessor
```

### Local Installation
```bash
npm install universal-preprocessor
```

### Manual Installation
```bash
git clone https://github.com/AliFlux/universal-preprocessor.git
cd universal-preprocessor
npm i
npm link
```

## Quick Start

### Command Line Interface

Process an entire project directory:

```bash
preprocessor src dist FEATURE_AUTH,FEATURE_CHAT,DEBUG_MODE
```

**Syntax:**
```bash
preprocessor <source_directory> <output_directory> <feature1,feature2,...>
```
### Ignoring Files and Folders (Optional)

You can ignore specific files and folders from being processed or copied to the output directory by using a `.preprocessorignore` file.
This works similar to `.gitignore`.

#### How to use:
- Create a `.preprocessorignore` file in the same directory as your `sourceDir`.
- List files or folders (one per line) you want to exclude like:

```bash
node_modules
dev
secrets.txt
```

####  Example structure:
```
Source-Project
├── .preprocessorignore
├── main.js
├── dev/
│   └── test.js
├── package.json
├── secrets.txt
└── node_modules/
```

### Programmatic Usage

```javascript
import universalPreprocess from "universal-preprocessor";

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
```

## Directive Syntax

universal-preprocessor supports conditional compilation using three primary directives:

### Basic Directives

| Directive | Purpose | Example |
|-----------|---------|---------|
| `#if FEATURE_NAME` | Start conditional block | `// #if FEATURE_AUTH` |
| `#else` | Alternative block (optional) | `// #else` |
| `#endif` | End conditional block | `// #endif` |

### Comment Style Support

The preprocessor automatically detects and supports multiple comment styles:

| Language/Format | Comment Style | Example |
|-----------------|---------------|---------|
| JavaScript/TypeScript | `//` | `// #if FEATURE_NAME` |
| JavaScript/CSS | `/* */` | `/* #if FEATURE_NAME */` |
| HTML | `<!-- -->` | `<!-- #if FEATURE_NAME -->` |
| Python/Shell/Text | `#` | `# #if FEATURE_NAME` |

## Examples

### Feature Flag Implementation

```javascript
// #if FEATURE_PREMIUM
class PremiumFeatures {
    constructor() {
        this.analyticsEnabled = true;
        this.advancedReporting = true;
    }
    
    generateAdvancedReport() {
        // Premium feature implementation
    }
}
// #else
class PremiumFeatures {
    constructor() {
        this.analyticsEnabled = false;
        this.advancedReporting = false;
    }
    
    generateAdvancedReport() {
        throw new Error('Premium features not available');
    }
}
// #endif
```

### Environment-Specific Configuration

```javascript
// #if DEVELOPMENT
const API_BASE_URL = 'http://localhost:3000/api';
const DEBUG_ENABLED = true;
// #else
const API_BASE_URL = 'https://api.production.com';
const DEBUG_ENABLED = false;
// #endif

// #if DEBUG_ENABLED
function debugLog(message) {
    console.log(`[DEBUG] ${message}`);
}
// #endif
```

### Nested Conditions

```javascript
// #if FEATURE_CHAT
class ChatService {
    // #if FEATURE_ENCRYPTION
    encryptMessage(message) {
        return encrypt(message);
    }
    // #else
    encryptMessage(message) {
        return message; // No encryption in basic version
    }
    // #endif
    
    sendMessage(message) {
        const processedMessage = this.encryptMessage(message);
        // Send message logic
    }
}
// #endif
```

### Multi-Language Support

**Python Example:**
```python
# #if DEBUG_MODE
def debug_print(message):
    print(f"DEBUG: {message}")
# #endif

class DataProcessor:
    def process(self, data):
        # #if DEBUG_MODE
        debug_print(f"Processing {len(data)} items")
        # #endif
        return self._process_data(data)
```

**HTML Example:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
    <!-- #if ANALYTICS_ENABLED -->
    <script src="analytics.js"></script>
    <!-- #endif -->
</head>
<body>
    <!-- #if FEATURE_BANNER -->
    <div class="promotional-banner">
        <h2>Special Offer!</h2>
    </div>
    <!-- #endif -->
</body>
</html>
```

## API Reference

### `universalPreprocess(content, enabledFeatures)`

Processes source code and returns filtered content based on enabled features.

**Parameters:**
- `content` (string): Source code to process
- `enabledFeatures` (Array<string>): Array of feature names to enable

**Returns:**
- `string`: Processed source code

**Throws:**
- `Error`: For malformed directives or unmatched blocks

**Example:**
```javascript
import universalPreprocess from "universal-preprocessor";

try {
    const result = universalPreprocess(sourceCode, ['FEATURE_A', 'FEATURE_B']);
    console.log(result);
} catch (error) {
    console.error('Preprocessing failed:', error.message);
}
```

## Error Handling

The preprocessor provides comprehensive error detection and reporting:

### Common Errors

| Error Type | Description | Example |
|------------|-------------|---------|
| Missing Feature | `#if` directive without feature name | `// #if` |
| Unmatched `#if` | Missing corresponding `#endif` | `// #if FEATURE` without `// #endif` |
| Unmatched `#endif` | `#endif` without corresponding `#if` | `// #endif` without `// #if` |
| Unexpected `#else` | `#else` without corresponding `#if` | `// #else` without `// #if` |
| Duplicate `#else` | Multiple `#else` in same block | Two `// #else` in one `#if` block |

## Examples

### NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "build:dev": "preprocessor src dist DEVELOPMENT,DEBUG_MODE",
    "build:prod": "preprocessor src dist PRODUCTION,ANALYTICS",
    "build:premium": "preprocessor src dist PRODUCTION,PREMIUM_FEATURES,ANALYTICS"
  }
}
```

### GitHub Actions

```yaml
name: Build Multiple Variants
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        variant: [
          { name: "basic", features: "BASIC_FEATURES" },
          { name: "premium", features: "PREMIUM_FEATURES,ANALYTICS" },
          { name: "enterprise", features: "ENTERPRISE_FEATURES,ANALYTICS,PREMIUM_FEATURES" }
        ]
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install preprocessor
        run: npm install -g universal-preprocessor
      
      - name: Build ${{ matrix.variant.name }}
        run: preprocessor src dist-${{ matrix.variant.name }} ${{ matrix.variant.features }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v2
        with:
          name: build-${{ matrix.variant.name }}
          path: dist-${{ matrix.variant.name }}
```

## File Processing

### Supported Extensions

The preprocessor automatically processes files with these extensions:
- `.js` - JavaScript
- `.ts` - TypeScript  
- `.jsx` - React JSX
- `.py` - Python
- `.txt` - Plain text
- `.html` - HTML
- `.css` - CSS

### Excluded Directories

The following directories are automatically skipped:
- `node_modules`
- `dist`
- `.git`
- `.DS_Store`

## Use Cases

### Multi-Tenant Applications
Create different builds for different clients:
```bash
preprocessor src dist-client-a CLIENT_A_FEATURES,BASIC_FEATURES
preprocessor src dist-client-b CLIENT_B_FEATURES,PREMIUM_FEATURES
```

### Environment-Specific Builds
```bash
# Development build with debugging
preprocessor src dist-dev DEVELOPMENT,DEBUG_MODE,MOCK_DATA

# Production build
preprocessor src dist-prod PRODUCTION,ANALYTICS,OPTIMIZATIONS
```

### Feature Rollouts
Gradually enable features across different builds:
```bash
# Beta release
preprocessor src dist-beta STABLE_FEATURES,BETA_FEATURES

# Stable release  
preprocessor src dist-stable STABLE_FEATURES
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/AliFlux/universal-preprocessor.git
cd universal-preprocessor
npm install
npm test
```

### Running Tests

```bash
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/AliFlux/universal-preprocessor/issues)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

**Built with ❤️ by [Visor Dynamics](https://visordynamics.uk/)**

Major work done by [MaazAhmadDeveloper](https://github.com/MaazAhmadDeveloper) supported by [AliFlux](https://github.com/AliFlux)

# Preprocessor JS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2012.0.0-brightgreen)](https://nodejs.org/)

A lightweight, zero-dependency JavaScript preprocessor that enables conditional compilation through feature flags. Built for developers who need to maintain multiple builds or feature variants of their codebase without complex build tooling.

## Overview

Preprocessor JS provides a simple yet powerful way to conditionally include or exclude code blocks based on feature flags. It supports multiple file formats and comment styles, making it versatile for various project types.

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
npm install -g preprocessor-js
```

### Local Installation
```bash
npm install preprocessor-js
```

### Manual Installation
```bash
git clone https://github.com/your-username/preprocessor-js.git
cd preprocessor-js
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

### Programmatic Usage

```javascript
const { applyPreprocessor } = require('preprocessor-js');

const sourceCode = `
// #if FEATURE_AUTH
function authenticateUser(credentials) {
    // Authentication logic
    return validateCredentials(credentials);
}
// #else
function authenticateUser(credentials) {
    // Mock authentication for development
    return true;
}
// #endif

// #if DEBUG_MODE
console.log('Debug mode enabled');
// #endif
`;

const processedCode = applyPreprocessor(sourceCode, ['FEATURE_AUTH', 'DEBUG_MODE']);
console.log(processedCode);
```

## Directive Syntax

Preprocessor JS supports conditional compilation using three primary directives:

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

### `applyPreprocessor(content, enabledFeatures)`

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
const { applyPreprocessor } = require('preprocessor-js');

try {
    const result = applyPreprocessor(sourceCode, ['FEATURE_A', 'FEATURE_B']);
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

### Error Messages

All errors include line numbers for easy debugging:

```
Error: Line 15: Missing feature in #if directive
Error: Line 23: Unexpected #endif without matching #if
Error: Line 31: Duplicate #else in #if FEATURE_AUTH
```

## Build Integration

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
        run: npm install -g preprocessor-js
      
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

## Best Practices

### 1. Feature Naming Convention
Use descriptive, uppercase names with underscores:
```javascript
// Good
// #if FEATURE_USER_AUTHENTICATION
// #if DEBUG_MODE
// #if ENVIRONMENT_PRODUCTION

// Avoid
// #if auth
// #if f1
// #if prod
```

### 2. Documentation
Document your feature flags in code comments:
```javascript
/**
 * FEATURE_PREMIUM: Enables premium subscription features
 * FEATURE_ANALYTICS: Includes analytics tracking
 * DEBUG_MODE: Enables debug logging and development tools
 */

// #if FEATURE_PREMIUM
// Premium feature implementation
// #endif
```

### 3. Avoid Deep Nesting
Keep nesting levels reasonable for maintainability:
```javascript
// Acceptable
// #if FEATURE_A
  // #if FEATURE_B
    // Implementation
  // #endif
// #endif

// Avoid excessive nesting (3+ levels)
```

### 4. Consistent Formatting
Maintain consistent indentation and spacing:
```javascript
// #if FEATURE_NAME
    // Indented code block
    function example() {
        return true;
    }
// #endif
```

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
git clone https://github.com/your-username/preprocessor-js.git
cd preprocessor-js
npm install
npm test
```

### Running Tests

```bash
npm test
```

### Project Structure

```
preprocessor-js/
├── src/
│   ├── preprocessor.js    # Core preprocessing logic
│   └── utils.js          # Utility functions
├── bin/
│   └── index.js          # CLI entry point
├── tests/
│   └── preprocessor.test.js
├── package.json
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/your-username/preprocessor-js/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/preprocessor-js/discussions)
- **Email**: support@visordynamics.com

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

---

**Built with ❤️ by [Visor Dynamics](https://github.com/visor-dynamics)**
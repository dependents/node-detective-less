### detective-less [![CI](https://img.shields.io/github/actions/workflow/status/dependents/node-detective-less/ci.yml?branch=main&label=CI&logo=github)](https://github.com/dependents/node-detective-less/actions/workflows/ci.yml?query=branch%3Amain) [![npm](https://img.shields.io/npm/v/detective-less)](https://www.npmjs.com/package/detective-less) [![npm](https://img.shields.io/npm/dm/detective-less)](https://www.npmjs.com/package/detective-less)

> Find the dependencies of a less file

```sh
npm install detective-less
```

**Note:** This is specific to the .less style syntax.

It's the LESS counterpart to [detective](https://github.com/substack/node-detective), [detective-amd](https://github.com/dependents/node-detective-amd), and [detective-es6](https://github.com/dependents/node-detective-es6).

* The AST is generated using the [gonzales-pe](https://github.com/tonyganch/gonzales-pe) parser.

### Usage

```js
const fs = require('fs');
const detective = require('detective-less');

const content = fs.readFileSync('styles.less', 'utf8');

// list of imported file names (ex: 'foo.less', 'foo', etc)
const dependencies = detective(content);
```

### License

MIT

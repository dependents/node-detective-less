# NOTE: This package is not published. Please use https://www.npmjs.com/package/detective-less instead.

### detective-less

> Find the dependencies of a less file

`npm install --save detective-less`

It's the Less counterpart to [detective](https://github.com/substack/node-detective), [detective-amd](https://github.com/mrjoelkemp/node-detective-amd), [detective-es6](https://github.com/mrjoelkemp/node-detective-es6), [detective-sass](https://github.com/mrjoelkemp/node-detective-sass).

* The AST is generated using the [gonzales-pe](https://github.com/tonyganch/gonzales-pe) parser.

### Usage

```js
var detective = require('detective-less');

var content = fs.readFileSync('styles.less', 'utf8');

// list of imported file names (ex: '_foo.less', '_foo', etc)
var dependencies = detective(content);
```

### License

MIT

/* eslint-env mocha */

'use strict';

const assert = require('assert').strict;
const detective = require('../index.js');

function test(source, dependencies, options) {
  assert.deepEqual(detective(source, options), dependencies);
}

describe('detective-less', () => {
  describe('error handling', () => {
    it('does not throw for empty files', () => {
      assert.doesNotThrow(() => {
        detective('');
      });
    });

    it('throws if the given content is not a string', () => {
      assert.throws(() => {
        detective(() => {});
      }, Error, 'content is not a string');
    });

    it('throws if called with no arguments', () => {
      assert.throws(() => {
        detective();
      }, Error, 'src not given');
    });

    it('does not throw on broken syntax', () => {
      assert.doesNotThrow(() => {
        detective('@');
      });
    });

    it('supplies an empty object as the "parsed" ast', () => {
      detective('|');
      assert.deepEqual(detective.ast, {});
    });
  });

  describe('less', () => {
    it('dangles the parsed AST', () => {
      detective('@import "foo.less";');
      assert.ok(detective.ast);
    });

    it('returns the dependencies of the given .less file content', () => {
      test('@import "_foo.less";', ['_foo.less']);
      test('@import          "_foo.less";', ['_foo.less']);
      test('@import "_foo";', ['_foo']);
      test('body { color: blue; } @import "_foo.css";', ['_foo.css']);
      test('@import "bar";', ['bar']);
      test('@import "bar"; @import "foo";', ['bar', 'foo']);
      test('@import \'bar\';', ['bar']);
      test('@import \'bar.less\';', ['bar.less']);
      test('@import "_foo.less";\n@import "_bar.less";', ['_foo.less', '_bar.less']);
      test('@import "_foo.less";\n@import "_bar.less";\n@import "_baz";\n@import "_buttons";', ['_foo.less', '_bar.less', '_baz', '_buttons']);
      test('@import "_nested.less"; body { color: blue; a { text-decoration: underline; }}', ['_nested.less']);
    });

    it('handles comma-separated imports (#2)', function() {
      test('@import "_foo.less", "bar";', ['_foo.less', 'bar']);
    });

    it('allows imports with no semicolon', function() {
      test('@import "_foo.less"\n@import "_bar.less"', ['_foo.less', '_bar.less']);
    });
  });
});

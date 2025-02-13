'use strict';

const { suite } = require('uvu');
const assert = require('uvu/assert');
const detective = require('../index.js');

function test(source, dependencies, options) {
  assert.equal(detective(source, options), dependencies);
}

const errorSuite = suite('error handling');

errorSuite('does not throw for empty files', () => {
  assert.not.throws(() => {
    detective('');
  });
});

errorSuite('throws if the given content is not a string', () => {
  assert.throws(() => {
    detective(() => {});
  }, err => err instanceof Error && err.message === 'content is not a string');
});

errorSuite('throws if called with no arguments', () => {
  assert.throws(() => {
    detective();
  }, err => err instanceof Error && err.message === 'content not given');
});

errorSuite('does not throw on broken syntax', () => {
  assert.not.throws(() => {
    detective('@');
  });
});

errorSuite('supplies an empty object as the "parsed" ast', () => {
  detective('|');
  assert.equal(detective.ast, {});
});

errorSuite.run();

const lessSuite = suite('less');

lessSuite('dangles the parsed AST', () => {
  detective('@import "foo.less";');
  assert.ok(detective.ast);
});

lessSuite('returns the dependencies of the given .less file content', () => {
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

lessSuite('handles comma-separated imports (#2)', () => {
  test('@import "_foo.less", "bar";', ['_foo.less', 'bar']);
});

lessSuite('handles comma-separated imports (#2)', () => {
  test('@import "_foo.less"\n@import "_bar.less"', ['_foo.less', '_bar.less']);
});

lessSuite('ignores non-import atrules', () => {
  test('body { @media print { color: blue; } }', []);
});

lessSuite('returns the url dependencies when enable url', () => {
  test(
    '@font-face { font-family: "Trickster"; src: local("Trickster"), url("trickster-COLRv1.otf") format("opentype") tech(color-COLRv1), url("trickster-outline.otf") format("opentype"), url("trickster-outline.woff") format("woff"); }',
    [
      'trickster-COLRv1.otf',
      'trickster-outline.otf',
      'trickster-outline.woff'
    ],
    { url: true }
  );

  test(
    'body { div {background: no-repeat center/80% url("foo.png"); }}',
    ['foo.png'],
    { url: true }
  );

  test(
    'body { div {background: no-repeat center/80% url(foo.png); }}',
    ['foo.png'],
    { url: true }
  );
});

lessSuite.run();

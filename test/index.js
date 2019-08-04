const fs = require('fs');
const postcss = require('postcss');
const expect = require('chai').expect;

const plugin = require('../');

const test = function(name, opts) {
  const input = read('test/fixtures/' + name + '.css');
  const output = read('test/fixtures/' + name + '.out.css');
  expect(postcss(plugin(opts)).process(input).css).to.eql(output);
};
const testString = function(input, output, opts) {
  expect(postcss(plugin(opts)).process(input).css).to.eql(output);
};
const read = function(path) {
  return fs.readFileSync(path, 'utf-8');
};

describe('postcss-opacity', function() {

  it('simple', function() {
    test('simple');
  });
  
});

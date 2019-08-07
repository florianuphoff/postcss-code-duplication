# postcss-code-duplication
[![NPM version](https://img.shields.io/npm/v/stylelint-mixin-extend-usage.svg)](https://www.npmjs.com/package/stylelint-mixin-extend-usage)
[![Downloads per month](https://img.shields.io/npm/dm/stylelint-mixin-extend-usage.svg)](http://npmcharts.com/compare/stylelint-mixin-extend-usage)

This plugin aims to detect different types of code duplication in your CSS.

## Usage
Add [PostCSS Code Duplication](https://www.npmjs.com/package/postcss-code-duplication) to your project:

```bash
npm install postcss-code-duplication  --save-dev
```

After that call it as a plugin in postcss:

```javascript
const postcss = require('postcss)
const postcssCodeDuplication = require('postcss-code-duplication)

const plugins = [postcssCodeDuplication()]

postcss(plugins).process(your_css /*, processOptions */)
```

## Options
You can control which types of duplication should be reported. There are four possible duplications. The types are based on scientific research: [D. Mazinanian: Discovering Refactoring Opportunities in Cascading Style Sheets](dl.acm.org/ft_gateway.cfm?id=2635879&type=pdf)

#### typeOneDuplication
All declarations of selector are duplicated. The declarations can be randomly ordered.

Activate it by passing the option `typeOneDuplication: true`

```css
.type1-1 {
  margin: 2px;
  color: #123;
  float: left;
}

// type 1 duplication
.type1-2 {
  float: left;
  margin: 2px;
  color: #123;
}
```

#### typeTwoDuplication
The detection of type 2 duplications is not implemented yet. It does not matter if you set it to `true` or `false`. Currently the color converter is buggy and needs to be fixed.

Type two duplications are values which can have a different representation, e.g. color.

Activate it by passing the option `typeTwoDuplication: true`

```css
.type2-1 {
  color: rgb(238, 130, 238);
}

// type 2 duplication
.type2-2 {
  color: #ed82ed;
}
```

#### typeThreeDuplication
A set of individual-property declarations is equivalent with a shorthand-property declaration.

Activate it by passing the option `typeThreeDuplication: true`

```css
.type3-1 {
  padding: 2rem;
}

// type 3 duplication
.type3-2 {
  padding-top: 2rem;
  padding-right: 2rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
}

.type3-3 {
  margin: 2rem 4rem 2rem 4rem;
}

// type 3 duplication
.type3-4 {
  margin: 2rem 4rem;
}
```
#### typeFourDuplication
One individual-property declaration is equivalent with a shorthand-property declaration. This duplication can only be found in the same selector.

Activate it by passing the option `typeFourDuplication: true`

```css
.type4 {
  margin: 2px 1px 2px 1px;
}

// type 4 duplication
.type4 {
  margin-top: 2px;
}
```

## Result
Duplications are reported inside a returned object
```javascript
{
  "type1":[{
    "origin":{"hash":"489588fb7d98c7adbd60aa4ce61272a2","selector":".type1-1"},
    "duplication":{"hash":"489588fb7d98c7adbd60aa4ce61272a2","selector":".type1-2"}
  }],
  "type2":[],
  "type3":[{
    "origin":{"hash":"5e5bb3bc68a45925a97bc3bd4254d842","selector":".type3-3"},
    "duplication":{"hash":"5e5bb3bc68a45925a97bc3bd4254d842","selector":".type3-4"}
  }],
  "type4":[{
    "origin":{"hash":"f005b881be3e8de7ca8b62a22cd0a2df","selector":".type4"}
  }]
}
```

`type4` contains an object only with with one key due to its nature of same selectors. Origin and duplication is always the same selector.

## License
MIT

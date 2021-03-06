'use strict';

const postcss = require('postcss')
const _ = require('lodash')
const selectorList = require('./lib/selectorList')
const typeOneList = require('./lib/typeOne')
const hashedRulesList = require('./lib/hashedRules')
const shortLongPropertiesList = require('./lib/longhandPropertiesList')
const partialPropertiesList = require('./lib/partialProperties')
const alternativeValuesList = require('./lib/alternativeValues')

module.exports = postcss.plugin('postcss-code-duplication', opts => {
  opts = _.defaults(opts, {
    typeOneDuplication: true,
    typeTwoDuplication: true,
    typeThreeDuplication: true,
    typeFourDuplication: true,
    typeFiveDuplication: true
  })

  return (root, result) => {

    let duplications = {
      type1: [],
      fullDuplication: [],
      type2: [],
      type3: [],
      type4: [],
      type5: []
    }
    const selectorMap = selectorList(root, opts)
    const typeOne = typeOneList(root, opts) // type 1 - only props
    const hashedRules = hashedRulesList(root, opts) // type 1 - full
    // const alternativeValues = alternativeValuesList(root, opts) // type 2
    const shortLongProperties = shortLongPropertiesList(root, opts) // type 3
    const partialDuplications = partialPropertiesList(root, selectorMap, opts) // type 4

    // type 1 - lexically same prop
    _.each(typeOne, (value, index, iteratee) => {
      const duplicate = _.find(iteratee, {hash: value.hash}, index + 1)
      if(duplicate) {
        duplications.type1.push({ origin: value, duplication: duplicate, originLine: value.line, originFile: value.file, duplLine: duplicate.line, duplFile: duplicate.file })
      }
    })

    // type 1-b - full duplication
    _.each(hashedRules, (value, index, iteratee) => {
      const duplicate = _.find(iteratee, {hash: value.hash}, index + 1)
      if(duplicate) {
        duplications.fullDuplication.push({ origin: value, duplication: duplicate, originLine: value.line, originFile: value.file, duplLine: duplicate.line, duplFile: duplicate.file })
      }
    })

    // type 2 - alternative values
    // converting colors still buggy


    // type 3 - short - long prop duplication

    // find shorthand duplicates first
    _.each(shortLongProperties.shorthandHashes, (value, index, iteratee) => {
      const duplicate = _.find(iteratee, {hash: value.hash}, index + 1)
      if(duplicate) {
        duplications.type3.push({ origin: value, duplication: duplicate, originLine: value.line, originFile: value.file, duplLine: duplicate.line, duplFile: duplicate.file })
      }
    })

    // find short-long duplicates
    _.each(shortLongProperties.shorthandHashes, (value) => {
      const duplicate = _.find(shortLongProperties.longhandHashes, {hash: value.hash})
      if(duplicate) {
        duplications.type3.push({ origin: value, duplication: duplicate, originLine: value.line, originFile: value.file, duplLine: duplicate.line, duplFile: duplicate.file })
      }
    })

    // type 4 - partial duplication in same selectors

    _.each(partialDuplications.longProperties, (value, index, iteratee) => {
      const duplicate = _.find(partialDuplications.shortProperties, {hash: value.hash})
      if(duplicate) {
        duplications.type4.push({ origin: value, originLine: value.line, originFile: value.file })
      }
    })

    // type 5 - duplicated shorthand properties on different levels in same selectors
    // border: 1px solid red <-> border-width: 1px
    // this will give multiple hits for one duplication - but at least it finds such duplications
    if (opts.typeFiveDuplication) {
      _.each(partialDuplications.shortProperties, (value, index, iteratee) => {
        const duplicate = _.find(iteratee, {hash: value.hash}, index + 1)
        if(duplicate) {
          duplications.type5.push({ origin: value, originLine: value.line, originFile: value.file })
        }
      })
    }

    result.warn('Found duplications', duplications)
  }
})
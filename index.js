'use strict';

const postcss = require('postcss')
const _ = require('lodash')
const selectorList = require('./lib/selectorList')
const hashedRulesList = require('./lib/hashedRules')
const shortLongPropertiesList = require('./lib/longhandPropertiesList')

module.exports = postcss.plugin('plugin-name', opts => {
  opts = opts || {}
  opts = _.defaults(opts, {
    selectorDuplicates: true,
    propertyDuplicates: true,
    typeOne: true,
    typeTwo: true,
    typeThree: true,
    typeFour: true
  })

  return (root, result) => {

    let duplications = {
      type1: [],
      type2: [],
      type3: [],
      type4: []
    }
    const selectorMap = selectorList(root, opts) // why?!
    const hashedRules = hashedRulesList(root, opts) // type 1
    const shortLongProperties = shortLongPropertiesList(root, opts) // type 3

    // _.filter(hashedRules, (value, index, iteratee) => {
    //   const duplicate = _.find(iteratee, {hash: value.hash}, index + 1)
    //   if(duplicate) {
    //     duplications.type1.push({ origin: value, duplication: duplicate })
    //   }
    //   return 
    // })

    // type 1 - full duplication
    _.each(hashedRules, (value, index, iteratee) => {
      const duplicate = _.find(iteratee, {hash: value.hash}, index + 1)
      if(duplicate) {
        duplications.type1.push({ origin: value, duplication: duplicate })
      }
    })

    // type 2 -


    // type 3 - short - long prop duplication

    // find shorthand duplicates first
    _.each(shortLongProperties.shorthandHashes, (value, index, iteratee) => {
      const duplicate = _.find(iteratee, {hash: value.hash}, index + 1)
      if(duplicate) {
        duplications.type3.push({ origin: value, duplication: duplicate })
      }
    })

    // find short-long duplicates
    _.each(shortLongProperties.shorthandHashes, (value) => {
      const duplicate = _.find(shortLongProperties.longhandHashes, {hash: value.hash})
      if(duplicate) {
        duplications.type3.push({ origin: value, duplication: duplicate })
      }
    })

    console.log(duplications)

    result.warn('Found duplications', duplications)
  }
})
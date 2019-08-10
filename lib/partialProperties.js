const crypto = require('crypto')
const _ = require('lodash')
const longhandProperties = require("./longhandProperties")
const expand = require('css-shorthand-expand')

module.exports = function(root, selectors, opts) {
  const selectorList = selectors
  const duplicatedSelectorList = _.filter(selectorList, (val, i, iteratee) => _.includes(iteratee, val, i + 1))
  const shorthandProperties = ["background","font","padding","margin","border","border-width","border-style","border-color","border-top","border-right","border-bottom","border-left","border-radius","outline"]
  let shortProps = []
  let longProps = []

  if(!opts.typeFourDuplication) return partialDuplications
  duplicatedSelectorList.forEach((selector) => {
    root.walkRules(selector, (rule) => {
      if (rule.parent.type === 'atrule') return
  
      const selector = rule.selector
      let hash = 0
      let declarationsString = ''
  
      rule.nodes.forEach((declaration) => {
        if(declaration.prop && declaration.value) {
          const prop = declaration.prop
          const value = declaration.value

          if (shorthandProperties.includes(prop)) {
            const longhandProperties = expand(prop, value)

            console.log(selector)

            for (var property in longhandProperties) {
              if (longhandProperties.hasOwnProperty(property)) { 
                var tmpValue = longhandProperties[property]
                console.log(property + " - " + tmpValue)                
                declarationsString = `${property}:${tmpValue}${declaration.important ? "!important" : ""}${selector}`
                hash = crypto.createHash('md5').update(declarationsString).digest('hex')

                shortProps.push({hash: hash, selector: selector})
              }
            }
          }

          if(longhandProperties.includes(prop)) {
            declarationsString = `${prop}:${value}${declaration.important ? "!important" : ""}${selector}`
            hash = crypto.createHash('md5').update(declarationsString).digest('hex')

            longProps.push({hash: hash, selector: selector})
          }
        }
      })
    })
  })

  return {
    shortProperties: shortProps,
    longProperties: longProps
  }
}

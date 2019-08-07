const crypto = require('crypto')
const _ = require('lodash')
const longhandProperties = require("./longhandProperties")
const expand = require('css-shorthand-expand')

module.exports = function(root, selectors, opts) {
  const selectorList = selectors
  const duplicatedSelectorList = _.filter(selectorList, (val, i, iteratee) => _.includes(iteratee, val, i + 1))
  const shorthandProperties = ["background","font","padding","margin","border","border-width","border-style","border-color","border-top","border-right","border-bottom","border-left","border-radius","outline"]
  let partialDuplications = []

  if(!opts.typeFourDuplication) return partialDuplications
  duplicatedSelectorList.forEach((selector) => {
    root.walkRules(selector, (rule) => {
      if (rule.parent.type === 'atrule') return
  
      const selector = rule.selector
      let declarations = []
      let hash = 0
      let declarationsString = ''
  
      rule.nodes.forEach((declaration) => {
        if(declaration.prop && declaration.value) {
          const prop = declaration.prop
          const value = declaration.value

          if (shorthandProperties.includes(prop)) {
            const longhandProperties = expand(prop, value)

            for (var property in longhandProperties) {
              if (longhandProperties.hasOwnProperty(property)) { 
                var tmpValue = longhandProperties[property]
                declarations.push(`${property}:${tmpValue}${declaration.important ? "!important" : ""}`)
                declarationsString = declarations.toString()       
                declarations = []
                hash = crypto.createHash('md5').update(declarationsString).digest('hex')

                partialDuplications.push({hash: hash, selector: selector})
              }
            }
          }

          if(longhandProperties.includes(prop)) {
            declarations.push(`${prop}:${value}${declaration.important ? "!important" : ""}`)
            declarationsString = declarations.toString()           
            hash = crypto.createHash('md5').update(declarationsString).digest('hex')
            declarations = []

            partialDuplications.push({hash: hash, selector: selector})
          }
        }
      })
    })
  })

  return partialDuplications
}

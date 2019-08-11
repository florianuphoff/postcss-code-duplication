const crypto = require('crypto')
const _ = require('lodash')
const longhandProperties = require("./longhandProperties")
const expand = require('css-shorthand-expand')
const ColorConverter = require('./colorConverter')

module.exports = function(root, opts) {
  const coloredProperties = ["background","background-color","border","border-color","border-top","border-right","border-bottom","border-left","border-left","border-top-color","border-right-color","border-bottom-color","border-left-color","border-left-color","caret-color", "color", "column-rule-color", "outline", "outline-color", "text-decoration-color"]  
  const colorConverter = new ColorConverter()
  let duplications = []

  if(!opts.typeTwoDuplication) return duplications

  root.walkRules(rule => {
    if (rule.parent.type === 'atrule') return

    const selector = rule.selector
    let declarations = []
    let hash = 0
    let declarationsString = ''

    rule.nodes.forEach((declaration) => {
      if(declaration.prop && declaration.value) {
        const prop = declaration.prop
        const value = declaration.value

        if(coloredProperties.includes(prop)) {
          const longhandProperties = expand(prop, value)    
          
          if(longhandProperties) {
            for (var property in longhandProperties) {
              if (longhandProperties.hasOwnProperty(property)) {
                if(property.includes('color')) {
                  const colorProp = longhandProperties[property]
                  const shorthandColor = colorConverter.convertToRGBA(colorProp)
                  duplications.push({color: shorthandColor, selector: selector})                    
                }
              }
            }
          } else {
            const color = colorConverter.convertToRGBA(value)
            duplications.push({color: color, selector: selector})                    
          }
        }
      }
    })
  })

  return duplications
}

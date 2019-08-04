const crypto = require('crypto')
const expand = require('css-shorthand-expand');
const longhandProperties = require("./longhandProperties")

module.exports = function(root, opts) {
  const shorthandProperties = ["background","font","padding","margin","border","border-width","border-style","border-color","border-top","border-right","border-bottom","border-left","border-radius","outline"]
  let shorthandHashes = []
  let possibleLonghandHashes = []

  if(!opts.selectorDuplicates) return hashMap

  root.walkRules((rule) => {
    if (rule.parent.type === 'atrule') return

    const selector = rule.selector
    let shortHandDeclarations = []
    let properties = [
      [], // background
      [], // font
      [], // padding
      [], // margin
      [], // border
      []  // outline
    ]
    let hash = 0
    let shortHandDeclarationsString = ''

    // iterate through all nodes
    rule.nodes.forEach((declaration) => {
      // add every decl prop in shorthandProperties to dedicated array
      if(declaration.prop && declaration.value) {
        const prop = declaration.prop
        const value = declaration.value

        if (shorthandProperties.includes(prop)) {
          const longhandProperties = expand(prop, value)
          // iterate through expanded declaration
          for (var property in longhandProperties) {
            if (longhandProperties.hasOwnProperty(property)) { 
              var tmpValue = longhandProperties[property];
              shortHandDeclarations.push(`${property}:${tmpValue}${declaration.important ? "!important" : ""}`)
            }
          }

          const decl = shortHandDeclarations.sort()
          shortHandDeclarationsString = shortHandDeclarations.toString()
          hash = crypto.createHash('md5').update(shortHandDeclarationsString).digest('hex')

          shorthandHashes.push({hash: hash, selector: selector})

          shortHandDeclarations = []
        } 

        if(longhandProperties.includes(prop)) {
          if( prop.includes("background")) {
            properties[0].push(`${prop}:${value}${declaration.important ? "!important" : ""}`)
          } else if(prop.includes("font")) {
            properties[1].push(`${prop}:${value}${declaration.important ? "!important" : ""}`)            
          } else if(prop.includes("padding")) {
            properties[2].push(`${prop}:${value}${declaration.important ? "!important" : ""}`)            
          } else if(prop.includes("margin")) {
            properties[3].push(`${prop}:${value}${declaration.important ? "!important" : ""}`)            
          } else if(prop.includes("border")) {
            properties[4].push(`${prop}:${value}${declaration.important ? "!important" : ""}`)            
          } else if(prop.includes("outline")) {
            properties[5].push(`${prop}:${value}${declaration.important ? "!important" : ""}`)            
          }
        }
      }
    })

    // iterate through all property arrays and hash them
    properties.forEach((propArr) => {
      if(propArr.length) {
        const tmpDeclarations = propArr.sort()
        const tmpDeclarationsString = tmpDeclarations.toString()

        hash = crypto.createHash('md5').update(tmpDeclarationsString).digest('hex')
  
        possibleLonghandHashes.push({hash: hash, selector: selector})
      } 
    })

  })

  return {
    shorthandHashes: shorthandHashes,
    longhandHashes: possibleLonghandHashes
  }
}

const crypto = require('crypto')

module.exports = function(root, opts) {
  let rules = []

  if(!opts.typeOneDuplication) return rules

  root.walkRules((rule) => {
    if (rule.parent.type === 'atrule') return

    const selector = rule.selector
    let declarations = []
    let hash = 0
    let declarationsString = ''

    rule.nodes.forEach((declaration) => {
      if(declaration.prop && declaration.value) {
        const prop = declaration.prop
        const value = declaration.value
        const ruleString = `${prop}: ${value}${declaration.important ? "!important" : ""}`
        rules.push({hash: ruleString, selector: selector})
      }
    })
  })

  return rules
}

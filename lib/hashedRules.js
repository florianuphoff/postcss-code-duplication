const crypto = require('crypto')

module.exports = function(root, opts) {
  let hashedRules = []

  if(!opts.typeOneDuplication) return hashedRules

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
        declarations.push(`${prop}${value}${declaration.important ? "!important" : ""}`)
      }
    })

    declarations = declarations.sort();
    declarationsString = declarations.toString();

    hash = crypto.createHash('md5').update(declarationsString).digest('hex')

    hashedRules.push({hash: hash, selector: selector, line: rule.source.start.line, file: rule.source.input.file})
  })

  return hashedRules
}

module.exports = function(root, opts) {
  let selectorList = []

  if(!opts.selectorDuplicates) return selectorList

  root.walkRules((rule) => {
    const parent = rule.parent
    if (parent.type === 'atrule' && parent.name === 'keyframes') {
      return
    }

    rule.selectors.forEach(((selector) => {
      // save the selector
      selectorList.push(selector)  
    }))
  })

  return selectorList
}

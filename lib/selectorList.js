module.exports = function(root) {
  let selectorList = []

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

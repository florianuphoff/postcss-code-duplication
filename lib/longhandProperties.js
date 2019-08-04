const backgroundProperties = ["background-image", "background-position", "background-size", "background-repeat", "background-origin", "background-clip", "background-attachment", "background-color"]
const fontProperties = ["font-style", "font-variant", "font-weight", "font-size", "line-height", "font-family"]
const paddingProperties = ["padding-top", "padding-right", "padding-bottom", "padding-left"]
const marginProperties = ["margin-top", "margin-right", "margin-bottom", "margin-left"]
const borderProperties = ["border-width", "border-style", "border-color"]
const borderWidthProperties = ["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"]
const borderStyleProperties = ["border-top-style", "border-right-style", "border-bottom-style", "border-left-style"]
const borderColorProperties = ["border-top-color", "border-right-color", "border-bottom-color", "border-left-color"]
const borderRadiusProperties = ["border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius"]
const outlineProperties = ["outline-width", "outline-style", "outline-color"]

module.exports = [].concat(backgroundProperties, fontProperties, paddingProperties, marginProperties, borderProperties, borderWidthProperties, borderStyleProperties, borderColorProperties, borderRadiusProperties, outlineProperties)
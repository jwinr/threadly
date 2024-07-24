import React from "react"

// Helper function to filter out unwanted props and prevent the "unknown prop on DOM element" console warning

/* Can be used like this;
const StyledComponent = styled(PropFilter("div")(["loading"]))`
where 'div' is the element and 'loading' is replaced with the prop name.
*/

const e = React.createElement

const PropFilter = (tag) => (whitelist) =>
  React.forwardRef(({ children, ...props }, ref) => {
    whitelist.forEach((prop) => delete props[prop])
    return e(tag, { ref, ...props }, children)
  })

export default PropFilter

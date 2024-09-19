/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { ElementType, forwardRef, PropsWithChildren } from 'react'

// Helper function to filter out unwanted props and prevent the "unknown prop on DOM element" console warning

/* Can be used like this;
const FilteredDiv = PropFilter("div")(["left"]);

const Popover = styled(FilteredDiv)<PopoverProps>`
where 'div' is the element and 'left' is replaced with the prop name.
*/

const PropFilter =
  <T extends ElementType>(tag: T) =>
  (whitelist: string[]) => {
    type Props = PropsWithChildren<React.ComponentPropsWithoutRef<T>>

    return forwardRef<React.ElementRef<T>, Props>(function PropFilterComponent(
      { children, ...props },
      ref
    ) {
      // Create a new object to avoid mutation of props directly
      const filteredProps = { ...props } as Record<string, unknown>

      whitelist.forEach((prop) => {
        if (prop in filteredProps) {
          delete filteredProps[prop]
        }
      })

      return React.createElement(tag, { ref, ...filteredProps }, children)
    })
  }

export default PropFilter

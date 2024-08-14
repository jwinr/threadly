import React, { ElementType, forwardRef, ReactNode } from "react"

// Helper function to filter out unwanted props and prevent the "unknown prop on DOM element" console warning

/* Can be used like this;
const FilteredDiv = PropFilter("div")(["left"]);

const Popover = styled(FilteredDiv)<PopoverProps>`
where 'div' is the element and 'left' is replaced with the prop name.
*/

type PropsWithChildren<P = {}> = P & { children?: ReactNode }

const e = React.createElement

const PropFilter =
  <T extends ElementType>(tag: T) =>
  (whitelist: string[]) => {
    type Props = PropsWithChildren<React.ComponentPropsWithoutRef<T>>

    return forwardRef<React.ElementRef<T>, Props>(
      ({ children, ...props }, ref) => {
        // Create a new object to avoid mutation of props directly
        const filteredProps = { ...props } as Record<string, any>

        whitelist.forEach((prop) => {
          if (prop in filteredProps) {
            delete filteredProps[prop]
          }
        })

        return e(tag, { ref, ...filteredProps }, children)
      }
    )
  }

export default PropFilter

import React, { useRef } from "react"
import styled from "styled-components"
import dynamic from "next/dynamic"
import Popover from "@/components/Elements/Popover"
import Button from "@/components/Elements/Button"

// Styled-components for the container and buttons
const Container = styled.div`
  padding: 0px;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  gap: 20px; // Space between buttons
  flex-wrap: wrap; // Allow wrapping to prevent overflow
`

const Example = () => {
  const elementRef = useRef(null)
  return (
    <Container>
      <Popover
        trigger="click"
        position="bottom"
        content={<div>This is the Popover content</div>}
        showArrow={false}
        ref={elementRef}
      >
        <Button>Click me</Button>
      </Popover>

      <Popover
        trigger="hover"
        position="top"
        content={<div>This is the Popover content</div>}
        showArrow={true}
      >
        <Button>Hover over me</Button>
      </Popover>

      <Popover
        trigger="focus"
        position="right"
        content={<div>This is the Popover content</div>}
        showArrow={true}
      >
        <Button>Focus on me</Button>
      </Popover>

      <Popover
        trigger="none"
        position="left"
        content={<div>This is the Popover content</div>}
        showArrow={false}
      >
        <Button onClick={() => console.log("Custom trigger")}>
          Manual trigger
        </Button>
      </Popover>
    </Container>
  )
}

// Ensure this component is only rendered on the client side
export default dynamic(() => Promise.resolve(Example), {
  ssr: false,
})

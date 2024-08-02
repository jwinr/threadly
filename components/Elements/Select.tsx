import React, { FC, ChangeEvent } from "react"

import styled from "styled-components"

import ArrowUpDown from "../../public/images/icons/arrowUpDown.svg"

/**
 * WrapperProps - Interface for wrapper properties.
 * @property {boolean} [hidden] - Specifies whether the element should be hidden.
 */
interface WrapperProps {
  hidden?: boolean
}

const Wrapper = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label<WrapperProps>`
  display: ${({ hidden }) => (hidden ? "none" : "flex")};
  color: #353a44;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 14px;
`

const Description = styled.p<WrapperProps>`
  display: ${({ hidden }) => (hidden ? "none" : "block")};
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  color: gray;
`

const ErrorText = styled.p<WrapperProps>`
  display: ${({ hidden }) => (hidden ? "none" : "block")};
  margin-top: 0.5rem;
  color: red;
`

/**
 * SelectWrapperProps - Interface for select wrapper properties.
 * @property {"small" | "medium" | "large"} size - Size of the select input.
 * @property {boolean} invalid - Indicates if the select input is in an invalid state.
 */
interface SelectWrapperProps {
  size: "small" | "medium" | "large"
  invalid: boolean
}

const SelectWrapper = styled.select<SelectWrapperProps>`
  display: flex;
  width: 100%;
  padding: var(--s1-padding-top) var(--s1-padding-right)
    var(--s1-padding-bottom) var(--s1-padding-left);
  --s1-padding-right: 26px;
  background-color: white;
  border: none;
  color: rgb(64, 68, 82);
  transition-property: box-shadow, color;
  transition-duration: 240ms;
  font-size: 14px;
  font-weight: 600;
  box-shadow: var(--s1-top-shadow),
    var(--s1-keyline) 0 0 0 var(--s1-keyline-width), var(--s1-focus-ring),
    var(--s1-hover-ring), var(--s1-box-shadow);
  --s1-box-shadow: rgba(64, 68, 82, 0.08) 0px 2px 5px 0px;
  --s1-top-shadow: 0px 1px 1px 0px rgba(16, 17, 26, 0.16);
  --s1-keyline: #d8dee4;
  --s1-focus-ring: 0 0 0 0 transparent;
  --s1-hover-ring: rgba(64, 68, 82, 0.16) 0px 0px 0px 1px;
  border-radius: 6px;
  text-overflow: ellipsis;
  appearance: none;

  &:focus {
    --s1-keyline: rgb(1 150 237 / 36%);
    --s1-top-shadow: 0px 1px 1px 0px rgba(16, 17, 26, 0.16);
    --s1-focus-ring: rgba(1, 150, 237, 0.36) 0px 0px 0px 4px;
    --s1-hover-ring: rgba(64, 68, 82, 0.08) 0px 3px 9px 0px;
  }

  &:focus:hover {
    --s1-keyline: rgb(1 150 237 / 36%);
    --s1-top-shadow: 0px 1px 1px 0px rgba(16, 17, 26, 0.16);
    --s1-focus-ring: rgba(1, 150, 237, 0.36) 0px 0px 0px 4px;
    --s1-hover-ring: rgba(64, 68, 82, 0.08) 0px 3px 9px 0px;
  }

  &[aria-invalid="true"] {
    --s1-keyline: #e61947;
  }

  &:active {
    background-color: #ebeef1;
    --s1-keyline: rgb(1 150 237 / 36%);
    --s1-top-shadow: 0px -1px 1px 0px rgba(16, 17, 26, 0.16);
  }

  &:hover {
    color: rgb(26, 27, 37);

    --s1-top-shadow: 0px 1px 1px 0px rgba(16, 17, 26, 0.16);
    --s1-focus-ring: rgba(64, 68, 82, 0.08) 0px 3px 9px 0px;
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  &:disabled {
    background-color: #ebeef1;
    opacity: 1;
    color: #818da0;
    --s1-keyline: rgb(64 68 82 / 8%);
    --s1-top-shadow: 0px 1px 1px 0px rgba(16, 17, 26, 0.16);
  }
`

const CustomArrow = styled.div`
  position: absolute;
  margin-right: 8px;
  width: 12px;
  --s1-align-self-x: flex-end;
  --s1-flex-x: 0 0 auto;
  align-self: var(--s1-align-self-y);
  justify-self: var(--s1-align-self-x);
  --s1-align-self-y: center;
  pointer-events: none;
  transition-property: fill;
  transition-duration: 240ms;
`

const GridWrapper = styled.div`
  display: grid;
  align-items: var(--s1-align-y);
  justify-items: var(--s1-align-x);
  fill: #474e5a;

  &:hover {
    fill: rgb(26, 27, 37);
  }
`

/**
 * SelectProps - Interface for the Select component properties.
 * @property {string} [autoComplete] - Specifies one of the possible autocomplete behaviors.
 * @property {boolean} [autoFocus] - If true, focuses the element on mount.
 * @property {React.ReactNode} children - The contents of the component.
 * @property {string | string[]} [defaultValue] - Specifies the initially selected option(s).
 * @property {string} [description] - Descriptive text rendered adjacent to the control’s label.
 * @property {boolean} [disabled] - Indicates if the element should be disabled.
 * @property {string} [error] - Error text rendered below the control.
 * @property {string} [form] - Specifies the id of the <form> this input belongs to.
 * @property {("label" | "description" | "error")[]} [hiddenElements] - Hides specified elements.
 * @property {boolean} [invalid] - Indicates if the element is in an invalid state.
 * @property {React.ReactNode} [label] - Text that describes the control.
 * @property {boolean} [multiple] - If true, allows multiple selection.
 * @property {string} [name] - Specifies the name for this input submitted with the form.
 * @property {(event: ChangeEvent<HTMLSelectElement>) => void} [onChange] - Handler for value changes.
 * @property {boolean} [required] - If true, the value must be provided for the form to submit.
 * @property {"small" | "medium" | "large"} [size] - Size of the component.
 * @property {string} [value] - Controls which option is selected.
 */
interface SelectProps {
  autoComplete?: string
  autoFocus?: boolean
  children: React.ReactNode
  defaultValue?: string | string[]
  description?: string
  disabled?: boolean
  error?: string
  form?: string
  hiddenElements?: ("label" | "description" | "error")[]
  invalid?: boolean
  label?: React.ReactNode
  multiple?: boolean
  name?: string
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  size?: "small" | "medium" | "large"
  value?: string
}

/**
 * Select - A reusable select component.
 *
 * @param {SelectProps} props - The properties for the select component.
 * @returns {JSX.Element} The rendered select component.
 */
const Select: FC<SelectProps> = ({
  autoComplete,
  autoFocus,
  children,
  description,
  disabled,
  error,
  form,
  hiddenElements = [],
  invalid,
  label,
  multiple,
  name,
  onChange,
  required,
  size = "medium",
  value,
}) => {
  // Extract valid options from children
  const validOptions = React.Children.map(children, (child: any) =>
    String(child.props.value)
  )

  /**
   * Handle change event for the select element.
   *
   * @param {ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    if (validOptions.includes(newValue)) {
      onChange?.(e)
    } else {
      console.warn(`Invalid value selected: ${newValue}`)
    }
  }

  return (
    <Wrapper>
      {label && (
        <Label hidden={hiddenElements.includes("label")} htmlFor={name}>
          {label}
        </Label>
      )}
      {description && !hiddenElements.includes("description") && (
        <Description hidden={hiddenElements.includes("description")}>
          {description}
        </Description>
      )}
      <GridWrapper>
        <SelectWrapper
          id={name}
          name={name}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          disabled={disabled}
          form={form}
          multiple={multiple}
          required={required}
          size={size}
          value={value}
          invalid={invalid ?? false}
          onChange={handleChange}
          aria-invalid={invalid}
        >
          {children}
        </SelectWrapper>
        <CustomArrow>
          <ArrowUpDown />
        </CustomArrow>
      </GridWrapper>
      {error && !hiddenElements.includes("error") && (
        <ErrorText
          hidden={hiddenElements.includes("error")}
          id={`${name}-error`}
        >
          {error}
        </ErrorText>
      )}
      {description && !hiddenElements.includes("description") && (
        <Description
          hidden={hiddenElements.includes("description")}
          id={`${name}-description`}
        >
          {description}
        </Description>
      )}
    </Wrapper>
  )
}

export default Select

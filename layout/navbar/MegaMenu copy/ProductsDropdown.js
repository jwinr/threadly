import React from "react"
import styled from "styled-components"

const ProductsDropdownEl = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  padding: 20px;
  width: 100%;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const CategoryHeading = styled.h3`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: ${(props) => (props.noMarginBottom ? 0 : "1rem")};
  color: ${({ color }) =>
    color ? `var(--${color})` : "var(--sc-color-carnation)"};
`

const SubCategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;

  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)};
`

const SubCategoryItem = styled.li`
  padding: 5px 0;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const ProductsDropdown = ({ category }) => {
  if (!category) {
    return null
  }

  // Split subcategories into 5 columns
  const subCategories = category.subCategories
  const columns = [[], [], [], [], []]
  subCategories.forEach((subCategory, index) => {
    columns[index % 5].push(subCategory)
  })

  return (
    <ProductsDropdownEl data-first-dropdown-section>
      {columns.map((col, colIndex) => (
        <Column key={colIndex}>
          {colIndex === 0 && <CategoryHeading>{category.name}</CategoryHeading>}
          <SubCategoryList>
            {col.map((subCategory) => (
              <SubCategoryItem key={subCategory.id}>
                {subCategory.name}
              </SubCategoryItem>
            ))}
          </SubCategoryList>
        </Column>
      ))}
    </ProductsDropdownEl>
  )
}

export default ProductsDropdown

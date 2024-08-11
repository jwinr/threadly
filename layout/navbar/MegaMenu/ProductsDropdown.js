import React from "react"
import styled from "styled-components"

const ProductsDropdownEl = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Increase the number of columns */
  gap: 15px; /* Space between columns */
  padding: 20px;
  width: 100%; /* Make sure the dropdown spans the full width of its container */
  background-color: #fff; /* Set background color */
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const CategoryHeading = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`

const SubCategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
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
    <ProductsDropdownEl>
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

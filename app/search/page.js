import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Head from "next/head"
import Breadcrumb from "@/components/Elements/Breadcrumb"
import ProductCard from "@/components/Products/ProductCard"
import LoaderDots from "@/components/Loaders/LoaderDots"
import { useMobileView } from "@/context/MobileViewContext"
import ErrorBoundary from "@/components/Elements/ErrorBoundary"
import PropFilter from "@/utils/PropFilter"

// Lazy-loaded components
const ProductFilters = React.lazy(() =>
  import("@/components/Products/ProductFilters")
)
const Pagination = React.lazy(() => import("@/components/Elements/Pagination"))

const SearchGridContainer = styled.div`
  display: grid;
  grid-template-areas:
    "title title title"
    "info info info"
    "promo promo promo"
    "sort sort sort"
    "items items items"
    "items items items"
    "pagination pagination pagination";
`

const CategorizedItemsContainer = styled(PropFilter("div")(["isVisible"]))`
  display: grid;
  grid-area: items;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 35px;
  padding: 5px 75px 0px 75px;
  transition: opacity 0.3s ease-in-out;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  z-index: 100;

  @media (max-width: 768px) {
    max-width: 100vw;
  }
`

const SearchSortPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-area: sort;
  padding: 0 30px;
`

const SortText = styled.p`
  font-size: 13px;
`

const TotalItems = styled.p`
  font-size: 13px;
  font-weight: 500;
`

const SortDropdown = styled.select`
  background-color: var(--sc-color-white);
  border: 1px solid var(--sc-color-border-gray);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
`

const TitleWrapper = styled.div`
  display: flex;
  padding: 0px 30px;
  grid-area: title;

  h1 {
    font-size: 34px;
    font-weight: 600;
  }
`

const SearchResultsPage = ({ productQuery }) => {
  const router = useRouter()
  const { query } = router.query

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 16

  // Initial non-filtered state
  const [showFilteredItems, setShowFilteredItems] = useState(false)

  // State to track whether filters or sorting options are active
  const [isFilterActive, setIsFilterActive] = useState(false)

  // State to manage filtered items
  const [filteredItems, setFilteredItems] = useState(
    productQuery ? productQuery.products : []
  )

  // State to manage sorting criteria
  const [sortBy, setSortBy] = useState("Most Popular")

  // Mobile view tracking
  const isMobileView = useMobileView()

  // Reset isFilterActive when the query changes (new page is loaded)
  useEffect(() => {
    if (query) {
      setIsFilterActive(false) // Reset to false when query changes
      setSortBy("Most Popular")
    }
  }, [query]) // Listen for changes to the query

  if (!productQuery || !productQuery.products) {
    return <LoaderDots />
  }

  // Callback function to update filtered items
  const handleFilterChange = (filteredItems) => {
    setShowFilteredItems(false) // Hide items to trigger the fade-out animation

    setTimeout(() => {
      // Only reset the filters if they are currently set and the initial result is not empty
      if (filteredItems.length === 0 && productQuery.length > 0) {
        setFilteredItems(productQuery.products)
        setIsFilterActive(false)

        // Show a notification about the filter reset
      } else {
        // Update the filtered items
        setFilteredItems(filteredItems)
        setIsFilterActive(true)
        setCurrentPage(1) // Reset to the first page when filters change
      }

      setShowFilteredItems(true) // Show items to trigger the fade-in animation
    }, 300)
  }

  // Function to handle sorting
  const handleSortChange = (selectedSortBy) => {
    // Update the sorting criteria
    setSortBy(selectedSortBy)

    // Set isFilterActive to true when sorting options are selected
    setIsFilterActive(true)

    // Sort the items based on the selected criteria
    let sortedItems = [...filteredItems]

    if (selectedSortBy === "Most Popular") {
      // Need to implement sorting logic for "Most Popular" (e.g., based on views, ratings)
      // sortedItems = ...
    } else if (selectedSortBy === "Highest Rating") {
      // Sorting logic for "Highest Rating"
      // sortedItems = ...
    } else if (selectedSortBy === "Highest Price") {
      sortedItems.sort((a, b) => b.price - a.price)
    } else if (selectedSortBy === "Lowest Price") {
      sortedItems.sort((a, b) => a.price - b.price)
    }

    // Update the filtered items based on the sorted items
    setFilteredItems(sortedItems)
  }

  // Calculate the total item count based on the items to be displayed
  const totalItemCount = isFilterActive
    ? filteredItems.length
    : productQuery.products.length

  // Auto-capitalize the query
  const capitalizedQuery = query
    ? query.charAt(0).toUpperCase() + query.slice(1)
    : ""

  // Add quotes around the query for the results
  const quotedQuery = `"${query}"`

  // Calculate the range of products to display for the current page
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = isFilterActive
    ? filteredItems.slice(indexOfFirstProduct, indexOfLastProduct)
    : productQuery.products.slice(indexOfFirstProduct, indexOfLastProduct)

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    if (currentPage !== newPage) {
      setCurrentPage(newPage)
    }
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItemCount / productsPerPage)

  return (
    <>
      <Head>
        <title>{`${capitalizedQuery} | TechNexus`}</title>
        <meta
          name="description"
          content={`Discover ${capitalizedQuery} on TechNexus`}
        />
      </Head>
      <Breadcrumb title={capitalizedQuery} />
      <SearchGridContainer>
        <TitleWrapper>
          <h1>Search Results</h1>
        </TitleWrapper>
        <SearchSortPanel>
          <TotalItems>
            {totalItemCount} {totalItemCount === 1 ? " result" : " results"}
            {" for "} {quotedQuery}
          </TotalItems>
          <SortText>
            <label htmlFor="sortBy">Sort By: </label>
            <SortDropdown
              id="sortBy"
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortBy}
            >
              <option value="Most Popular">Most Popular</option>
              <option value="Highest Rating">Highest Rating</option>
              <option value="Highest Price">Highest Price</option>
              <option value="Lowest Price">Lowest Price</option>
            </SortDropdown>
          </SortText>
        </SearchSortPanel>
        <ProductFilters
          inventoryItems={productQuery.products}
          onFilterChange={handleFilterChange}
          attributes={productQuery.attributes || []} // Provide a default empty array
        />
        <CategorizedItemsContainer isVisible={showFilteredItems}>
          {isFilterActive
            ? currentProducts.map((item) => (
                <ProductCard
                  key={item.product_id}
                  link={`/products/${item.slug}`}
                  title={item.name}
                  price={item.price}
                  brand={item.brand}
                  rating={item.rating}
                  image={item.images}
                  id={item.product_id}
                />
              ))
            : productQuery.products.map((item) => (
                <ProductCard
                  key={item.product_id}
                  link={`/products/${item.slug}`}
                  title={item.name}
                  price={item.price}
                  brand={item.brand}
                  rating={item.rating}
                  image={item.images}
                  id={item.product_id}
                />
              ))}
        </CategorizedItemsContainer>
        <React.Suspense fallback={<LoaderDots />}>
          <ErrorBoundary>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </ErrorBoundary>
        </React.Suspense>
      </SearchGridContainer>
    </>
  )
}

export async function getServerSideProps(context) {
  const { query } = context.query

  try {
    // Ensure that the query parameter is not empty and is a string
    if (!query || typeof query !== "string") {
      throw new Error("Invalid query parameter")
    }

    // Ensure that the query parameter is properly encoded
    const encodedQuery = encodeURIComponent(query)

    // Fetch search results based on the encoded query
    const response = await fetch(
      `http://localhost:3000/api/search?query=${encodedQuery}`,
      {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const productQuery = await response.json()

    return {
      props: {
        productQuery,
      },
    }
  } catch (error) {
    console.error("Error fetching search results:", error)
    return {
      props: {
        productQuery: {
          products: [],
          attributes: [],
        },
      },
    }
  }
}

export default SearchResultsPage

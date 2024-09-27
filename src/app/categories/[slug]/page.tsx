'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import styled, { css } from 'styled-components'
import Breadcrumb from '@/components/Elements/Breadcrumb'
import ProductCard from '@/components/Products/ProductCard'
import ProductFilters from '@/components/Products/ProductFilters'
import Pagination from '@/components/Elements/Pagination'
import useCategoryData from 'src/hooks/useCategoryData'

const animationStyles = css`
  animation: loadingAnimation 2s infinite;
`

const CategoryPageContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-top: 12px;
  }
`

const CategorizedItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 35px;
  padding: 5px 16px 0px 16px;
  z-index: 100;

  @media (max-width: 768px) {
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    padding: 0px 16px;
    gap: 5px;
  }
`

const LoadingCard = styled.div<{ $loading: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #d6d6d6;
  border-radius: 8px;
  animation: loadingAnimation 2s ease-in-out infinite;
  height: 462px;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`

const LoadingFilter = styled.div`
  margin: 8px 16px;
  border-radius: 25px;
  background-color: #d6d6d6;
  height: 42px;
  animation: loadingAnimation 2s ease-in-out infinite;
`

const LoadingCount = styled.div`
  margin: 8px 16px;
  border-radius: 8px;
  background-color: #d6d6d6;
  height: 33px;
  max-width: 120px;
  animation: loadingAnimation 2s ease-in-out infinite;
`

const TitleWrapper = styled.div<{ $loading: boolean }>`
  display: flex;
  margin: 12px 12px 0px 12px;
  justify-content: center;
  text-align: center;
  align-self: center;
  background-color: ${({ $loading }) => ($loading ? '#d6d6d6' : 'initial')};
  height: ${({ $loading }) => ($loading ? '43.5px' : 'initial')};
  width: ${({ $loading }) => ($loading ? '400px' : 'initial')};
  border-radius: ${({ $loading }) => ($loading ? '6px' : 'initial')};
  ${({ $loading }) => $loading && animationStyles}
  animation-duration: ${({ $loading }) => ($loading ? '2s' : 'initial')};
  h1 {
    display: ${({ $loading }) => ($loading ? 'none' : 'initial')};
    font-size: 29px;
    font-weight: bold;
    color: var(--sc-color-title);
  }
`

const BreadcrumbContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`

const ResultCount = styled.div`
  padding-left: 16px;
  font-size: 22px;
  font-weight: 700;
  width: max-content;
  color: var(--sc-color-text);
`

const FixedFiltersContainer = styled.div`
  visibility: hidden;
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 200;
  bottom: auto;
  animation: 300ms ease 0s 1 normal forwards running slideOut;
  transition: visibility 300ms;

  &.visible {
    visibility: visible;
    animation: 300ms ease 0s 1 normal forwards running slideIn;
    transition: visibility 300ms;
  }

  @media (max-width: 768px) {
    top: 108px;
  }
`

const MemoizedProductCard = React.memo(ProductCard)

const MemoizedProductFilters = React.memo(ProductFilters)

export default function CategoryPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const slug = pathname.split('/').pop() as string
  const page = parseInt(searchParams.get('page') || '1')

  const [currentPage, setCurrentPage] = useState<number>(page)
  const [filterState, setFilterState] = useState<Record<string, string[]>>(
    searchParams.get('filters')
      ? JSON.parse(decodeURIComponent(searchParams.get('filters') || ''))
      : {}
  )
  const { categoryData, loading, filteredItems } = useCategoryData(
    slug,
    currentPage,
    filterState
  )
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

  // Handle filter changes, push new filters to URL, and reset to page 1
  const handleFilterChange = useCallback(
    (selectedAttributes: Record<string, unknown>) => {
      const filters = { ...selectedAttributes }
      const encodedFilters = encodeURIComponent(JSON.stringify(filters))

      const newQuery = new URLSearchParams(
        searchParams as URLSearchParams | string[][]
      )
      newQuery.set('filters', encodedFilters)
      newQuery.set('page', '1') // Reset to the first page when filters are applied

      router.push(`${pathname}?${newQuery.toString()}`)
      setCurrentPage(1) // Reset currentPage in state
    },
    [router, pathname, searchParams, filteredItems]
  )

  // Handle page change and push new page to URL
  const handlePageChange = useCallback(
    (newPage: number) => {
      const newQuery = new URLSearchParams(
        searchParams as URLSearchParams | string[][]
      )
      newQuery.set('page', newPage.toString())

      router.push(`${pathname}?${newQuery.toString()}`)
      setCurrentPage(newPage) // Update currentPage state
    },
    [router, pathname, searchParams]
  )

  // Calculate paginated items based on current page and filtered items
  const paginatedItems = useMemo(() => {
    if (!filteredItems.length) {
      return []
    }
    const startIndex = (currentPage - 1) * 16
    return filteredItems.slice(startIndex, startIndex + 16)
  }, [filteredItems, currentPage])

  const totalPages = useMemo(() => {
    return filteredItems.length ? Math.ceil(filteredItems.length / 16) : 1
  }, [filteredItems])

  // Sync filterState with URL when the URL changes (e.g., on back/forward browser actions)
  useEffect(() => {
    const filtersFromURL = searchParams.get('filters')
    if (filtersFromURL) {
      const decodedFilters = JSON.parse(decodeURIComponent(filtersFromURL))
      setFilterState(decodedFilters)
    }
    const currentPageFromURL = parseInt(searchParams.get('page') || '1')
    setCurrentPage(currentPageFromURL)
  }, [searchParams])

  console.log('Paginated items', paginatedItems)

  const updateURL = useCallback(
    (filters: Record<string, unknown>) => {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('filters', encodeURIComponent(JSON.stringify(filters)))

      router.push(`${pathname}?${searchParams.toString()}`)
    },
    [router, pathname]
  )

  //console.log(categoryData)
  const resetFilters = useCallback(() => {
    setFilterState({ selectedAttributes: [] })
    updateURL({})
  }, [updateURL])

  // Get the total count of items based on the filtered items including individual color variants
  const getTotalCount = useCallback(() => {
    return filteredItems.reduce((acc, item) => acc + item.colors.length, 0)
  }, [filteredItems])

  useEffect(() => {
    const handleScroll = () => {
      setFiltersVisible(window.scrollY > 175)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <CategoryPageContainer>
        <TitleWrapper $loading={loading}>
          <h1>{categoryData?.name || 'Loading..'}</h1>
        </TitleWrapper>
        <BreadcrumbContainer>
          <Breadcrumb title={categoryData?.name} loading={loading} />
        </BreadcrumbContainer>
        {loading ? (
          <>
            <LoadingFilter />
            <LoadingCount />
          </>
        ) : (
          <>
            <MemoizedProductFilters
              inventoryItems={categoryData?.products || []}
              onFilterChange={handleFilterChange}
              attributes={(categoryData?.attributes as []) || []}
              resetFilters={resetFilters}
              filterState={{
                selectedAttributes: filterState,
                selectedPriceRanges: [],
              }}
              loading={loading}
              filtersVisible={filtersVisible}
            />
            <FixedFiltersContainer className={filtersVisible ? 'visible' : ''}>
              <MemoizedProductFilters
                inventoryItems={categoryData?.products || []}
                onFilterChange={handleFilterChange}
                attributes={(categoryData?.attributes as []) || []}
                resetFilters={resetFilters}
                filterState={{
                  selectedAttributes: filterState,
                  selectedPriceRanges: [],
                }}
                loading={loading}
                filtersVisible={filtersVisible}
              />
            </FixedFiltersContainer>
            <ResultCount>
              {getTotalCount()} {getTotalCount() === 1 ? 'result' : 'results'}
            </ResultCount>
          </>
        )}
        <CategorizedItemsContainer>
          {loading &&
            Array.from({ length: 16 }).map((_, index) => (
              <LoadingCard key={index} $loading={loading} />
            ))}
          {paginatedItems.map((item) => {
            return item.colors.map((color) => {
              const firstSize = color.sizes[0]
              const price = firstSize.price
              const salePrice = firstSize.sale_price

              return (
                <MemoizedProductCard
                  key={color.color_variant_id}
                  link={`/products/${item.slug}/${color.color_sku}`}
                  title={item.name}
                  price={Number(price)}
                  discount={salePrice}
                  brand={item.brand}
                  rating={item.rating}
                  image={color.images}
                  id={color.color_variant_id}
                  swatch={color.color_swatch_url}
                  loading={loading}
                  allColors={item.colors.map((c) => ({
                    color_variant_id: c.color_variant_id,
                    color_sku: c.color_sku,
                    color: c.color,
                    color_swatch_url: c.color_swatch_url,
                    images: c.images,
                  }))} // Pass all colors for swatches
                />
              )
            })
          })}
        </CategorizedItemsContainer>
        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </CategoryPageContainer>
    </>
  )
}

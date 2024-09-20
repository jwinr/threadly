'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import styled, { css } from 'styled-components'
import Breadcrumb from '@/components/Elements/Breadcrumb'
import ProductCard from '@/components/Products/ProductCard'
import ProductFilters from '@/components/Products/ProductFilters'
import Pagination from '@/components/Elements/Pagination'
import useCategoryData from 'src/hooks/useCategoryData'

interface Size {
  price: number
  sale_price?: number
}

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

export default function CategoryPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const slug = pathname.split('/').pop() as string

  const page = parseInt(searchParams.get('page') || '1')
  const [currentPage, setCurrentPage] = useState<number>(page)
  const [filterState, setFilterState] = useState<Record<string, string[]>>(
    JSON.parse(searchParams.get('filters') || '{}') as Record<string, string[]>
  )
  const { categoryData, loading, filteredItems } = useCategoryData(
    slug,
    currentPage,
    filterState
  )
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false)

  console.log('categoryData', categoryData)

  const handleFilterChange = useCallback(
    (selectedAttributes: Record<string, unknown>) => {
      const filters = { ...selectedAttributes }
      const encodedFilters = encodeURIComponent(JSON.stringify(filters))

      const newQuery = new URLSearchParams(
        searchParams as URLSearchParams | string[][]
      )
      newQuery.set('filters', encodedFilters)
      newQuery.set('page', '1')

      router.push(`${pathname}?${newQuery.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newQuery = new URLSearchParams(
        searchParams as URLSearchParams | string[][]
      )
      newQuery.set('page', newPage.toString())

      router.push(`${pathname}?${newQuery.toString()}`)
      setCurrentPage(newPage)
    },
    [router, pathname, searchParams]
  )

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

  const updateURL = useCallback(
    (filters: Record<string, unknown>) => {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('filters', encodeURIComponent(JSON.stringify(filters)))

      router.push(`${pathname}?${searchParams.toString()}`)
    },
    [router, pathname]
  )

  const resetFilters = useCallback(() => {
    setFilterState({ selectedAttributes: [] })
    updateURL({})
  }, [updateURL])

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
            <ProductFilters
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
              <ProductFilters
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
            <ResultCount>{filteredItems.length} results</ResultCount>
          </>
        )}
        <CategorizedItemsContainer>
          {loading &&
            Array.from({ length: 16 }).map((_, index) => (
              <LoadingCard key={index} $loading={loading} />
            ))}
          {paginatedItems.map((item) => {
            return item.colors.map((color) => {
              const firstSize = color.sizes[0] as Size
              const price = firstSize.price
              const salePrice = firstSize.sale_price

              return (
                <MemoizedProductCard
                  key={color.color_variant_id}
                  link={`/products/${item.slug}/${color.color_sku}`}
                  title={item.name}
                  price={price}
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

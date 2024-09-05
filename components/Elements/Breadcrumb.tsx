import Link from 'next/link'
import { RiArrowDropRightLine } from 'react-icons/ri'
import styled from 'styled-components'
import { usePathname } from 'next/navigation'
import { useMobileView } from '@/context/MobileViewContext'

const BreadWrapper = styled.nav`
  font-size: 14px;
  margin: 10px 16px;
  display: inline-flex;
  align-items: center;
`

const LoadingBreadcrumb = styled.div`
  display: inline-flex;
  margin: 10px 16px;
  width: 25%;
  height: 21px;
  background-color: #d6d6d6;
  border-radius: 6px;
  animation: loadingAnimation 2s infinite;
`

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const generateBreadcrumbPart = (
  pathname: string,
  isLast: boolean,
  pathnames: string[],
  index: number,
  title?: string,
  categorySlug?: string,
  categoryName?: string
) => {
  if (pathname === 'categories') {
    return null
  }

  if (pathname === 'products' && categorySlug && categoryName) {
    return (
      <span key={index} className="breadcrumb-part">
        <Link
          href={`/categories/${categorySlug}`}
          aria-label={capitalizeFirstLetter(categoryName)}
        >
          {capitalizeFirstLetter(categoryName)}
        </Link>
        {!isLast && <RiArrowDropRightLine />}
      </span>
    )
  } else {
    const currentTitle = title || pathname
    const capitalizedTitle = capitalizeFirstLetter(currentTitle)

    if (isLast && pathname !== 'product') {
      return (
        <span key={index} className="breadcrumb-part">
          {capitalizedTitle}
        </span>
      )
    }

    return (
      <span key={index} className="breadcrumb-part">
        <Link
          href={`/${pathnames.slice(0, index + 1).join('/')}`}
          aria-label={capitalizedTitle}
        >
          {capitalizedTitle}
        </Link>
        {!isLast && <RiArrowDropRightLine />}
      </span>
    )
  }
}

interface BreadcrumbProps {
  title?: string
  categoryName?: string | null
  categorySlug?: string | null
  loading?: boolean
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  title,
  categoryName,
  categorySlug,
  loading,
}) => {
  const isMobileView = useMobileView()
  if (isMobileView) {
    return null
  }

  const pathname = usePathname()

  if (!pathname) {
    return null // TODO: Add a fallback
  }

  const pathnames = pathname.split('/').filter((x) => x && x !== 'categories')
  const productsIndex = pathnames.indexOf('products')

  if (loading) {
    return <LoadingBreadcrumb />
  }

  return (
    <BreadWrapper>
      <span className="breadcrumb-part">
        <Link href="/" aria-label="Home">
          Home
        </Link>
      </span>
      <RiArrowDropRightLine />
      {pathnames
        .map((pathname, index) =>
          generateBreadcrumbPart(
            pathname,
            index === pathnames.length - 1,
            pathnames,
            index,
            title,
            categorySlug,
            categoryName
          )
        )
        .slice(0, productsIndex === -1 ? pathnames.length : productsIndex + 1)}
    </BreadWrapper>
  )
}

export default Breadcrumb

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
  background-color: #ededed;
  border-radius: 6px;
  animation: loadingAnimation 1s infinite;
`

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const BreadcrumbLink = ({
  href,
  label,
  isLast,
}: {
  href: string
  label: string
  isLast: boolean
}) => (
  <span className="breadcrumb-part">
    <Link href={href} aria-label={label}>
      {label}
    </Link>
    {!isLast && <RiArrowDropRightLine />}
  </span>
)

const generateBreadcrumbPart = (
  pathname: string,
  isLast: boolean,
  pathnames: string[],
  index: number,
  { title, categorySlug, categoryName }: Partial<BreadcrumbProps>
) => {
  if (pathname === 'categories') return null

  if (pathname === 'products' && categorySlug && categoryName) {
    return (
      <BreadcrumbLink
        key={`category-${index}`}
        href={`/categories/${categorySlug}`}
        label={capitalize(categoryName)}
        isLast={isLast}
      />
    )
  }

  const label = capitalize(title || pathname)
  return isLast ? (
    <span key={index} className="breadcrumb-part">
      {label}
    </span>
  ) : (
    <BreadcrumbLink
      key={index}
      href={`/${pathnames.slice(0, index + 1).join('/')}`}
      label={label}
      isLast={isLast}
    />
  )
}

interface BreadcrumbProps {
  title?: string
  categoryName?: string | null
  categorySlug?: string | null
  productName?: string | null
  loading?: boolean
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  title,
  categoryName,
  categorySlug,
  productName,
  loading,
}) => {
  const isMobileView = useMobileView()
  if (isMobileView) return null

  const pathname = usePathname()
  if (!pathname) return null

  const pathnames = pathname.split('/').filter((x) => x && x !== 'categories')
  const productsIndex = pathnames.indexOf('products')

  if (loading) return <LoadingBreadcrumb />

  return (
    <BreadWrapper>
      <BreadcrumbLink href="/" label="Home" isLast={false} />
      {pathnames
        .map((segment, index) =>
          generateBreadcrumbPart(segment, index === pathnames.length - 1, pathnames, index, {
            title,
            categorySlug,
            categoryName,
            productName,
          })
        )
        .slice(0, productsIndex === -1 ? pathnames.length : productsIndex + 1)}
      {/* Render the product name explicitly as the last breadcrumb if it exists */}
      {productName && (
        <>
          <span className="breadcrumb-part">{capitalize(productName)}</span>
        </>
      )}
    </BreadWrapper>
  )
}

export default Breadcrumb
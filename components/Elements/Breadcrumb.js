import Link from "next/link"
import { useRouter } from "next/router"
import { RiArrowDropRightLine } from "react-icons/ri"

import styled from "styled-components"

import PropTypes from "prop-types"
import { useMobileView } from "../../context/MobileViewContext"

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

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Helper function to generate breadcrumb part
const generateBreadcrumbPart = (
  pathname,
  isLast,
  pathnames,
  index,
  title,
  categorySlug,
  categoryName
) => {
  const customTitles = {
    categories: "All categories",
  }

  if (pathname === "products") {
    return (
      <span key={index} className="breadcrumb-part">
        <Link
          href={`/categories/${categorySlug}`}
          aria-label={capitalizeFirstLetter(categoryName)}
        >
          {capitalizeFirstLetter(categoryName)}
        </Link>
      </span>
    )
  } else {
    const currentTitle = customTitles[pathname] || title || pathname
    const capitalizedTitle = capitalizeFirstLetter(currentTitle)

    if (!isLast) {
      return (
        <span key={index} className="breadcrumb-part">
          <Link
            href={`/${pathnames.slice(0, index + 1).join("/")}`}
            aria-label={capitalizedTitle}
          >
            {capitalizedTitle}
          </Link>
          <RiArrowDropRightLine />
        </span>
      )
    } else {
      return (
        <span key={index} className="breadcrumb-part">
          {capitalizedTitle}
        </span>
      )
    }
  }
}

function Breadcrumb({ title, categoryName, categorySlug, loading }) {
  const isMobileView = useMobileView()
  if (isMobileView) {
    return
  }

  const router = useRouter()
  const pathnames = router.asPath.split("/").filter((x) => x)
  const productsIndex = pathnames.indexOf("products")

  if (loading) {
    return <LoadingBreadcrumb />
  }

  return (
    <BreadWrapper>
      <span className="breadcrumb-part">
        <a href="/" aria-label="Home">
          Home
        </a>
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

Breadcrumb.propTypes = {
  title: PropTypes.string,
  categoryName: PropTypes.string,
  categorySlug: PropTypes.string,
}

export default Breadcrumb

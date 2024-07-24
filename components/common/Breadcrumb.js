import Link from "next/link"
import { useRouter } from "next/router"
import { RiArrowDropRightLine } from "react-icons/ri"
import styled from "styled-components"

const BreadWrapper = styled.nav`
  font-size: 13px;
  padding: 30px 0 0 30px;
  display: inline-flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 15px 0 0 15px; // Align with the product page padding
  }
`

function Breadcrumb({ title, categoryName, categorySlug }) {
  const router = useRouter()
  const pathnames = router.asPath.split("/").filter((x) => x)

  const customTitles = {
    categories: "All Categories",
    example: "Example",
  }

  const productsIndex = pathnames.indexOf("products")

  return (
    <BreadWrapper>
      <span className="breadcrumb-part">
        <a href="/">Home</a>
      </span>
      <RiArrowDropRightLine />
      {pathnames
        .map((pathname, index) => {
          const isLast = index === pathnames.length - 1

          if (pathname === "products") {
            return (
              <span key={index} className="breadcrumb-part">
                <Link href={`/categories/${categorySlug}`}>{categoryName}</Link>
              </span>
            )
          } else {
            const currentTitle = customTitles[pathname] || title || pathname

            if (!isLast) {
              return (
                <span key={index} className="breadcrumb-part">
                  <Link href={`/${pathnames.slice(0, index + 1).join("/")}`}>
                    {currentTitle}
                  </Link>
                  <RiArrowDropRightLine />
                </span>
              )
            } else {
              return (
                <span key={index} className="breadcrumb-part">
                  {currentTitle}
                </span>
              )
            }
          }
        })
        .slice(0, productsIndex === -1 ? pathnames.length : productsIndex + 1)}
    </BreadWrapper>
  )
}

export default Breadcrumb

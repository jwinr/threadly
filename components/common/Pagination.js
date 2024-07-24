import React, { useEffect } from "react"
import styled, { css } from "styled-components"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import PropFilter from "../../utils/PropFilter"

const PaginationWrapper = styled.div`
  display: flex;
  grid-area: pagination;
  padding: 30px;
  justify-content: center;
  align-items: center;
  width: fit-content;
`

const PaginationButton = styled(PropFilter("button")(["isActive"]))`
  position: relative;
  border: none;
  display: flex;
  width: 30px;
  justify-content: center;
  align-content: center;
  padding: 0.625rem 0.75rem;
  color: var(--sc-color-blue);
  font-weight: 600;

  cursor: ${(props) => (props.isActive ? "default" : "pointer")};

  &:hover::after {
    transition: transform 150ms cubic-bezier(0.33, 0, 0.1, 1),
      opacity 0.1s cubic-bezier(0.25, 0.25, 0.75, 0.75);
    transform: translate(-50%, 0);
    opacity: 1;
  }

  &:after {
    position: absolute;
    bottom: 0.25rem;
    left: 50%;
    transform: translate(-50%, -0.125rem);
    content: "";
    display: block;
    width: 1.5em;
    border-top-width: 2px;
    border-top-style: solid;
    border-color: var(--sc-color-blue);
    transition: transform 0s 0.1s cubic-bezier(0.25, 0.25, 0.75, 0.75),
      opacity 0.1s cubic-bezier(0.25, 0.25, 0.75, 0.75);
    opacity: 0;
  }

  ${(props) =>
    props.isActive &&
    css`
      &:after {
        transition: transform 150ms cubic-bezier(0.33, 0, 0.1, 1),
          opacity 0.1s cubic-bezier(0.25, 0.25, 0.75, 0.75);
        transform: translate(-50%, 0);
        opacity: 1;
      }
    `}
`

const arrowAnimation = css`
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(0);
`

const ArrowIcon = styled.div`
  font-size: 20px;
  ${(props) => props.direction === "back" && "margin-left: 5px;"}
  ${(props) => props.direction === "forward" && "margin-right: 5px;"}
  ${arrowAnimation}
`

const PrevButton = styled.button`
  border: 1px solid transparent;
  padding-right: 10px;
  color: var(--sc-color-blue);
  font-weight: 600;
  cursor: ${(props) =>
    props.disabled
      ? "default"
      : "pointer"}; /* Use pointer cursor if not disabled */

  ${(props) =>
    !props.disabled &&
    css`
      &:hover {
        text-decoration: underline;
        ${ArrowIcon} {
          transform: translateX(-5px);
        }
      }
    `}

  &:disabled {
    color: gray;
    text-decoration: none;
  }
`

const NextButton = styled.button`
  border: 1px solid transparent;
  padding-left: 10px;
  color: var(--sc-color-blue);
  font-weight: 600;
  cursor: ${(props) =>
    props.disabled
      ? "default"
      : "pointer"}; /* Use pointer cursor if not disabled */

  ${(props) =>
    !props.disabled &&
    css`
      &:hover {
        text-decoration: underline;
        ${ArrowIcon} {
          transform: translateX(5px);
        }
      }
    `}

  &:disabled {
    color: gray;
    text-decoration: none;
  }
`

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  useEffect(() => {
    // Scroll to the top when currentPage changes
    window.scrollTo({ top: 0 })
  }, [currentPage])

  const renderPagination = () => {
    const paginationItems = []
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <PaginationButton
          key={i}
          onClick={() => handlePageChange(i)}
          isActive={i === currentPage}
        >
          {i}
        </PaginationButton>
      )
    }
    return paginationItems
  }

  const handlePrevPageChange = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    } else {
    }
  }

  const handleNextPageChange = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  return (
    <PaginationWrapper>
      <PrevButton onClick={handlePrevPageChange} disabled={currentPage === 1}>
        <ArrowContainer>
          <ArrowIcon direction="back">
            <IoIosArrowBack />
          </ArrowIcon>
          {" Previous"}
        </ArrowContainer>
      </PrevButton>
      {renderPagination()}
      <NextButton
        onClick={handleNextPageChange}
        disabled={currentPage === totalPages}
      >
        <ArrowContainer>
          {"Next "}
          <ArrowIcon direction="forward">
            <IoIosArrowForward />
          </ArrowIcon>
        </ArrowContainer>
      </NextButton>
    </PaginationWrapper>
  )
}

export default Pagination

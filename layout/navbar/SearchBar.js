import React, { useState, useEffect } from "react"
import { VscClose } from "react-icons/vsc"
import { IoIosSearch } from "react-icons/io"
import { useRouter } from "next/router"
import styled from "styled-components"

const InputForm = styled.form`
  display: flex;
  width: 75%;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  flex: 1 1 auto;
  margin: 0 20px;

  @media (max-width: 768px) {
    margin: 0; // Match the margin of the other elements
    order: 4; // Beneath the other navbar elements
  }
`

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 10px;
  outline: none;
  font-size: 15px;
  width: 100%;
  height: 100%;
  background-color: var(--sc-color-white-highlight);
`

const SubmitButton = styled.button`
  right: 31px;
  position: relative;
  color: var(--sc-color-text);
  width: 35px;
  height: 38px;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 0 8px 8px 0;
  border: 1px transparent;

  @media (max-width: 768px) {
    right: 5px;
    top: 5px;
    position: absolute;
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 18px;

  &:hover {
    color: #003f66;
  }
`

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?query=${searchTerm}`)
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      clearSearch()
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <SearchContainer>
      <InputForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="What can we help you find?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for products"
        />
        <SubmitButton type="submit" aria-label="Submit search">
          <IoIosSearch />
        </SubmitButton>
      </InputForm>
      {searchTerm && (
        <ClearButton onClick={clearSearch} aria-label="Clear search">
          <VscClose />
        </ClearButton>
      )}
    </SearchContainer>
  )
}

export default SearchBar

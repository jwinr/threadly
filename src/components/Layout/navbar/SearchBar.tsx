import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { Search, X } from 'lucide-react'

const InputForm = styled.form`
  display: flex;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  margin-left: auto;
  height: 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
    width: auto;
    margin: 0;
    order: 4;
  }
`

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 8px;
  border-width: 1px;
  border-color: var(--sc-color-border-gray);
  color: #353a44;
  outline: none;
  font-size: 15px;
  width: 400px;
  height: 100%;
  max-width: 650px;
  background-color: #f5f6f8;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  padding-right: 85px;

  &:focus {
    --s-focus-ring: 0;
    box-shadow: none;
  }
`

const SubmitButton = styled.button`
  right: 32px;
  position: relative;
  color: var(--sc-color-text);
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 8px;
  border: 1px transparent;

  svg {
    stroke: #6c7688;
  }

  &:focus:not(:focus-visible) {
    --s-focus-ring: 0;
  }

  &:hover svg {
    stroke: #474e5a;
  }

  @media (max-width: 768px) {
    right: 5px;
    top: 5px;
    position: absolute;
  }
`

const ClearButton = styled.button`
  position: absolute;
  right: 65px;
  top: 50%;
  height: 60%;
  transform: translateY(-50%);
  background: none;
  padding: 0px 2px;
  margin-right: 7px;
  cursor: pointer;

  svg {
    stroke: #6c7688;
  }

  &:hover svg {
    stroke: #474e5a;
  }

  &:focus:not(:focus-visible) {
    --s-focus-ring: 0;
  }
`

const Divider = styled.div`
  position: absolute;
  display: block;
  width: 1px;
  height: 20px;
  right: 55px;
  background-color: #c5cbd1;
  margin: 0 10px;
`

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  return (
    <SearchContainer>
      <InputForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="What can we help you find?"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          aria-label="Search for products"
        />
        {searchTerm && (
          <>
            <ClearButton
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={20} />
            </ClearButton>
            <Divider />
          </>
        )}
        <SubmitButton type="submit" aria-label="Submit search">
          <Search size={18} />
        </SubmitButton>
      </InputForm>
    </SearchContainer>
  )
}

export default SearchBar

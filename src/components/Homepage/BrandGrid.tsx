'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Image from 'next/image'

interface Brand {
  image: string
  name: string
}

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  opacity: 0.5;
  transition: all 0.3s;

  img {
    user-select: none;
    height: 100%;
    width: 100%;
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
  }

  &:hover {
    opacity: 1;
  }
`

const Container = styled.div`
  display: flex;
  justify-content: center;
`

const Wrapper = styled.div`
  display: flex;
`

const BrandGrid: React.FC = () => {
  const [brandsData, setBrandsData] = useState<Brand[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/brands')
        if (response.ok) {
          const data: Brand[] = (await response.json()) as Brand[]
          setBrandsData(data)
        } else {
          throw new Error('Error fetching data')
        }
      } catch (error) {
        console.error(error)
      }
    }

    void fetchData()
  }, [])

  return (
    <Container>
      {brandsData.map((brand, index) => (
        <Wrapper key={index}>
          <ImageContainer>
            <Image
              src={brand.image}
              width={300}
              height={161}
              alt={brand.name}
            />
          </ImageContainer>
        </Wrapper>
      ))}
    </Container>
  )
}

export default BrandGrid

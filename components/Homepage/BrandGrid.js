import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Image from "next/image"

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

const BrandGrid = () => {
  const [brandsData, setBrandsData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/brands", {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setBrandsData(data)
        } else {
          throw new Error("Error fetching data")
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
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

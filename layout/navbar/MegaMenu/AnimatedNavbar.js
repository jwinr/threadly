import React, { Component } from "react"
import Navbar from "./Navbar"
import NavbarItem from "./Navbar/NavbarItem"
import { Flipper } from "react-flip-toolkit"
import DropdownContainer from "./DropdownContainer"
import ProductsDropdown from "./ProductsDropdown"

export default class AnimatedNavbar extends Component {
  state = {
    activeIndices: [],
    categories: [], // New state to hold fetched categories
  }

  componentDidMount() {
    this.fetchCategories()
  }

  fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories", {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
      })

      if (!response.ok) {
        console.error("Failed to fetch categories:", response.statusText)
        throw new Error(`Error fetching categories: ${response.statusText}`)
      }

      const data = await response.json()

      this.setState({ categories: data })
    } catch (error) {
      console.error("Error fetching category data:", error)
    }
  }

  resetDropdownState = (i) => {
    this.setState({
      activeIndices: typeof i === "number" ? [i] : [],
      animatingOut: false,
    })
    delete this.animatingOutTimeout
  }

  onMouseEnter = (i) => {
    if (this.animatingOutTimeout) {
      clearTimeout(this.animatingOutTimeout)
      this.resetDropdownState(i)
      return
    }
    if (this.state.activeIndices[this.state.activeIndices.length - 1] === i)
      return

    this.setState((prevState) => ({
      activeIndices: prevState.activeIndices.concat(i),
      animatingOut: false,
    }))
  }

  onMouseLeave = () => {
    this.setState({
      animatingOut: true,
    })
    this.animatingOutTimeout = setTimeout(
      this.resetDropdownState,
      this.props.duration
    )
  }

  render() {
    const { duration } = this.props
    let CurrentDropdown
    let PrevDropdown
    let direction

    const currentIndex =
      this.state.activeIndices[this.state.activeIndices.length - 1]
    const prevIndex =
      this.state.activeIndices.length > 1 &&
      this.state.activeIndices[this.state.activeIndices.length - 2]

    if (typeof currentIndex === "number") CurrentDropdown = ProductsDropdown
    if (typeof prevIndex === "number") {
      PrevDropdown = ProductsDropdown
      direction = currentIndex > prevIndex ? "right" : "left"
    }

    return (
      <Flipper
        flipKey={currentIndex}
        spring={duration === 300 ? "noWobble" : { stiffness: 10, damping: 10 }}
      >
        <Navbar onMouseLeave={this.onMouseLeave}>
          {this.state.categories.map((category, index) => {
            return (
              <NavbarItem
                key={category.id}
                title={category.name}
                index={index}
                onMouseEnter={this.onMouseEnter}
              >
                {currentIndex === index && (
                  <DropdownContainer
                    direction={direction}
                    animatingOut={this.state.animatingOut}
                    duration={duration}
                  >
                    <CurrentDropdown category={category} />
                    {PrevDropdown && (
                      <PrevDropdown category={this.state.prevCategory} />
                    )}
                  </DropdownContainer>
                )}
              </NavbarItem>
            )
          })}
        </Navbar>
      </Flipper>
    )
  }
}

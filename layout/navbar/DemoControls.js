import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

const Form = styled.form`
  padding: 2rem 0 1rem 0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 100px;
  right: 0px;

  > div {
    border: 0;
    padding: 1rem 0 1rem 0;
    margin-right: 3rem;
    display: flex;
  }

  input {
    margin-right: 0.5rem;
  }
  label + label input {
    margin-left: 1.5rem;
  }
  b {
    margin-right: 1.5rem;
  }
`

class DemoControls extends Component {
  static propTypes = {
    duration: PropTypes.number,
  }

  componentDidMount() {
    const { duration } = this.props
    this.updateSiteMenuTransition(duration)

    // Use MutationObserver to watch for changes in the DOM
    this.observer = new MutationObserver(this.handleDomChanges)
    this.observer.observe(document.body, { childList: true, subtree: true })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.duration !== this.props.duration) {
      this.updateSiteMenuTransition(this.props.duration)
    }
  }

  componentWillUnmount() {
    // Disconnect the observer when the component is unmounted
    if (this.observer) {
      this.observer.disconnect()
    }
  }

  handleDomChanges = (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (
            node instanceof HTMLElement &&
            node.classList.contains("SiteHeader")
          ) {
            this.updateSiteMenuTransition(this.props.duration)
          }
        })
      }
    })
  }

  updateSiteMenuTransition = (duration) => {
    const siteHeaderElement = document.querySelector(".SiteHeader")
    if (siteHeaderElement) {
      siteHeaderElement.style.setProperty(
        "--siteMenuTransition",
        `${duration}ms`
      )
    }
  }

  render() {
    const { duration } = this.props
    return (
      <Form>
        <div>
          <b>Speed</b>
          {[
            ["normal", 240],
            ["slow (for debugging)", 1000],
          ].map(([label, value]) => {
            return (
              <label key={value}>
                <input
                  type="radio"
                  name="duration"
                  value={value}
                  checked={duration === value}
                  onChange={() => this.props.onChange({ duration: value })}
                />
                {label}
              </label>
            )
          })}
        </div>
      </Form>
    )
  }
}

export default DemoControls

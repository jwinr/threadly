export const validateEmailDomain = (email) => {
  const regex = /.+@\S+\.\S+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  const pattern =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/
  return pattern.test(password)
}

export const validateFirstName = (given_name) => {
  const pattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u
  return pattern.test(given_name)
}

export const validateLastName = (family_name) => {
  const pattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u
  return pattern.test(family_name)
}

export const validateFullName = (fullName) => {
  const parts = fullName.trim().split(" ")
  return (
    parts.length >= 2 &&
    parts.every((part) => /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u.test(part))
  )
}

export const validateCode = (code) => {
  return /^[0-9]{6}$/.test(code)
}

export const handleBlur = (value, validator, setValid) => {
  if (value.trim().length === 0) {
    setValid(true)
  } else {
    setValid(validator(value))
  }
}

/* Allow users to press enter to toggle the password reveal */
export const handleKeyDown = (
  event,
  setShowPassword,
  emailValid,
  passwordValid
) => {
  if (event.key === "Enter") {
    const activeElement = document.activeElement
    const isPasswordRevealButton =
      activeElement &&
      activeElement.classList.contains("password-reveal-button")
    const isForgotPasswordButton =
      activeElement &&
      activeElement.classList.contains("forgot-password-button")
    const isCreateAccountButton =
      activeElement && activeElement.classList.contains("create-account-button")

    if (isPasswordRevealButton) {
      event.preventDefault() // Prevent default form submission
      setShowPassword((prev) => !prev)
    } else if (
      !isForgotPasswordButton &&
      !isCreateAccountButton &&
      emailValid &&
      passwordValid
    ) {
      event.preventDefault() // Prevent default form submission
      activeElement.form.requestSubmit() // Submit the form programmatically
    }
  }
}

export const splitFullName = (fullName) => {
  console.log(`splitFullName(${fullName})`)
  const parts = fullName.trim().split(" ")
  const firstName = parts.slice(0, -1).join(" ")
  const lastName = parts.slice(-1).join(" ")
  return { firstName, lastName }
}

export const validateEmailDomain = (email: string): boolean => {
  const regex = /.+@\S+\.\S+$/
  return regex.test(email)
}

export const validatePassword = (password: string): boolean => {
  const pattern =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[!#$%&*?@^-])[\d!#$%&*?@A-Z^a-z-]{8,}$/
  return pattern.test(password)
}

export const validateFirstName = (given_name: string): boolean => {
  const pattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u
  return pattern.test(given_name)
}

export const validateLastName = (family_name: string): boolean => {
  const pattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u
  return pattern.test(family_name)
}

export const validateFullName = (fullName: string): boolean => {
  const parts = fullName.trim().split(' ')
  return (
    parts.length >= 2 &&
    parts.every((part) => /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u.test(part))
  )
}

export const validateCode = (code: string): boolean => {
  return /^\d{6}$/.test(code)
}

/* Allow users to press enter to toggle the password reveal */
export const handleKeyDown = (
  event: React.KeyboardEvent<Element>,
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>,
  emailValid: boolean,
  passwordValid: boolean,
  fullNameValid?: boolean
): void => {
  if (event.key === 'Enter') {
    const activeElement = document.activeElement as HTMLElement

    const isPasswordRevealButton =
      activeElement &&
      activeElement.classList.contains('password-reveal-button')
    const isForgotPasswordButton =
      activeElement &&
      activeElement.classList.contains('forgot-password-button')
    const isCreateAccountButton =
      activeElement && activeElement.classList.contains('create-account-button')

    if (isPasswordRevealButton) {
      event.preventDefault()
      setShowPassword((prev) => !prev)
    } else if (
      !isForgotPasswordButton &&
      !isCreateAccountButton &&
      emailValid &&
      passwordValid &&
      fullNameValid
    ) {
      event.preventDefault()
      const formElement = activeElement.closest('form')
      formElement?.requestSubmit()
    }
  }
}

export const splitFullName = (
  fullName: string
): { firstName: string; lastName: string } => {
  console.log(`splitFullName(${fullName})`)
  const parts = fullName.trim().split(' ')
  const firstName = parts.slice(0, -1).join(' ')
  const lastName = parts.slice(-1).join(' ')
  return { firstName, lastName }
}

export const getValidationStyle = (
  isValid: boolean,
  invalidStyle: React.CSSProperties
): React.CSSProperties => {
  return isValid ? {} : invalidStyle || {}
}

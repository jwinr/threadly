export const validateEmailDomain = (email: string): boolean => {
  const regex = /.+@\S+\.\S+$/
  return regex.test(email)
}

export const validatePassword = (password: string): boolean => {
  const pattern =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/
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
  return parts.length >= 2 && parts.every((part) => /^[\p{L}'][ \p{L}'-]*[\p{L}]$/u.test(part))
}

export const validateCode = (code: string): boolean => {
  return /^[0-9]{6}$/.test(code)
}

export const handleBlur = (
  value: string,
  validator: (value: string) => boolean,
  setValid: (isValid: boolean) => void,
): void => {
  if (value.trim().length === 0) {
    setValid(true)
  } else {
    setValid(validator(value))
  }
}

/* Allow users to press enter to toggle the password reveal */
export const handleKeyDown = (
  event: React.KeyboardEvent,
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>,
  emailValid: boolean,
  passwordValid: boolean,
): void => {
  if (event.key === 'Enter') {
    const activeElement = document.activeElement as HTMLElement

    const isPasswordRevealButton =
      activeElement && activeElement.classList.contains('password-reveal-button')
    const isForgotPasswordButton =
      activeElement && activeElement.classList.contains('forgot-password-button')
    const isCreateAccountButton =
      activeElement && activeElement.classList.contains('create-account-button')

    if (isPasswordRevealButton) {
      event.preventDefault()
      setShowPassword((prev) => !prev)
    } else if (!isForgotPasswordButton && !isCreateAccountButton && emailValid && passwordValid) {
      event.preventDefault()
      const formElement = activeElement.closest('form') as HTMLFormElement | null
      formElement?.requestSubmit()
    }
  }
}

export const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  console.log(`splitFullName(${fullName})`)
  const parts = fullName.trim().split(' ')
  const firstName = parts.slice(0, -1).join(' ')
  const lastName = parts.slice(-1).join(' ')
  return { firstName, lastName }
}

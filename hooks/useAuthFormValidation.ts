import { useState } from 'react'
import {
  validateEmailDomain,
  validatePassword,
  validateFullName,
  validateCode,
} from '@/utils/authHelpers'

type FormState = {
  username: string
  password: string
  newPassword?: string
  fullName?: string
  code?: string
}

export const useAuthFormValidation = (initialState: FormState) => {
  const [formState, setFormState] = useState(initialState)
  const [validationState, setValidationState] = useState({
    emailValid: true,
    passwordValid: true,
    newPasswordValid: true,
    fullNameValid: true,
    codeValid: true,
  })

  const stringValidators: Record<keyof FormState, (value: string) => boolean> = {
    username: validateEmailDomain,
    password: validatePassword,
    newPassword: validatePassword,
    fullName: validateFullName,
    code: validateCode,
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    if (name in stringValidators) {
      setValidationState((prev) => ({ ...prev, [`${name}Valid`]: true }))
    }
  }

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target

    if (name in stringValidators) {
      const key = name as keyof FormState
      const isValid = formState[key] === '' ? true : stringValidators[key](formState[key] as string)
      setValidationState((prev) => ({ ...prev, [`${name}Valid`]: isValid }))
    }
  }

  return {
    formState,
    ...validationState,
    onChange,
    onBlur,
    setValidationState,
  }
}

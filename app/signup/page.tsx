'use client'

import React, { useState, useEffect, useContext, FormEvent } from 'react'
import { signUp, SignUpOutput } from 'aws-amplify/auth'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import PasswordReveal from '@/components/Auth/PasswordReveal'
import LogoSymbol from '@/public/images/logo_solid.svg'
import Popover from '@/components/Elements/Popover'
import { CognitoErrorMessages } from '@/lib/constants'
import * as AuthStyles from '@/components/Auth/AuthStyles'
import {
  getValidationStyle,
  handleKeyDown,
  splitFullName,
} from '@/utils/authHelpers'
import { UserContext } from '@/context/UserContext'
import LoaderDots from '@/components/Loaders/LoaderDots'
import LoaderSpin from '@/components/Loaders/LoaderSpin'
import useRedirectIfAuthenticated from '@/hooks/useRedirectIfAuthenticated'
import { TiWarningOutline } from 'react-icons/ti'
import { useMobileView } from '@/context/MobileViewContext'
import { useAuthFormValidation } from '@/hooks/useAuthFormValidation'

const SubheaderText = styled.h1`
  font-weight: 500;
  font-size: 18px;
  padding: 5px;
`

const SignUp: React.FC = () => {
  const {
    formState,
    emailValid,
    passwordValid,
    fullNameValid,
    onChange,
    onBlur,
  } = useAuthFormValidation({
    username: '',
    password: '',
    fullName: '',
  })
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [signUpResponse, setSignUpResponse] = useState<SignUpOutput>()
  const { fetchUserAttributes } = useContext(UserContext)
  const [shakeKey, setShakeKey] = useState<number>(0)
  const [isInvalid, setIsInvalid] = useState<boolean>(true)
  const isMobileView = useMobileView()
  const { invalidStyle } = AuthStyles

  type CognitoErrorName = keyof typeof CognitoErrorMessages

  const GENERIC_ERROR_MESSAGE =
    'An unexpected error occurred. Please try again later.'

  // Check if there's already an active sign-in
  const authChecked = useRedirectIfAuthenticated(fetchUserAttributes)

  useEffect(() => {
    const isFormValid =
      emailValid &&
      passwordValid &&
      fullNameValid &&
      formState.username &&
      formState.password &&
      formState.fullName

    setIsInvalid(!isFormValid)
  }, [emailValid, passwordValid, fullNameValid, formState])

  if (!authChecked) {
    return <LoaderDots />
  }

  // Send the AWS user details to the backend for Stripe & Postgres creation
  const sendUserDetails = async (user: {
    sub: string
    email: string
    given_name: string
    family_name: string
  }) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        throw new Error('Failed to send user details.')
      }
    } catch (error) {
      console.error('Error sending user details:', error)
      setErrorMessage(GENERIC_ERROR_MESSAGE)
      setShakeKey((prevKey) => prevKey + 1)
    }
  }

  const handleSignUp = (event: FormEvent) => {
    event.preventDefault()
    if (isLoading) {
      setErrorMessage('')
      return // Prevent form submission if loading
    }

    if (isInvalid) {
      setErrorMessage('Please fill in all fields with valid information.')
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    setLoading(true)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      const { firstName, lastName } = splitFullName(formState.fullName || '')
      try {
        const signUpResponse = await signUp({
          username: formState.username,
          password: formState.password,
          options: {
            userAttributes: {
              given_name: firstName,
              family_name: lastName,
            },
          },
        })
        setSignUpResponse(signUpResponse)

        // Prepare the AWS user details for the backend
        if (signUpResponse.userId) {
          await sendUserDetails({
            sub: signUpResponse.userId,
            email: formState.username,
            given_name: firstName,
            family_name: lastName,
          })
        }
      } catch (err) {
        const error = err as Error
        console.error(error)

        // Check if error.name is a key in CognitoErrorMessages
        if (error.name in CognitoErrorMessages) {
          setErrorMessage(CognitoErrorMessages[error.name as CognitoErrorName])
        } else {
          setErrorMessage(GENERIC_ERROR_MESSAGE)
        }
        setShakeKey((prevKey) => prevKey + 1)
      } finally {
        setLoading(false)
      }
    }, 250)
  }

  const handleRedirect = () => {
    router.push('/')
  }

  const forwardLogin = () => {
    router.push('/login')
  }

  return (
    <AuthStyles.AuthContainerWrapper>
      <AuthStyles.FormContainerWrapper>
        <AuthStyles.AuthCard key={shakeKey} $shake={!!errorMessage}>
          <AuthStyles.AuthCardContent>
            <AuthStyles.LogoBox>
              <LogoSymbol />
            </AuthStyles.LogoBox>
            {signUpResponse?.nextStep?.signUpStep === 'DONE' ? (
              // We're using a Lambda function to automatically confirm the user for demonstrative purposes.
              // In a production environment, we would use the "CONFIRM_SIGN_UP" step, collect a code
              // from the user, and call the confirmSignUp action.
              <>
                <AuthStyles.HeaderText style={{ textAlign: 'center' }}>
                  Success! Your Nexari account has been created.
                </AuthStyles.HeaderText>
                <SubheaderText style={{ marginBottom: '30px' }}>
                  You&apos;re ready to start shopping!
                </SubheaderText>
                <AuthStyles.AuthBtn onClick={handleRedirect} type="button">
                  Shop now
                </AuthStyles.AuthBtn>
              </>
            ) : (
              <>
                <AuthStyles.HeaderText>
                  Create your Threadly account
                </AuthStyles.HeaderText>
                <AuthStyles.FormContainer
                  onSubmit={() => void handleSignUp}
                  noValidate
                  data-form-type="register"
                  onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) =>
                    handleKeyDown(
                      e,
                      setShowPassword,
                      emailValid,
                      passwordValid,
                      fullNameValid
                    )
                  }
                >
                  <AuthStyles.EntryWrapper>
                    <AuthStyles.EntryContainer
                      onChange={onChange}
                      onBlur={onBlur}
                      name="username"
                      id="username"
                      required
                      type="email"
                      placeholder=""
                      autoComplete="off"
                      aria-label="Email address"
                      style={getValidationStyle(emailValid, invalidStyle)}
                      value={formState.username}
                    />
                    <AuthStyles.Label
                      htmlFor="username"
                      style={getValidationStyle(emailValid, invalidStyle)}
                    >
                      Email address
                    </AuthStyles.Label>
                  </AuthStyles.EntryWrapper>
                  {!emailValid && (
                    <AuthStyles.ValidationMessage>
                      <TiWarningOutline />
                      Please enter a valid email address.
                    </AuthStyles.ValidationMessage>
                  )}
                  <AuthStyles.EntryWrapper>
                    <AuthStyles.EntryContainer
                      onChange={onChange}
                      onBlur={onBlur}
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder=""
                      required
                      autoComplete="off"
                      aria-required="true"
                      value={formState.fullName}
                      data-form-type="name,full"
                      style={getValidationStyle(fullNameValid, invalidStyle)}
                    />
                    <AuthStyles.Label
                      htmlFor="fullName"
                      style={getValidationStyle(fullNameValid, invalidStyle)}
                    >
                      Full name
                    </AuthStyles.Label>
                  </AuthStyles.EntryWrapper>
                  {!fullNameValid && (
                    <AuthStyles.ValidationMessage>
                      <TiWarningOutline />
                      Please enter a valid full name.
                    </AuthStyles.ValidationMessage>
                  )}
                  <AuthStyles.EntryWrapper>
                    <AuthStyles.EntryContainer
                      onChange={onChange}
                      onBlur={onBlur}
                      name="password"
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder=""
                      value={formState.password}
                      autoComplete="new-password"
                      aria-label="Password"
                      data-form-type="password,new"
                      style={getValidationStyle(passwordValid, invalidStyle)}
                    />
                    <AuthStyles.Label
                      htmlFor="password"
                      style={getValidationStyle(passwordValid, invalidStyle)}
                    >
                      Password
                    </AuthStyles.Label>
                    {!isMobileView && (
                      <Popover
                        trigger="hover"
                        position="right"
                        content={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                        showArrow={false}
                        color="dark"
                        padding="4px 8px"
                      >
                        <PasswordReveal
                          onClick={() => setShowPassword(!showPassword)}
                          clicked={showPassword}
                          role="button"
                          className="password-reveal-button"
                          disabled={isLoading}
                          ariaLabel={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        />
                      </Popover>
                    )}
                  </AuthStyles.EntryWrapper>
                  {!passwordValid && (
                    <AuthStyles.ValidationMessage>
                      <TiWarningOutline />
                      Please enter a valid password.
                    </AuthStyles.ValidationMessage>
                  )}
                  {errorMessage && (
                    <AuthStyles.ErrorMessage>
                      <TiWarningOutline />
                      {errorMessage}
                    </AuthStyles.ErrorMessage>
                  )}
                  <AuthStyles.EntryBtnWrapper>
                    <AuthStyles.AuthBtn
                      type="submit"
                      data-form-type="action,register"
                      $isLoading={isLoading}
                      style={{ marginTop: '10px' }}
                      $isInvalid={isInvalid}
                    >
                      {isLoading ? (
                        <LoaderSpin isLoading={isLoading} />
                      ) : (
                        'Create account'
                      )}
                    </AuthStyles.AuthBtn>
                  </AuthStyles.EntryBtnWrapper>
                </AuthStyles.FormContainer>
                <AuthStyles.AuthLoginLinkBox onClick={forwardLogin}>
                  <span>Already have an account?</span>
                  <AuthStyles.AuthLoginLink
                    href="/login"
                    className="create-account-button"
                  >
                    Sign in
                  </AuthStyles.AuthLoginLink>
                </AuthStyles.AuthLoginLinkBox>
              </>
            )}
          </AuthStyles.AuthCardContent>
        </AuthStyles.AuthCard>
      </AuthStyles.FormContainerWrapper>
    </AuthStyles.AuthContainerWrapper>
  )
}

export default SignUp

'use client'

import React, { useState, useContext, FormEvent } from 'react'
import { signIn } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import PasswordReveal from '@/components/Auth/PasswordReveal'
import LogoSymbol from '@/public/images/logo_solid.svg'
import { UserContext } from '@/context/UserContext'
import { CognitoErrorMessages } from '@/lib/constants'
import * as AuthStyles from '@/components/Auth/AuthStyles'
import { AuthBtn } from '@/components/Auth/AuthStyles'
import { getValidationStyle, handleKeyDown } from 'src/utils/authHelpers'
import LoaderDots from '@/components/Loaders/LoaderDots'
import useRedirectIfAuthenticated from 'src/hooks/useRedirectIfAuthenticated'
import LoaderSpin from '@/components/Loaders/LoaderSpin'
import { TiWarningOutline } from 'react-icons/ti'
import Banner from '@/components/Elements/Banner'
import Button from '@/components/Elements/Button'
import Popover from '@/components/Elements/Popover'
import { useMobileView } from '@/context/MobileViewContext'
import { useAuthFormValidation } from 'src/hooks/useAuthFormValidation'
import { debouncedCheckUsername } from 'src/utils/checkUsername'

const Login: React.FC = () => {
  const { formState, emailValid, passwordValid, onChange, onBlur } =
    useAuthFormValidation({
      email: '',
      password: '',
    })
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const { fetchUserAttributes } = useContext(UserContext)
  const [shakeKey, setShakeKey] = useState<number>(0)
  const { invalidStyle } = AuthStyles
  const isMobileView = useMobileView()
  const demoUsername = process.env.NEXT_PUBLIC_USERNAME || ''
  const demoPassword = process.env.NEXT_PUBLIC_PASSWORD || ''

  type CognitoErrorName = keyof typeof CognitoErrorMessages

  const GENERIC_ERROR_MESSAGE =
    'An unexpected error occurred. Please try again later.'

  // Check if there's already an active sign-in
  const authChecked = useRedirectIfAuthenticated(fetchUserAttributes)

  if (!authChecked) {
    return <LoaderDots />
  }

  // Debugging
  const toggleIsComplete = () => {
    setIsComplete((prevState) => !prevState)
  }

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault()
    if (isLoading) {
      setErrorMessage('')
      return // Prevent form submission if loading
    }

    if (
      !emailValid ||
      !passwordValid ||
      !formState.email ||
      !formState.password
    ) {
      // If any field is invalid or empty, prevent submission
      setErrorMessage('Please fill in all fields with valid information.')
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    // Check if the username exists in the database before we send a request to AWS
    const usernameExists = await debouncedCheckUsername(
      formState.email,
      setErrorMessage,
      setShakeKey,
      setLoading
    )
    if (!usernameExists) {
      return
    }

    setLoading(true)

    // Call signIn with username and password
    setTimeout(async () => {
      try {
        const response = await signIn({
          username: formState.email,
          password: formState.password,
        })

        if (response.nextStep) {
          switch (response.nextStep.signInStep) {
            case 'RESET_PASSWORD':
              setErrorMessage('Password reset required.')
              break

            case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
              setErrorMessage('New password required.')
              break

            case 'DONE':
              await fetchUserAttributes()
              setIsComplete(true)
              setTimeout(() => {
                router.push('/')
              }, 1500)
              break

            default:
              break
          }
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

  // Sign in to the demo account
  const handleDemoSignIn = async () => {
    try {
      const newResponse = await signIn({
        username: demoUsername,
        password: demoPassword,
      })

      if (newResponse.isSignedIn) {
        await fetchUserAttributes()
        router.push('/')
      } else {
        throw new Error('Demo sign-in failed.')
      }
    } catch {
      setErrorMessage(GENERIC_ERROR_MESSAGE)
      setShakeKey((prevKey) => prevKey + 1)
    }
  }

  const authCardStyle = {
    transition: 'height 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    ...(isComplete && { height: '40%' }),
  }

  return (
    <AuthStyles.AuthPageWrapper>
      <AuthStyles.AuthContainerWrapper>
        <AuthStyles.FormContainerWrapper>
          <AuthStyles.AuthCard
            key={shakeKey}
            style={authCardStyle}
            $shake={!!errorMessage}
          >
            <AuthStyles.AuthCardContent
              $authFadeOut={isComplete}
              $authFadeIn={!isComplete}
            >
              {!isComplete ? (
                <>
                  <AuthStyles.LogoBox>
                    <LogoSymbol />
                  </AuthStyles.LogoBox>
                  <AuthStyles.HeaderText style={{ marginBottom: '0' }}>
                    Sign in to Threadly
                  </AuthStyles.HeaderText>
                  <Banner
                    type="caution"
                    title="You're viewing demo content"
                    description="Skip registration and explore the full features by signing in to a demo account."
                    actions={
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button type="secondary" onPress={handleDemoSignIn}>
                          Sign in to demo account
                        </Button>
                      </div>
                    }
                  />
                  <AuthStyles.FormContainer
                    onSubmit={handleSignIn}
                    noValidate
                    data-form-type="login"
                    onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) =>
                      handleKeyDown(
                        e,
                        setShowPassword,
                        emailValid,
                        passwordValid
                      )
                    }
                  >
                    <AuthStyles.EntryWrapper>
                      <AuthStyles.EntryContainer
                        onChange={onChange}
                        onBlur={onBlur}
                        name="email"
                        id="email"
                        required
                        type="email"
                        placeholder=""
                        autoComplete="off"
                        aria-label="Email address"
                        style={getValidationStyle(emailValid, invalidStyle)}
                        value={formState.email}
                        $isLoading={isLoading}
                      />
                      <AuthStyles.Label
                        htmlFor="email"
                        style={getValidationStyle(emailValid, invalidStyle)}
                        $isLoading={isLoading}
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
                        name="password"
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder=""
                        autoComplete="current-password"
                        aria-label="Password"
                        data-form-type="password"
                        style={getValidationStyle(passwordValid, invalidStyle)}
                        value={formState.password}
                        $isLoading={isLoading}
                      />
                      <AuthStyles.Label
                        htmlFor="password"
                        style={getValidationStyle(passwordValid, invalidStyle)}
                        $isLoading={isLoading}
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
                    <AuthStyles.ResetText
                      href="/forgot-password"
                      className="forgot-password-button"
                    >
                      Forgot your password?
                    </AuthStyles.ResetText>
                    <AuthStyles.EntryBtnWrapper>
                      <AuthBtn
                        type="submit"
                        data-form-type="action,login"
                        $isLoading={isLoading}
                        style={{ marginBottom: '24px' }}
                      >
                        {isLoading ? (
                          <LoaderSpin isLoading={isLoading} />
                        ) : (
                          'Sign in'
                        )}
                      </AuthBtn>
                    </AuthStyles.EntryBtnWrapper>
                  </AuthStyles.FormContainer>
                  <AuthStyles.AuthLoginLinkBox>
                    <span>New to Threadly?</span>
                    <AuthStyles.AuthLoginLink
                      href="/signup"
                      className="create-account-button"
                    >
                      Create account
                    </AuthStyles.AuthLoginLink>
                  </AuthStyles.AuthLoginLinkBox>
                </>
              ) : (
                <AuthStyles.SpinnerWrapper>
                  <span>Signing in...</span>
                  <LoaderSpin isLoading={isComplete} />
                </AuthStyles.SpinnerWrapper>
              )}
            </AuthStyles.AuthCardContent>
          </AuthStyles.AuthCard>
        </AuthStyles.FormContainerWrapper>
      </AuthStyles.AuthContainerWrapper>
      <button
        style={{
          width: '100px',
          position: 'absolute',
          backgroundColor: 'yellow',
        }}
        onClick={toggleIsComplete}
      >
        Toggle Success Message
      </button>
    </AuthStyles.AuthPageWrapper>
  )
}

export default Login

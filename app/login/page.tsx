'use client'

import React, { useState, useEffect, useRef, useContext, ChangeEvent, FormEvent } from 'react'
import Head from 'next/head'
import { signIn, confirmSignUp } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import PasswordReveal from '@/components/Auth/PasswordReveal'
import LogoSymbol from '@/public/images/logo_n.svg'
import { UserContext } from '@/context/UserContext'
import CognitoErrorMessages from '@/utils/CognitoErrorMessages'
import * as AuthStyles from '@/components/Auth/AuthStyles'
import { AuthBtn } from '@/components/Auth/AuthStyles'
import {
  validateEmailDomain,
  validatePassword,
  handleBlur,
  handleKeyDown,
} from '@/utils/authHelpers'
import LoaderDots from '@/components/Loaders/LoaderDots'
import useRedirectIfAuthenticated from '@/hooks/useRedirectIfAuthenticated'
import LoaderSpin from '@/components/Loaders/LoaderSpin'
import { TiWarningOutline } from 'react-icons/ti'
import { useMobileView } from '@/context/MobileViewContext'
import Banner from '@/components/Elements/Banner'
import Button from '@/components/Elements/Button'
import debounce from 'lodash.debounce'
import Popover from '@/components/Elements/Popover'

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const [token, setToken] = useState<string>('')
  const [passwordValid, setPasswordValid] = useState<boolean>(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [emailValid, setEmailValid] = useState<boolean>(true)
  const [successMessage, setSuccessMessage] = useState<boolean>(false)
  const { fetchUserAttributes } = useContext(UserContext)
  const [shakeKey, setShakeKey] = useState<number>(0)
  const isMobileView = useMobileView()
  const { invalidStyle } = AuthStyles
  const demoUsername = process.env.NEXT_PUBLIC_USERNAME || ''
  const demoPassword = process.env.NEXT_PUBLIC_PASSWORD || ''

  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  // Check if there's already an active sign-in
  const authChecked = useRedirectIfAuthenticated(fetchUserAttributes)

  const toggleSuccessMessage = () => {
    setSuccessMessage((prevState) => !prevState)
  }

  const handleEmailBlur = (): void => {
    handleBlur(username, validateEmailDomain, setEmailValid)
  }

  const handlePasswordBlur = (): void => {
    handleBlur(password, validatePassword, setPasswordValid)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    if (name === 'username') {
      setUsername(value)
      // Reset the email validity state to true when user starts editing
      setEmailValid(true)
    } else if (name === 'password') {
      setPassword(value)
      // Reset the password validity state as soon as the user starts editing the password
      setPasswordValid(true)
    }
  }

  // Confirm the user automatically since we don't want to force that step
  const confirmUser = async (username: string): Promise<void> => {
    try {
      await confirmSignUp(username)
    } catch (error) {
      console.error('Error confirming user automatically:', error)
    }
  }

  const handleSignIn = async (event: FormEvent): Promise<void> => {
    event.preventDefault() // Prevent default form submission behavior
    if (loading) return // Prevent form submission if loading
    setErrorMessage('') // Reset any errors when we try signing in again

    // Validate the email before making the API call
    const isEmailValid = validateEmailDomain(username)
    setEmailValid(isEmailValid)
    if (!isEmailValid) {
      emailRef.current?.focus()
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    // Validate the password before making the API call
    const isPasswordValid = validatePassword(password)
    setPasswordValid(isPasswordValid)
    if (!isPasswordValid) {
      passwordRef.current?.focus()
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    // Check if the username exists in the database before we send a request to AWS
    const debouncedCheckUsername = debounce(async (username: string): Promise<boolean> => {
      try {
        const response = await fetch('/api/check-username', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          },
          body: JSON.stringify({ username }),
        })

        const data = await response.json()
        if (!data.exists) {
          setErrorMessage('User does not exist. Please check your email address.')
          setShakeKey((prevKey) => prevKey + 1)
          setLoading(false)
          return false
        }
        return true
      } catch (error) {
        console.error('Error checking username:', error)
        setErrorMessage('An unexpected error occurred. Please try again later.')
        setShakeKey((prevKey) => prevKey + 1)
        setLoading(false)
        return false
      }
    }, 500)

    setLoading(true)

    // Use the debounced function to check the username
    const usernameExists = await debouncedCheckUsername(username)
    if (!usernameExists) return

    // Call signIn with username and password
    setTimeout(async () => {
      try {
        const response = await signIn({ username, password })
        if (response.nextStep) {
          switch (response.nextStep.signInStep) {
            case 'CONFIRM_SIGN_UP': // We're bypassing the required email verifications
              try {
                const res = await fetch('/api/confirm-user', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
                  },
                  body: JSON.stringify({ username }),
                })

                if (res.ok) {
                  // And then calling the endpoint again to complete the sign-in process
                  const newResponse = await signIn({ username, password })
                  if (newResponse.isSignedIn) {
                    await fetchUserAttributes()
                    setTimeout(() => {
                      router.push('/')
                    }, 3000)
                  } else {
                    setErrorMessage('An unexpected error occurred. Please try again later.')
                    setShakeKey((prevKey) => prevKey + 1)
                  }
                }
              } catch (error) {
                console.error(error)
                setShakeKey((prevKey) => prevKey + 1)
              }
              break
            case 'RESET_PASSWORD':
              setErrorMessage('')
              break
            case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
              setErrorMessage('')
              break
            case 'DONE':
              await fetchUserAttributes()
              setSuccessMessage(true)
              setTimeout(() => {
                router.push('/')
              }, 1500)
              break
            default:
              setErrorMessage('An unexpected step is required. Please contact support.')
              setShakeKey((prevKey) => prevKey + 1)
              break
          }
        }
      } catch (error) {
        console.error(error)
        if (error.name && CognitoErrorMessages[error.name]) {
          setErrorMessage(CognitoErrorMessages[error.name])
        } else {
          setErrorMessage('An unexpected error occurred. Please try again later.')
        }
        setShakeKey((prevKey) => prevKey + 1)
      } finally {
        setLoading(false)
      }
    }, 250)
  }

  // Sign in to the demo account
  const handleDemoSignIn = async (): Promise<void> => {
    setSuccessMessage(true)
    try {
      const newResponse = await signIn({
        username: demoUsername,
        password: demoPassword,
      })
      if (newResponse.isSignedIn) {
        await fetchUserAttributes()
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.')
        setShakeKey((prevKey) => prevKey + 1)
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again later.')
      setShakeKey((prevKey) => prevKey + 1)
    }
  }

  return (
    <>
      <Head>
        <title>Nexari Login | Sign in to your Nexari account</title>
        <meta
          name="description"
          content="Get the most out of Nexari by signing in to your account."
        />
      </Head>
      {!authChecked ? (
        <LoaderDots />
      ) : (
        <>
          <AuthStyles.AuthPageWrapper>
            <AuthStyles.AuthContainerWrapper>
              <AuthStyles.FormContainerWrapper>
                <AuthStyles.AuthCard
                  key={shakeKey}
                  style={
                    successMessage
                      ? {
                          height: '40%',
                          transition: 'height 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                        }
                      : {
                          transition: 'height 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                        }
                  }
                  shake={!!errorMessage}
                >
                  <AuthStyles.AuthCardContent
                    authFadeOut={successMessage}
                    authFadeIn={!successMessage}
                  >
                    {!successMessage ? (
                      <>
                        <AuthStyles.LogoBox>
                          <LogoSymbol alt="Nexari Logo" />
                        </AuthStyles.LogoBox>
                        <AuthStyles.HeaderText style={{ marginBottom: '0' }}>
                          Sign in to Nexari
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
                          onKeyDown={(e) =>
                            handleKeyDown(e, setShowPassword, emailValid, passwordValid)
                          }
                        >
                          <AuthStyles.EntryWrapper>
                            <AuthStyles.EntryContainer
                              ref={emailRef}
                              onChange={onChange}
                              name="username"
                              id="username"
                              required
                              type="email"
                              placeholder=""
                              autoComplete="off"
                              aria-label="Email address"
                              style={!emailValid ? invalidStyle : {}}
                              onBlur={handleEmailBlur}
                              value={username}
                              loading={loading}
                              tabIndex={loading ? -1 : 0}
                            />
                            <AuthStyles.Label
                              htmlFor="username"
                              style={!emailValid ? invalidStyle : {}}
                              loading={loading}
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
                              ref={passwordRef}
                              onChange={onChange}
                              name="password"
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder=""
                              autoComplete="current-password"
                              aria-label="Password"
                              data-form-type="password"
                              style={!passwordValid ? invalidStyle : {}}
                              onBlur={handlePasswordBlur}
                              value={password}
                              loading={loading}
                              tabIndex={loading ? -1 : 0}
                            />
                            <AuthStyles.Label
                              htmlFor="password"
                              style={!passwordValid ? invalidStyle : {}}
                              loading={loading}
                            >
                              Password
                            </AuthStyles.Label>
                            <Popover
                              trigger="hover"
                              position="right"
                              content={showPassword ? 'Hide password' : 'Show password'}
                              showArrow={false}
                              color="dark"
                              padding="4px 8px"
                            >
                              <PasswordReveal
                                onClick={() => setShowPassword(!showPassword)}
                                clicked={showPassword}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                role="button"
                                className="password-reveal-button"
                                disabled={loading}
                              />
                            </Popover>
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
                            passHref
                            className="forgot-password-button"
                          >
                            Forgot your password?
                          </AuthStyles.ResetText>
                          <AuthStyles.EntryBtnWrapper>
                            <AuthBtn
                              type="submit"
                              data-form-type="action,login"
                              loading={loading}
                              tabIndex={loading ? -1 : 0}
                              style={{ marginBottom: '24px' }}
                            >
                              {loading ? <LoaderSpin loading={loading} /> : 'Sign in'}
                            </AuthBtn>
                          </AuthStyles.EntryBtnWrapper>
                        </AuthStyles.FormContainer>
                        <AuthStyles.AuthLoginLinkBox>
                          <span>New to Nexari?</span>
                          <AuthStyles.AuthLoginLink
                            href="/signup"
                            passHref
                            className="create-account-button"
                          >
                            Create account
                          </AuthStyles.AuthLoginLink>
                        </AuthStyles.AuthLoginLinkBox>
                      </>
                    ) : (
                      <>
                        <AuthStyles.SpinnerWrapper>
                          <span>Signing in...</span>
                          <LoaderSpin loading={successMessage} />
                        </AuthStyles.SpinnerWrapper>
                      </>
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
              onClick={toggleSuccessMessage}
            >
              Toggle Success Message
            </button>
          </AuthStyles.AuthPageWrapper>
        </>
      )}
    </>
  )
}

export default Login

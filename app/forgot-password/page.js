'use client'

import React, {useState, useRef, useContext} from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import {resetPassword, confirmResetPassword, signIn} from 'aws-amplify/auth'
import {useRouter} from 'next/navigation'
import LogoSymbol from '@/public/images/logo_n.svg'
import PasswordReveal from '@/components/Auth/PasswordReveal'
import {IoCheckmarkCircleSharp} from 'react-icons/io5'
import LoaderDots from '@/components/Loaders/LoaderDots'
import CognitoErrorMessages from '@/utils/CognitoErrorMessages'
import ErrorRedirect from '@/components/Auth/ErrorRedirect'
import PropFilter from '@/utils/PropFilter'
import * as AuthStyles from '@/components/Auth/AuthStyles'
import {validateEmailDomain, validatePassword, validateCode, handleBlur} from '@/utils/AuthHelpers'
import {UserContext} from '@/context/UserContext'
import LoaderSpin from '@/components/Loaders/LoaderSpin.js'
import useRedirectIfAuthenticated from '@/hooks/useRedirectIfAuthenticated'
import {TiWarningOutline} from 'react-icons/ti'
import Popover from '@/components/Elements/Popover'
import {useMobileView} from '@/context/MobileViewContext.js'
import debounce from 'lodash.debounce'

const ContinueBtn = styled(AuthStyles.AuthBtn)`
  margin-top: 15px;
`

const SuccessMessage = styled.div`
  font-size: 14px;
  text-align: center;
`

const SubheaderText = styled.div`
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
`

const RequirementTitle = styled.div`
  padding-top: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: bold;
  align-self: flex-start;
`

const RequirementList = styled.ul`
  text-align: left;
  font-size: 12px;
  font-weight: 400;
  color: var(--sc-color-button-text-disabled);
  padding-left: 20px;
  margin: 8px 0px 0px;
  align-self: flex-start;
`

const RequirementListItem = styled(PropFilter('li')(['met']))`
  margin-bottom: 4px;
  color: var(--sc-color-green);
  list-style: none;
  margin-left: -12px;

  color: ${(props) => (props.met ? 'var(--sc-color-green)' : '#d32f2f')};

  &:before {
    content: ${(props) => (props.met ? "'✓'" : "''")};
    padding-right: ${(props) => (props.met ? '2px' : '0px')};
    font-weight: bold;
    margin-left: ${(props) => (props.met ? '-13px' : '0px')};
  }
`

const PasswordSuccess = styled.div`
  display: flex;
  color: var(--sc-color-green);
  align-self: flex-start;
  font-size: 14px;
  align-items: center;
  font-weight: 500;

  svg {
    display: inline-block;
    margin-right: 3px;
  }
`

const ForgotPassword = () => {
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showError, setShowError] = useState(false)
  const [username, setUsername] = useState('')
  const [emailValid, setEmailValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)
  const [codeValid, setCodeValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [currentStep, setCurrentStep] = useState('initial')
  const [pageLoading, setPageLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [lengthMet, setLengthMet] = useState(false)
  const [lowerCaseMet, setLowerCaseMet] = useState(false)
  const [upperCaseMet, setUpperCaseMet] = useState(false)
  const [numberMet, setNumberMet] = useState(false)
  const [specialCharMet, setSpecialCharMet] = useState(false)
  const [reqsMet, setReqsMet] = useState(false)
  const {invalidStyle} = AuthStyles
  const {fetchUserAttributes} = useContext(UserContext)
  const [isHovered, setIsHovered] = useState(false)
  const isMobileView = useMobileView()
  const hoverTimeout = useRef(null)
  const codeInputRef = useRef(null)
  const router = useRouter()

  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  // Check if there's already an active sign-in
  const authChecked = useRedirectIfAuthenticated(fetchUserAttributes)

  const obfuscateEmail = (username) => {
    const [localPart] = username.split('@')
    if (localPart.length <= 3) {
      return `${localPart}@***`
    }
    const obfuscatedLocalPart = localPart.slice(0, 3) + '*'.repeat(3)
    return `${obfuscatedLocalPart}@***`
  }

  const forwardSignUp = () => {
    router.push('/signup')
  }

  const handleKeyDown = (e) => {
    // Check if the key pressed is invalid
    if (e.key !== 'Backspace' && e.key !== 'Tab' && !/^[0-9]$/.test(e.key)) {
      e.preventDefault()
      setCodeValid(false)
    } else {
      setCodeValid(true)
    }
  }

  const resetPasswordHandler = async (username) => {
    try {
      await resetPassword({username})
    } catch (error) {
      console.error('Error resetting password:', error)
    }
  }

  const confirmResetPasswordHandler = async ({username, confirmationCode, newPassword}) => {
    try {
      await confirmResetPassword({
        username,
        confirmationCode,
        newPassword,
      })
    } catch (error) {
      console.error('Error completing password reset:', error)
    }
  }

  const handleSendCode = async (e) => {
    e.preventDefault()
    if (loading) return // Prevent form submission if loading
    setErrorMessage('') // Reset any errors when we try resetting the password again

    // Validate the email before submitting the initial reset form
    const isEmailValid = validateEmailDomain(username)
    if (!isEmailValid) {
      setEmailValid(false)
      emailRef.current.focus()
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    // Check if the username exists in the database before we send a request to AWS
    const debouncedCheckUsername = debounce(async (username) => {
      try {
        const response = await fetch('/api/check-username', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          },
          body: JSON.stringify({username}),
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

    setTimeout(async () => {
      try {
        const output = await resetPassword({username: username})
        const {nextStep} = output
        if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
          setCurrentStep('resetPassword')
        }
      } catch (error) {
        if (error.name === 'UserNotFoundException') {
          setErrorMessage(CognitoErrorMessages[error.name])
          setShakeKey((prevKey) => prevKey + 1)
        } else if (error.name === 'InvalidParameterException') {
          setErrorMessage(CognitoErrorMessages[error.name])
          setShakeKey((prevKey) => prevKey + 1)
        } else if (error.name === 'LimitExceededException') {
          setErrorMessage(CognitoErrorMessages[error.name])
          setShakeKey((prevKey) => prevKey + 1)
          setShowError(true)
        } else {
          setErrorMessage(
            CognitoErrorMessages[error.name] ||
              'An unexpected error occurred. Please try again later.',
            setShowError(true),
          )
          setShakeKey((prevKey) => prevKey + 1)
        }
      } finally {
        setLoading(false)
      }
    }, 200)
  }

  // Send the caret cursor to the end if the user tabs into the input field
  const setCaretToEnd = (input) => {
    if (input && input.value.length) {
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (loading) return // Prevent form submission if loading

    if (!code || !newPassword) {
      setErrorMessage('Code and new password cannot be empty.')
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    if (!validatePassword(newPassword)) {
      setErrorMessage('Password does not meet the requirements.')
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    if (!validateCode(code)) {
      setErrorMessage('Code does not meet the requirements.')
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    setLoading(true)
    setTimeout(async () => {
      try {
        await confirmResetPassword({
          username: username,
          confirmationCode: code,
          newPassword: newPassword,
        })

        await signIn({username, password: newPassword})

        setPasswordChanged(true)
        setErrorMessage('')
      } catch (error) {
        setPageLoading(false) // Hide loader if there's an error
        if (error.name === 'CodeMismatchException') {
          setErrorMessage(CognitoErrorMessages[error.name])
          setShakeKey((prevKey) => prevKey + 1)
          setCurrentStep('verifyCode')
        } else if (error.name === 'LimitExceededException') {
          setShakeKey((prevKey) => prevKey + 1)
          setErrorMessage(CognitoErrorMessages[error.name])
        } else {
          setErrorMessage(
            CognitoErrorMessages[error.name] ||
              'An unexpected error occurred. Please try again later.',
          )
          setShakeKey((prevKey) => prevKey + 1)
        }
      } finally {
        setLoading(false)
      }
    }, 200)
  }

  const handleEmailBlur = () => {
    handleBlur(username, validateEmailDomain, setEmailValid)
  }

  const handlePasswordBlur = () => {
    handleBlur(newPassword, validatePassword, setPasswordValid)
  }

  const handleCodeBlur = () => {
    handleBlur(code, validateCode, setCodeValid)
  }

  const onChange = (e) => {
    const {name, value} = e.target
    if (name === 'username') {
      setUsername(value)
      setEmailValid(true)
    } else if (name === 'code') {
      if (value.length <= 6) {
        setCode(value)
        setCodeValid(true)
      }
    } else if (name === 'newPassword') {
      setNewPassword(value)
      setPasswordValid(true)

      // Check password criteria
      const lengthMet = value.length >= 8 && value.length <= 20
      const lowerCaseMet = /[a-z]/.test(value)
      const upperCaseMet = /[A-Z]/.test(value)
      const numberMet = /[0-9]/.test(value)
      const specialCharMet = /[\^$*.\[\]{}\(\)?\"!@#%&\/\\,><\':;|_~`=+\-]/.test(value)

      setLengthMet(lengthMet)
      setLowerCaseMet(lowerCaseMet)
      setUpperCaseMet(upperCaseMet)
      setNumberMet(numberMet)
      setSpecialCharMet(specialCharMet)

      // Set reqsMet to true if all of the criteria are met
      setReqsMet(lengthMet && lowerCaseMet && upperCaseMet && numberMet && specialCharMet)

      // Set passwordValid based on reqsMet
      setPasswordValid(lengthMet && lowerCaseMet && upperCaseMet && numberMet && specialCharMet)
    }
  }

  // Inline style for resetPassword stage
  const resetPasswordStyle = {
    padding: '50px 25px 50px 25px',
  }

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true)
    }, 100)
  }

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(false)
    }, 400)
  }

  return (
    <>
      <Head>
        <title>Nexari Login | Sign in to your Nexari account</title>
        <meta
          name="description"
          content="Securely reset your password to regain access to your account."
        />
      </Head>
      {pageLoading ? (
        <LoaderDots />
      ) : showError ? (
        <ErrorRedirect message={errorMessage} />
      ) : (
        <AuthStyles.AuthPageWrapper>
          <AuthStyles.AuthContainerWrapper>
            <AuthStyles.FormContainerWrapper>
              <AuthStyles.AuthCard
                key={shakeKey}
                shake={!!errorMessage}
                style={
                  passwordChanged
                    ? {
                        height: '50%',
                        transition: 'height 0.5s ease-in-out',
                      }
                    : currentStep === 'resetPassword'
                      ? resetPasswordStyle
                      : {
                          transition: 'height 0.5s ease-in-out',
                        }
                }
              >
                <AuthStyles.LogoBox>
                  <LogoSymbol />
                </AuthStyles.LogoBox>
                {currentStep === 'initial' && !passwordChanged && (
                  <>
                    <AuthStyles.HeaderText>Reset your password</AuthStyles.HeaderText>
                    <SubheaderText>
                      <span>
                        In order to change your password, we need to verify your identity. Enter the
                        email address associated with your Nexari account.
                      </span>
                    </SubheaderText>
                    <AuthStyles.FormContainer
                      onSubmit={handleSendCode}
                      noValidate
                      data-form-type="forgot_password"
                    >
                      <AuthStyles.EntryWrapper>
                        <AuthStyles.EntryContainer
                          ref={emailRef}
                          onChange={onChange}
                          name="username"
                          id="username"
                          type="username"
                          placeholder=""
                          autoComplete="username"
                          style={!emailValid ? invalidStyle : {}}
                          onBlur={handleEmailBlur}
                          value={username}
                        />
                        <AuthStyles.Label
                          htmlFor="username"
                          style={!emailValid ? invalidStyle : {}}
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
                      {errorMessage && (
                        <AuthStyles.ErrorMessage>
                          <TiWarningOutline />
                          {errorMessage}
                        </AuthStyles.ErrorMessage>
                      )}
                      <ContinueBtn
                        type="submit"
                        data-form-type="action,forgot_password"
                        loading={loading}
                        tabIndex={loading ? -1 : 0}
                      >
                        {loading ? <LoaderSpin loading={loading} /> : 'Continue'}
                      </ContinueBtn>
                      <AuthStyles.ResetText
                        href="/login"
                        passHref
                        className="forgot-password-button"
                      >
                        Return to sign in
                      </AuthStyles.ResetText>
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
                )}
                {currentStep === 'resetPassword' && !passwordChanged && (
                  <>
                    <AuthStyles.HeaderText>Reset your password</AuthStyles.HeaderText>
                    <SuccessMessage>
                      <span>
                        We’ve sent your code to <strong>{obfuscateEmail(username)}</strong>
                      </span>
                      <br />
                      <SubheaderText>
                        Enter the code below, and please change your password to something you
                        haven’t used before.
                      </SubheaderText>
                    </SuccessMessage>
                    <AuthStyles.FormContainer
                      onSubmit={handleResetPassword}
                      noValidate
                      data-form-type="change_password"
                    >
                      <AuthStyles.EntryWrapper>
                        <AuthStyles.EntryContainer
                          ref={codeInputRef}
                          placeholder=""
                          type="tel"
                          name="code"
                          value={code}
                          onChange={onChange}
                          style={!codeValid ? invalidStyle : {}}
                          onBlur={handleCodeBlur}
                          onFocus={(e) => setCaretToEnd(e.target)}
                          onKeyDown={handleKeyDown}
                        />
                        <AuthStyles.Label htmlFor="code" style={!codeValid ? invalidStyle : {}}>
                          Enter your code
                        </AuthStyles.Label>
                      </AuthStyles.EntryWrapper>
                      {!codeValid && (
                        <AuthStyles.ValidationMessage>
                          <TiWarningOutline />
                          Please enter a valid six-digit code.
                        </AuthStyles.ValidationMessage>
                      )}
                      <AuthStyles.EntryWrapper>
                        <AuthStyles.EntryContainer
                          ref={passwordRef}
                          type={showPassword ? 'text' : 'password'}
                          placeholder=""
                          value={newPassword}
                          name="newPassword"
                          onChange={onChange}
                          style={!passwordValid ? invalidStyle : {}}
                          onBlur={handlePasswordBlur}
                        />
                        <AuthStyles.Label
                          htmlFor="password"
                          style={!passwordValid ? invalidStyle : {}}
                        >
                          New password
                        </AuthStyles.Label>
                        <PasswordReveal
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          clicked={showPassword}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          role="button"
                          className="password-reveal-button"
                        />
                      </AuthStyles.EntryWrapper>
                      {!passwordValid && (
                        <AuthStyles.ValidationMessage>
                          <TiWarningOutline />
                          Please enter a valid password.
                        </AuthStyles.ValidationMessage>
                      )}
                      {reqsMet && (
                        <PasswordSuccess>
                          <IoCheckmarkCircleSharp size={16} />
                          Your password is ready to go!
                        </PasswordSuccess>
                      )}
                      {errorMessage && (
                        <AuthStyles.ErrorMessage>
                          <TiWarningOutline />
                          {errorMessage}
                        </AuthStyles.ErrorMessage>
                      )}
                      {!reqsMet && (
                        <>
                          <RequirementTitle>Must contain:</RequirementTitle>
                          <RequirementList>
                            <RequirementListItem
                              data-test={lengthMet ? 'lengthSuccess' : 'lengthNotMet'}
                              met={lengthMet}
                            >
                              <span>8-20 characters</span>
                            </RequirementListItem>
                          </RequirementList>
                          <RequirementTitle>And 1 of the following:</RequirementTitle>
                          <RequirementList>
                            <RequirementListItem
                              data-test={lowerCaseMet ? 'lowerCaseSuccess' : 'lowerCaseNotMet'}
                              met={lowerCaseMet}
                            >
                              <span>Lowercase letters</span>
                            </RequirementListItem>
                            <RequirementListItem
                              data-test={upperCaseMet ? 'upperCaseSuccess' : 'upperCaseNotMet'}
                              met={upperCaseMet}
                            >
                              <span>Uppercase letters</span>
                            </RequirementListItem>
                            <RequirementListItem
                              data-test={numberMet ? 'numberSuccess' : 'numberNotMet'}
                              met={numberMet}
                            >
                              <span>Numbers</span>
                            </RequirementListItem>
                            <RequirementListItem
                              data-test={
                                specialCharMet ? 'specialCharSuccess' : 'specialCharNotMet'
                              }
                              met={specialCharMet}
                            >
                              <span>Special characters, except {'< >'}</span>
                            </RequirementListItem>
                          </RequirementList>
                        </>
                      )}
                      <AuthStyles.AuthBtn
                        type="submit"
                        data-form-type="action,change_password"
                        disabled={!passwordValid || !reqsMet} // Just to be safe
                        style={{marginTop: '10px'}}
                      >
                        Create password
                      </AuthStyles.AuthBtn>
                    </AuthStyles.FormContainer>
                  </>
                )}
                {passwordChanged && (
                  <>
                    <AuthStyles.HeaderText style={{textAlign: 'center'}}>
                      You've successfully changed your password
                    </AuthStyles.HeaderText>
                    <ContinueBtn type="button" onClick={() => router.push('/')}>
                      Continue to Nexari
                    </ContinueBtn>
                  </>
                )}
              </AuthStyles.AuthCard>
              {!isMobileView && (
                <Popover
                  label={showPassword ? 'Hide password' : 'Show password'}
                  animate={isHovered}
                  exited={!isHovered}
                  trigger={passwordRef}
                />
              )}
            </AuthStyles.FormContainerWrapper>
          </AuthStyles.AuthContainerWrapper>
        </AuthStyles.AuthPageWrapper>
      )}
    </>
  )
}

export default ForgotPassword

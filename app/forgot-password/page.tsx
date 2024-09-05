'use client'

import React, { useState, useContext, FormEvent } from 'react'
import styled from 'styled-components'
import { resetPassword, confirmResetPassword, signIn } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import LogoSymbol from '@/public/images/logo_solid.svg'
import PasswordReveal from '@/components/Auth/PasswordReveal'
import LoaderDots from '@/components/Loaders/LoaderDots'
import { CognitoErrorMessages } from '@/lib/constants'
import ErrorRedirect from '@/components/Auth/ErrorRedirect'
import * as AuthStyles from '@/components/Auth/AuthStyles'
import { getValidationStyle } from '@/utils/authHelpers'
import { UserContext } from '@/context/UserContext'
import LoaderSpin from '@/components/Loaders/LoaderSpin'
import useRedirectIfAuthenticated from '@/hooks/useRedirectIfAuthenticated'
import { TiWarningOutline } from 'react-icons/ti'
import Popover from '@/components/Elements/Popover'
import { useMobileView } from '@/context/MobileViewContext'
import { useAuthFormValidation } from '@/hooks/useAuthFormValidation'
import { debouncedCheckUsername } from '@/utils/checkUsername'

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

const ForgotPassword: React.FC = () => {
  const { formState, emailValid, passwordValid, codeValid, onChange, onBlur } =
    useAuthFormValidation({
      username: '',
      password: '',
      newPassword: '',
      code: '',
    })
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showError, setShowError] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [passwordChanged, setPasswordChanged] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<
    'initial' | 'resetPassword' | 'verifyCode'
  >('initial')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [shakeKey, setShakeKey] = useState<number>(0)
  const { invalidStyle } = AuthStyles
  const { fetchUserAttributes } = useContext(UserContext)
  const isMobileView = useMobileView()
  const router = useRouter()

  type CognitoErrorName = keyof typeof CognitoErrorMessages

  const GENERIC_ERROR_MESSAGE =
    'An unexpected error occurred. Please try again later.'

  // Check if there's already an active sign-in
  const authChecked = useRedirectIfAuthenticated(fetchUserAttributes)

  if (!authChecked) {
    return <LoaderDots />
  }

  const obfuscateEmail = (username: string): string => {
    const [localPart] = username.split('@')
    if (localPart.length <= 3) {
      return `${localPart}@***`
    }
    const obfuscatedLocalPart = localPart.slice(0, 3) + '*'.repeat(3)
    return `${obfuscatedLocalPart}@***`
  }

  const handleSendCode = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    if (isLoading) {
      setErrorMessage('')
      return
    }

    // Validate the email before submitting the initial reset form
    if (!emailValid || !formState.username) {
      setErrorMessage('Please fill in all fields with valid information.')
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    // Check if the username exists in the database before we send a request to AWS
    const usernameExists = await debouncedCheckUsername(
      formState.username,
      setErrorMessage,
      setShakeKey,
      setLoading
    )
    if (!usernameExists) {
      return
    }

    setLoading(true)

    setTimeout(async () => {
      try {
        const output = await resetPassword({ username: formState.username })
        const { nextStep } = output

        if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
          setCurrentStep('resetPassword')
        }
      } catch (err) {
        const error = err as Error

        const errorMessage =
          CognitoErrorMessages[error.name as CognitoErrorName] ||
          GENERIC_ERROR_MESSAGE
        const showError = errorMessage === GENERIC_ERROR_MESSAGE

        setErrorMessage(errorMessage)
        setShakeKey((prevKey) => prevKey + 1)
        setShowError(showError)
      } finally {
        setLoading(false)
      }
    }, 200)
  }

  const handleResetPassword = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    if (isLoading) {
      setErrorMessage('')
      return
    }

    if (!formState.code || !formState.newPassword) {
      setErrorMessage('Code and new password cannot be empty.')
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    setLoading(true)
    setTimeout(async () => {
      try {
        await confirmResetPassword({
          username: formState.username,
          confirmationCode: formState.code!,
          newPassword: formState.newPassword!,
        })

        // Sign the user in after a successful reset
        await signIn({
          username: formState.username,
          password: formState.newPassword,
        })

        setPasswordChanged(true)
        setErrorMessage('')
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'CodeMismatchException') {
            setErrorMessage(
              CognitoErrorMessages[error.name as CognitoErrorName]
            )
            setShakeKey((prevKey) => prevKey + 1)
            setCurrentStep('verifyCode')
          } else if (error.name === 'LimitExceededException') {
            setShakeKey((prevKey) => prevKey + 1)
            setErrorMessage(
              CognitoErrorMessages[error.name as CognitoErrorName]
            )
          } else {
            setErrorMessage(
              CognitoErrorMessages[error.name as CognitoErrorName] ||
                GENERIC_ERROR_MESSAGE
            )
            setShakeKey((prevKey) => prevKey + 1)
          }
        } else {
          setErrorMessage(GENERIC_ERROR_MESSAGE)
          setShakeKey((prevKey) => prevKey + 1)
        }
      } finally {
        setLoading(false)
      }
    }, 200)
  }

  const authCardStyle = {
    transition: 'height 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    ...(passwordChanged && { height: '50%' }),
  }

  return (
    <>
      {showError ? (
        <ErrorRedirect message={errorMessage} />
      ) : (
        <AuthStyles.AuthPageWrapper>
          <AuthStyles.AuthContainerWrapper>
            <AuthStyles.FormContainerWrapper>
              <AuthStyles.AuthCard
                key={shakeKey}
                $shake={!!errorMessage}
                style={authCardStyle}
              >
                <AuthStyles.LogoBox>
                  <LogoSymbol />
                </AuthStyles.LogoBox>
                {currentStep === 'initial' && (
                  <>
                    <AuthStyles.HeaderText>
                      Reset your password
                    </AuthStyles.HeaderText>
                    <SubheaderText>
                      <span>
                        In order to change your password, we need to verify your
                        identity. Enter the email address associated with your
                        Threadly account.
                      </span>
                    </SubheaderText>
                    <AuthStyles.FormContainer
                      onSubmit={handleSendCode}
                      noValidate
                      data-form-type="forgot_password"
                    >
                      <AuthStyles.EntryWrapper>
                        <AuthStyles.EntryContainer
                          onChange={onChange}
                          onBlur={onBlur}
                          name="username"
                          id="username"
                          type="username"
                          placeholder=""
                          autoComplete="username"
                          style={getValidationStyle(!emailValid, invalidStyle)}
                          value={formState.username}
                        />
                        <AuthStyles.Label
                          htmlFor="username"
                          style={getValidationStyle(!emailValid, invalidStyle)}
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
                        $isLoading={isLoading}
                      >
                        {isLoading ? (
                          <LoaderSpin isLoading={isLoading} />
                        ) : (
                          'Continue'
                        )}
                      </ContinueBtn>
                      <AuthStyles.ResetText
                        href="/login"
                        className="forgot-password-button"
                      >
                        Return to sign in
                      </AuthStyles.ResetText>
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
                )}
                {currentStep === 'resetPassword' && (
                  <>
                    <AuthStyles.HeaderText>
                      Reset your password
                    </AuthStyles.HeaderText>
                    <SuccessMessage>
                      <span>
                        We’ve sent your code to{' '}
                        <strong>{obfuscateEmail(formState.username)}</strong>
                      </span>
                      <br />
                      <SubheaderText>
                        Enter the code below, and please change your password to
                        something you haven’t used before.
                      </SubheaderText>
                    </SuccessMessage>
                    <AuthStyles.FormContainer
                      onSubmit={handleResetPassword}
                      noValidate
                      data-form-type="change_password"
                    >
                      <AuthStyles.EntryWrapper>
                        <AuthStyles.EntryContainer
                          placeholder=""
                          type="tel"
                          name="code"
                          value={formState.code}
                          onChange={onChange}
                          style={getValidationStyle(!codeValid, invalidStyle)}
                          onBlur={onBlur}
                        />
                        <AuthStyles.Label
                          htmlFor="code"
                          style={getValidationStyle(!codeValid, invalidStyle)}
                        >
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
                          type={showPassword ? 'text' : 'password'}
                          placeholder=""
                          value={formState.newPassword}
                          name="new-password"
                          onChange={onChange}
                          style={getValidationStyle(
                            !passwordValid,
                            invalidStyle
                          )}
                          onBlur={onBlur}
                        />
                        <AuthStyles.Label
                          htmlFor="password"
                          style={getValidationStyle(
                            !passwordValid,
                            invalidStyle
                          )}
                        >
                          New password
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
                      <AuthStyles.AuthBtn
                        type="submit"
                        data-form-type="action,change_password"
                        disabled={!passwordValid}
                        style={{ marginTop: '10px' }}
                      >
                        Create password
                      </AuthStyles.AuthBtn>
                    </AuthStyles.FormContainer>
                  </>
                )}
                {passwordChanged && (
                  <>
                    <AuthStyles.HeaderText style={{ textAlign: 'center' }}>
                      You've successfully changed your password
                    </AuthStyles.HeaderText>
                    <ContinueBtn type="button" onClick={() => router.push('/')}>
                      Continue to Threadly
                    </ContinueBtn>
                  </>
                )}
              </AuthStyles.AuthCard>
            </AuthStyles.FormContainerWrapper>
          </AuthStyles.AuthContainerWrapper>
        </AuthStyles.AuthPageWrapper>
      )}
    </>
  )
}

export default ForgotPassword

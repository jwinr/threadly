"use client"

import React, { useState, useEffect, useRef, useContext } from "react"
import { signUp, signIn } from "aws-amplify/auth"
import { fetchAuthSession } from "aws-amplify/auth"
import styled from "styled-components"
import { useRouter } from "next/navigation"
import PasswordReveal from "@/components/Auth/PasswordReveal"
import LogoSymbol from "@/public/images/logo_n.svg"
import Popover from "@/components/Elements/Popover"
import Head from "next/head"
import CognitoErrorMessages from "@/utils/CognitoErrorMessages.js"
import * as AuthStyles from "@/components/Auth/AuthStyles"
import {
  validateEmailDomain,
  validatePassword,
  validateFullName,
  handleBlur,
  handleKeyDown,
  splitFullName,
} from "@/utils/authHelpers"
import { UserContext } from "@/context/UserContext"
import LoaderDots from "@/components/Loaders/LoaderDots.js"
import LoaderSpin from "@/components/Loaders/LoaderSpin.js"
import useRedirectIfAuthenticated from "@/hooks/useRedirectIfAuthenticated"
import { TiWarningOutline } from "react-icons/ti"
import { useMobileView } from "@/context/MobileViewContext.js"

const SubheaderText = styled.h1`
  font-weight: 500;
  font-size: 18px;
  padding: 5px;
`

const SignUp = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [fullNameValid, setFullNameValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [signUpResponse, setSignUpResponse] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const { fetchUserAttributes } = useContext(UserContext)
  const [shakeKey, setShakeKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const hoverTimeout = useRef(null)
  const [isButtonInvalid, setIsButtonInvalid] = useState(true)
  const isMobileView = useMobileView()
  const { invalidStyle } = AuthStyles

  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const fullNameRef = useRef(null)

  const router = useRouter()
  // Check if there's already an active sign-in
  const authChecked = useRedirectIfAuthenticated(fetchUserAttributes)

  useEffect(() => {
    const isEmailValid = validateEmailDomain(username)
    const isPasswordValid = validatePassword(password)
    const isFullNameValid = validateFullName(fullName)

    setIsButtonInvalid(!(isEmailValid && isPasswordValid && isFullNameValid))
  }, [username, password, fullName])

  // Automatically log the user in once they're confirmed
  const confirmUser = async () => {
    try {
      const signInResponse = await signIn({
        username: username,
        password: password,
      })

      if (signInResponse.isSignedIn) {
        await fetchUserAttributes()
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.")
        setShakeKey((prevKey) => prevKey + 1)
      }
    } catch (error) {
      console.error("SignIn Error:", error)
      if (error.response && error.response.data) {
        console.error("SignIn Error Details:", error.response.data)
      }
      setErrorMessage("An unexpected error occurred. Please try again later.")
      setShakeKey((prevKey) => prevKey + 1)
    }
  }

  const handleEmailBlur = () => {
    handleBlur(username, validateEmailDomain, setEmailValid)
  }

  const handleFullNameBlur = () => {
    handleBlur(fullName, validateFullName, setFullNameValid)
  }

  const handlePasswordBlur = () => {
    handleBlur(password, validatePassword, setPasswordValid)
  }

  const onChange = (e) => {
    const { name, value } = e.target
    if (name === "username") {
      setUsername(value)
      setEmailValid(true)
    } else if (name === "password") {
      setPassword(value)
      setPasswordValid(true)
    } else if (name === "full_name") {
      setFullName(value)
      setFullNameValid(true)
    }
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const checkUsername = async (username) => {
    await delay(500)

    try {
      const response = await fetch("/api/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ username }),
      })

      const data = await response.json()
      if (data.exists) {
        setErrorMessage(
          "An account with the given email already exists. Please use a different email."
        )
        setShakeKey((prevKey) => prevKey + 1)
        return false
      }
      return true
    } catch (error) {
      console.error("Error checking username:", error)
      setErrorMessage("An unexpected error occurred. Please try again later.")
      setShakeKey((prevKey) => prevKey + 1)
      return false
    }
  }

  // Send the AWS user details to the backend for Stripe & Postgres creation
  const sendUserDetails = async (user) => {
    try {
      const response = await fetch("/api/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        throw new Error("Failed to send user details.")
      }
    } catch (error) {
      console.error("Error sending user details:", error)
      setErrorMessage("Failed to send user details. Please try again later.")
      setShakeKey((prevKey) => prevKey + 1)
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    if (loading) return
    setErrorMessage("")

    const isEmailValid = validateEmailDomain(username)
    const isPasswordValid = validatePassword(password)
    const isFullNameValid = validateFullName(fullName)

    setEmailValid(isEmailValid)
    setPasswordValid(isPasswordValid)
    setFullNameValid(isFullNameValid)

    if (!isEmailValid) {
      emailRef.current.focus()
      return
    } else if (!isFullNameValid) {
      fullNameRef.current.focus()
      setShakeKey((prevKey) => prevKey + 1)
      return
    } else if (!isPasswordValid) {
      passwordRef.current.focus()
      setShakeKey((prevKey) => prevKey + 1)
      return
    }

    setLoading(true)

    const usernameExists = await checkUsername(username)
    if (!usernameExists) {
      setLoading(false)
      return
    } else if (usernameExists) {
      const { firstName, lastName } = splitFullName(fullName)

      try {
        const signUpResponse = await signUp({
          username,
          password,
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
            email: username,
            given_name: firstName,
            family_name: lastName,
          })
        }

        // Call confirmUser after a successful sign-up
        await confirmUser()
      } catch (error) {
        console.error("Error during sign up:", error)
        if (error.name && CognitoErrorMessages[error.name]) {
          setErrorMessage(CognitoErrorMessages[error.name])
        } else {
          setErrorMessage(
            "An unexpected error occurred. Please try again later."
          )
        }
        setShakeKey((prevKey) => prevKey + 1)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRedirect = () => {
    router.push("/")
  }

  const forwardLogin = () => {
    router.push("/login")
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
      </Head>
      {!authChecked ? (
        <LoaderDots />
      ) : (
        <AuthStyles.AuthContainerWrapper>
          <AuthStyles.FormContainerWrapper>
            <AuthStyles.AuthCard key={shakeKey} shake={!!errorMessage}>
              <AuthStyles.AuthCardContent>
                <AuthStyles.LogoBox>
                  <LogoSymbol />
                </AuthStyles.LogoBox>
                {signUpResponse &&
                signUpResponse.nextStep &&
                signUpResponse.nextStep.signUpStep === "DONE" ? (
                  /* We're using a Lambda function to automatically confirm the user for demonstrative purposes.
                  /* In a proper use-case, we would use the "CONFIRM_SIGN_UP" step, collect a code from the
                  /* user, and call confirmSignUp. */
                  <>
                    <AuthStyles.HeaderText style={{ textAlign: "center" }}>
                      Success! Your Nexari acccount has been created.
                    </AuthStyles.HeaderText>
                    <SubheaderText style={{ marginBottom: "30px" }}>
                      You're ready to start shopping!
                    </SubheaderText>
                    <AuthStyles.AuthBtn onClick={handleRedirect} type="button">
                      Shop now
                    </AuthStyles.AuthBtn>
                  </>
                ) : (
                  <>
                    <AuthStyles.HeaderText>
                      Create your Nexari account
                    </AuthStyles.HeaderText>
                    <AuthStyles.FormContainer
                      onSubmit={handleSignUp}
                      noValidate
                      data-form-type="register"
                      onKeyDown={handleKeyDown}
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
                      <AuthStyles.EntryWrapper>
                        <AuthStyles.EntryContainer
                          ref={fullNameRef}
                          onChange={onChange}
                          type="text"
                          id="full_name"
                          name="full_name"
                          placeholder=""
                          required
                          autoComplete="off"
                          aria-required="true"
                          value={fullName}
                          data-form-type="name,full"
                          style={!fullNameValid ? invalidStyle : {}}
                          onBlur={handleFullNameBlur}
                        />
                        <AuthStyles.Label
                          htmlFor="full_name"
                          style={!fullNameValid ? invalidStyle : {}}
                        >
                          Full Name
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
                          ref={passwordRef}
                          onChange={onChange}
                          name="password"
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder=""
                          value={password}
                          autoComplete="new-password"
                          aria-label="Password"
                          data-form-type="password,new"
                          style={!passwordValid ? invalidStyle : {}}
                          onBlur={handlePasswordBlur}
                        />
                        <AuthStyles.Label
                          htmlFor="password"
                          style={!passwordValid ? invalidStyle : {}}
                        >
                          Password
                        </AuthStyles.Label>
                        <PasswordReveal
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          clicked={showPassword}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          disabled={loading}
                        />
                      </AuthStyles.EntryWrapper>
                      {!isMobileView && (
                        <Popover
                          label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          animate={isHovered}
                          exited={!isHovered}
                          tooltipRef={passwordRef}
                        />
                      )}
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
                          loading={loading}
                          tabIndex={loading || isButtonInvalid ? -1 : 0}
                          style={{ marginTop: "10px" }}
                          isInvalid={isButtonInvalid}
                        >
                          {loading ? (
                            <LoaderSpin loading={loading} />
                          ) : (
                            "Create account"
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
      )}
    </>
  )
}

export default SignUp

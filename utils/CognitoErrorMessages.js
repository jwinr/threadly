// Custom error messages based on Cognito error codes
const CognitoErrorMessages = {
  UsernameExistsException:
    "An account with the given email already exists. Please use a different email.",
  UserNotFoundException:
    "User does not exist. Please check your email address.",
  NotAuthorizedException: "Incorrect email address or password.",
  UserNotConfirmedException: "User has not been confirmed yet.",
  CodeMismatchException: "Invalid verification code. Please try again.",
  InvalidParameterException:
    "This email hasn't been verified. Please contact support.",
  ExpiredCodeException:
    "The verification code has expired. Please request a new one.",
  LimitExceededException:
    "You have exceeded the allowed number of attempts. Please try again later.",
  UserAlreadyAuthenticatedException: "There is already a signed in user.",
}

export default CognitoErrorMessages

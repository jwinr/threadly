import debounce from 'lodash.debounce'

const GENERIC_ERROR_MESSAGE =
  'An unexpected error occurred. Please try again later.'

export const debouncedCheckUsername = debounce(
  async (
    username: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShakeKey: React.Dispatch<React.SetStateAction<number>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      const data = (await response.json()) as { exists: boolean }
      if (!data.exists) {
        setErrorMessage('Invalid username or password.')
        setShakeKey((prevKey) => prevKey + 1)
        setLoading(false)
        return false
      }
      return true
    } catch (error) {
      console.error('Error checking username:', error)
      setErrorMessage(GENERIC_ERROR_MESSAGE)
      setShakeKey((prevKey) => prevKey + 1)
      setLoading(false)
      return false
    }
  },
  500
)

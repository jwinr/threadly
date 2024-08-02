import React, { createContext, useContext, useState, useRef } from "react"
import ToastManager from "../components/Elements/Toast"

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)

  const showToast = (message, options = {}) => {
    return new Promise((resolve) => {
      const id = ++toastIdRef.current
      const { type, action, onAction } = options
      let timeoutDuration = 4000

      if (type === "pending" && !action) timeoutDuration = undefined
      else if (type === "pending" && action) timeoutDuration = undefined
      else if (!type === "pending" && action) timeoutDuration = 6000

      const onDismiss = () => {
        setToasts((prevToasts) =>
          prevToasts.map((toast) =>
            toast.id === id ? { ...toast, isVisible: false } : toast
          )
        )

        setTimeout(() => {
          setToasts((prevToasts) =>
            prevToasts.filter((toast) => toast.id !== id)
          )
        }, 200) // Allow time for the transition to complete
      }

      const newToast = {
        id,
        message,
        type,
        action,
        onAction,
        timeout: timeoutDuration,
        onDismiss,
        isVisible: true,
      }

      setToasts((prevToasts) => [...prevToasts, newToast])

      if (timeoutDuration !== undefined) {
        setTimeout(onDismiss, timeoutDuration)
      }

      resolve({
        update: (updateMessage, updateOptions = {}) => {
          setToasts((prevToasts) =>
            prevToasts.map((toast) =>
              toast.id === id
                ? { ...toast, ...updateOptions, message: updateMessage }
                : toast
            )
          )
        },
        dismiss: () => {
          onDismiss()
        },
      })
    })
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastManager toasts={toasts} />
    </ToastContext.Provider>
  )
}

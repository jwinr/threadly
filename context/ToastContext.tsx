'use client'

import React, {
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react'
import ToastManager from '../components/Elements/Toast'

interface ToastOptions {
  type?: 'success' | 'caution' | 'pending' | undefined
  action?: string
  onAction?: () => void
}

interface Toast {
  id: number
  message: string
  type: 'success' | 'caution' | 'pending' | undefined
  action?: string
  onAction?: () => void
  timeout?: number
  onDismiss: () => void
  isVisible: boolean
  index: number
}

interface ToastContextType {
  showToast: (
    message: string,
    options?: ToastOptions
  ) => Promise<{
    update: (updateMessage: string, updateOptions?: ToastOptions) => void
    dismiss: () => void
  }>
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  const showToast = (
    message: string,
    options: ToastOptions = {}
  ): Promise<{
    update: (updateMessage: string, updateOptions?: ToastOptions) => void
    dismiss: () => void
  }> => {
    return new Promise((resolve) => {
      const id = ++toastIdRef.current
      const { type, action, onAction } = options
      let timeoutDuration: number | undefined = 4000

      if (type === 'pending' && !action) {
        timeoutDuration = undefined
      } else if (type === 'pending' && action) {
        timeoutDuration = undefined
      } else if (action && type !== 'pending') {
        timeoutDuration = 6000
      }

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

      const newToast: Toast = {
        id,
        message,
        type,
        action,
        onAction,
        timeout: timeoutDuration,
        onDismiss,
        isVisible: true,
        index: toasts.length,
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

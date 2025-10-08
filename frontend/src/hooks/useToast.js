import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const useToast = () => {
  const showToast = (message, type = 'info', options = {}) => {
    const defaultOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    }

    switch (type) {
      case 'success':
        return toast.success(message, defaultOptions)
      case 'error':
        return toast.error(message, defaultOptions)
      case 'warning':
        return toast.warning(message, defaultOptions)
      case 'info':
      default:
        return toast.info(message, defaultOptions)
    }
  }

  const dismissToast = (toastId) => {
    toast.dismiss(toastId)
  }

  const dismissAllToasts = () => {
    toast.dismiss()
  }

  return {
    showToast,
    dismissToast,
    dismissAllToasts
  }
}
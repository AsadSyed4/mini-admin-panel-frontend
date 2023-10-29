import { computed, ref } from 'vue'

export const success = ref<string>()
export const error = ref<string>()
export const info = ref<string>()
export const warning = ref<string>()

export const isToastVisible = computed<string | boolean>(() => {
  if (success.value)
    return 'success'
  else if (error.value)
    return 'error'
  else if (info.value)
    return 'info'
  else if (warning.value)
    return 'warning'
  else return false
})

export function hideToast(whichToastToHide: string) {
  switch (whichToastToHide) {
    case 'success':
      success.value = ''
      break
    case 'info':
      info.value = ''
      break
    case 'warning':
      warning.value = ''
      break
    case 'error':
      error.value = ''
      break
    default:
      break
  }
}

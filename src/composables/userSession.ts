import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'

export type UserData = Record<string, any> | null

export const useUserSession = defineStore('userSession', () => {
  let user: any

  try {
    user = useStorage('user', <Partial<UserData>>{})
  }
  catch (error) {
    user = ref<Partial<UserData>>({})
  }

  const isLoggedIn = computed(() => {
    return user.value !== undefined
      && user.value != null
      && typeof user.value == 'object'
      && Object.keys(user.value).length !== 0
  })

  function setUser(newUser: any) {
    user.value = newUser
  }

  async function logoutUser() {
    user.value = null
  }

  return {
    user,
    isLoggedIn,
    logoutUser,
    setUser,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot))

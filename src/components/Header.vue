<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '@/composables/useSidebar'
import { showLoader } from '@/composables/useLoader'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useUserSession } from '@/composables/userSession'
import { error } from "@/composables/useToast";

const api = useApi()
const userSession = useUserSession()
const router = useRouter();
const dropdownOpen = ref(false)
const { isOpen } = useSidebar()

//logic for auto logout if dashboard is not being used
let timer: number;

function startInactivityTimer() {
  timer = setTimeout(() => {
    if (userSession.isLoggedIn) {
      logout()
    }
  }, 10 * 60 * 1000)
}

function resetInactivityTimer() {
  clearTimeout(timer)
  startInactivityTimer()
}

document.addEventListener('click', resetInactivityTimer)
document.addEventListener('mousemove', resetInactivityTimer)
document.addEventListener('keypress', resetInactivityTimer)

startInactivityTimer()

const logout = async () => {
  showLoader.value = true
  try {
    let res = await api.get('logout')
    if (res.status === 200) {
      userSession.logoutUser()
      router.push({ name: 'Login' });
    }
  } catch (err: any) {
    if (err && err.response) {
      const { status } = err.response
      if (status == 422 || status == 401) {
        if (err.response.data && err.response.data.message) {
          if (err.response.data.message.includes(',')) {
            const errorMessagesArray = err.response.data.message.split(", ");
            for (const errorMessage of errorMessagesArray) {
              error.value = errorMessage
            }
          } else {
            error.value = err.response.data.message
          }
        } else {
          error.value = err.message || 'An error occurred.'
        }
      } else {
        error.value = 'Something went wrong while logging out.'
      }
    }
  } finally {
    showLoader.value = false
  }
}
</script>

<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
    <div class="flex items-center">
      <button class="text-gray-500 focus:outline-none lg:hidden" @click="isOpen = true">
        <Icon name="sideOpener" />
      </button>
    </div>

    <div class="flex items-center">
      <button class="flex mx-4 text-gray-600 focus:outline-none">
        <Icon name="bell" />
      </button>

      <div class="relative">
        <button class="relative z-10 block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none"
          @click="dropdownOpen = !dropdownOpen">
          <Icon name="user" />
        </button>

        <div v-show="dropdownOpen" class="fixed inset-0 z-10 w-full h-full" @click="dropdownOpen = false" />

        <transition enter-active-class="transition duration-150 ease-out transform" enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100" leave-active-class="transition duration-150 ease-in transform"
          leave-from-class="scale-100 opacity-100" leave-to-class="scale-95 opacity-0">
          <div v-show="dropdownOpen" class="absolute right-0 z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
            <div @click="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">
              Log out
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

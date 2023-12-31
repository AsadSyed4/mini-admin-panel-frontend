<script setup lang="ts">
import { error, hideToast, info, isToastVisible, success, warning } from '@/composables/useToast'
</script>

<template>
  <div v-if="isToastVisible" class="fixed top-3 right-5 z-50">
    <div v-if="isToastVisible === 'success'" class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-white rounded-lg shadow-md mb-2">
      <div class="flex items-center justify-center w-12 bg-green-500">
        <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
          />
        </svg>
      </div>

      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span class="font-semibold text-green-500">Success</span>
          <p class="text-sm text-gray-600">
            {{ success }}
          </p>
        </div>
      </div>

      <button class="absolute top-0 right-0 text-black text-2xl" @click="hideToast('success')">
        &times;
      </button>
    </div>

    <div v-if="isToastVisible === 'info'" class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-white rounded-lg shadow-md mb-2">
      <div class="flex items-center justify-center w-12 bg-blue-500">
        <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
          />
        </svg>
      </div>

      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span class="font-semibold text-blue-500">Info</span>
          <p class="text-sm text-gray-600">
            {{ info }}
          </p>
        </div>
      </div>

      <button class="absolute top-0 right-0 text-black text-2xl" @click="hideToast('info')">
        &times;
      </button>
    </div>

    <div v-if="isToastVisible === 'warning'" class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-white rounded-lg shadow-md mb-2">
      <div class="flex items-center justify-center w-12 bg-yellow-500">
        <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
          />
        </svg>
      </div>

      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span class="font-semibold text-yellow-500">Warning</span>
          <p class="text-sm text-gray-600">
            {{ warning }}
          </p>
        </div>
      </div>

      <button class="absolute top-0 right-0 text-black text-2xl" @click="hideToast('warning')">
        &times;
      </button>
    </div>

    <div v-if="isToastVisible === 'error'" class="inline-flex w-full max-w-sm ml-3 overflow-hidden bg-white rounded-lg shadow-md mb-2">
      <div class="flex items-center justify-center w-12 bg-red-500">
        <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
          />
        </svg>
      </div>

      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span class="font-semibold text-red-500">Error</span>
          <p class="text-sm text-gray-600">
            {{ error }}
          </p>
        </div>
      </div>

      <button class="absolute top-0 right-0 text-black text-2xl" @click="hideToast('error')">
        &times;
      </button>
    </div>
  </div>
</template>

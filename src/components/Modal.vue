<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: String,
  showModal: Boolean,
  showSpinner: Boolean,
})

const emit = defineEmits(['update:showModal'])

const closeModal = () => {
  emit('update:showModal', false);
}
</script>

<template>
  <div
    :class="`modal ${!showModal && 'opacity-0 pointer-events-none'} z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`">
    <div class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay" @click="closeModal" />

    <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">
      <div class="px-2 pt-2 flex items-center justify-between pb-3 bg-gray-300">
        <p class="text-2xl font-bold text-left">
          {{ title }}
        </p>
        <div class="z-50 cursor-pointer modal-close" @click="closeModal">
          <Icon name="cross" />
        </div>
      </div>
      <div class="relative px-3 py-4">
        <div v-if="showSpinner"
          class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div class="w-8 h-8">
            <Icon name="spinner" />
          </div>
        </div>
        <slot name="content" />
      </div>
      <div class="flex justify-center mx-2 mb-2">
        <slot name="action" />
        <button
          class="px-6 py-3 mt-3 ml-2 font-medium tracking-wide-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 hover-text-indigo-400 focus:outline-none"
          @click="closeModal">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>

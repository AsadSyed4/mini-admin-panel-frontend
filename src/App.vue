<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '@/components/Toast.vue'
import Loader from '@/components/Loader.vue'

const defaultLayout = 'default'

const { currentRoute } = useRouter()

const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`)
</script>

<template>
  <Loader/>
  <Toast />

  <component :is="layout">
    <router-view />
  </component>
</template>

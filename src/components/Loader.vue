<script setup lang="ts">
import { showLoader } from '@/composables/useLoader'
</script>

<template>
    <div v-if="showLoader" class="flex items-center justify-center z-50 fixed w-full h-full top-0 left-0">
        <div class="flex items-center justify-center absolute w-full h-full bg-gray-900 opacity-50 modal-overlay">
            <div role="status" class="w-8 h-8 mx-auto">
                <Icon name="spinner"/>
            </div>
            <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>  
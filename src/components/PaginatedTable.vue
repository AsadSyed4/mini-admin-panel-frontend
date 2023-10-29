<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, ref } from 'vue'

const props = defineProps({
  searchFilter: {
    type: Function as PropType<(data: any, searchTerm: string) => any>,
    required: true,
  },
  records: {
    type: Array,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
})

const itemsPerPage = ref(10)
const currentPage = ref(1)
const searchTerm = ref('')
const filteredData = computed(() => {
  return props.searchFilter(props.records, searchTerm.value)
})

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredData.value.slice(startIndex, endIndex)
})
</script>

<template>
  <div class="flex flex-col mt-3 sm:flex-row">
    <div class="relative block mt-2 sm:mt-0">
      <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
          <path
            d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
          />
        </svg>
      </span>

      <input
        v-model="searchTerm" placeholder="Search"
        class="block w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded-l rounded-r appearance-none sm:rounded-l-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
      >
    </div>
  </div>

  <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
    <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <slot name="headings" />
          </thead>
          <tbody class="bg-white">
            <tr v-if="paginatedData" v-for="(record, index) in paginatedData" :key="index">
              <slot name="row" :record="record" />
            </tr>
            <td v-else :colspan="props.columns" class="px-6 py-4 text-center border-b border-gray-200">
                No Data found.
            </td>
          </tbody>
        </table>
      </div>
      <div class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
        <span class="text-xs text-gray-900 xs:text-sm">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{ Math.min(currentPage * itemsPerPage, filteredData.length) }}
          of {{ filteredData.length }} Entries
        </span>

        <div class="inline-flex mt-2 xs:mt-0">
          <button
            v-if="!(currentPage === 1)"
            class="px-6 py-3 text-sm font-semibold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
            @click="currentPage--"
          >
            Prev
          </button>
          <button
            v-if="!(currentPage * itemsPerPage >= filteredData.length)"
            class=" ml-2 px-6 py-3 text-sm font-semibold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

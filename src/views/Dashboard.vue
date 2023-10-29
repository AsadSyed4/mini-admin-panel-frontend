<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useApi } from '@/composables/useApi'
import { showLoader } from "@/composables/useLoader";
import { error } from "@/composables/useToast";

const api = useApi()
const companyCount = ref<number>(0)
const employeeCount = ref<number>(0)
const companies = ref<Company[]>()
const baseURL = import.meta.env.VITE_API_BASE_URL.replace('api', 'storage');

onBeforeMount(async () => {
  showLoader.value = true
  try {
    let res = await api.get('stats')
    if (res.status === 200) {
      companyCount.value = res.data.data.company_count
      employeeCount.value = res.data.data.employee_count
      companies.value = res.data.data.companies
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
        error.value = 'Something went wrong while loading states.'
      }
    }
  } finally {
    showLoader.value = false
  }
})
</script>

<template>
  <div class="flex justify-between items-center flex-wrap">
    <h3 class="text-3xl font-medium text-gray-700">
      Dashboard
    </h3>
  </div>

  <div class="mt-4">
    <div class="flex flex-wrap -mx-6">
      <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
        <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
          <div class="p-3 bg-pink-600 text-white bg-opacity-75 rounded-full">
            <Icon name="company" />
          </div>

          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">
              {{ companyCount }}
            </h4>
            <div class="text-gray-500">
              Companies
            </div>
          </div>
        </div>
      </div>

      <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
        <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
          <div class="p-3 bg-indigo-600 text-white bg-opacity-75 rounded-full">
            <Icon name="employee"></Icon>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">
              {{ employeeCount }}
            </h4>
            <div class="text-gray-500">
              Employees
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-8" />

  <div class="flex flex-col mt-8">
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Name
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Website
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Employees
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Created At
              </th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <tr v-if="companies" v-for="(company, index) in companies" :key="index">
              <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-10 h-10">
                    <img class="w-10 h-10 rounded-full" :src="`${baseURL}${company.logo}`" alt="">
                  </div>

                  <div class="ml-4">
                    <div class="text-sm font-medium leading-5 text-gray-900">
                      {{ company.name }}
                    </div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ company.email }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ company.website }}
                </div>
              </td>

              <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ company.employees_count }}
                </div>
              </td>

              <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ company.created_at }}
                </div>
              </td>
            </tr>
            <tr v-else>
              <td colspan="4" class="px-6 py-4 border-b border-gray-200">
                No Data found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

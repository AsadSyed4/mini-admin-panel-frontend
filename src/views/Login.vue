<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { useApi } from '@/composables/useApi'
import { useUserSession } from '@/composables/userSession'
import { error } from "@/composables/useToast";
import { showLoader } from "@/composables/useLoader";

const api = useApi()
const userSession = useUserSession()
const router = useRouter();

const schema = yup.object({
  Email: yup.string().required('Email is required').email('Invalid email format'),
  Password: yup.string().required('Password is required'),
})

const {
  errors,
  handleSubmit,
  resetForm: veeResetForm,
} = useForm({
  validationSchema: schema,
})

const { value: email } = useField('Email')
const { value: password } = useField('Password')

const submitForm = handleSubmit(async () => {
  const params = { email: email.value, password: password.value }
  showLoader.value=true;
  try {
    let res = await api.post('login', params)
    if (res.status === 200) {
      userSession.setUser(res.data.data);
      if (window.history.length > 1) {
        router.go(-1);
      } else {
        router.push({ name: 'Dashboard' });
      }

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
        error.value = 'Something went wrong while login.'
      }
    }
  } finally {
    showLoader.value=false;
    veeResetForm()
  }
})
</script>

<template>
  <div class="flex items-center justify-center h-screen px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <span class="text-2xl font-semibold text-gray-700">Mini Admin Panel</span>
      </div>

      <div class="mt-4">
        <label class="block">
          <span class="text-sm text-gray-700">Email</span>
          <input v-model="email" type="email"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" placeholder="example@admin.com">
          <span class="text-red-700">{{ errors.Email }}</span>
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input v-model="password" type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" placeholder="**********">
          <span class="text-red-700">{{ errors.Password }}</span>
        </label>

        <div class="mt-6">
          <button type="submit" @click="submitForm"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500">
            Sign in
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

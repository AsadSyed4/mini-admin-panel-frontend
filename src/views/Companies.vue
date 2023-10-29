<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import PaginatedTable from '@/components/PaginatedTable.vue'
import Modal from '@/components/Modal.vue'
import Tooltip from '@/components/Tooltip.vue'
import { useApi } from '@/composables/useApi'
import { showLoader } from "@/composables/useLoader";
import { error, success } from "@/composables/useToast";
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup'

const baseURL = import.meta.env.VITE_API_BASE_URL.replace('api', 'storage');
const api = useApi()
const data = ref<Company[]>([])

async function fetchCompanies() {
  showLoader.value = true
  try {
    let res = await api.get('companies')
    if (res.status === 200) {
      data.value = res.data.data
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
        error.value = 'Something went wrong while fetching companies.'
      }
    }
  } finally {
    showLoader.value = false
  }
}

onMounted(async () => {
  await fetchCompanies();
})

function searchFilter(records: any, searchTerm: string) {
  const term = searchTerm.toLowerCase()
  return records.filter((d: any) =>
    d.name.toLowerCase().includes(term)
    || d.website.toLowerCase().includes(term)
    || d.email.toLowerCase().includes(term),
  )
}

//Add Company Start
const validatedLogoFormat = ref(true)
const validatedLogoSize = ref(true)
const uploadedFileName = ref('')
const addModal = ref<boolean>(false)
const addSpinner = ref<boolean>(false)

const schema = yup.object({
  Name: yup.string().required('Name is required'),
  Email: yup.string().required('Email is required').email('Invalid email format'),
  Website: yup.string().required('Website is required').url('Invalid URL format'),
  Logo: yup.string().required('Logo is required'),
});

const {
  errors,
  handleSubmit,
  resetForm: veeResetForm,
} = useForm({
  validationSchema: schema,
})

const { value: name } = useField('Name')
const { value: email } = useField('Email')
const { value: website } = useField('Website')
const { value: logo } = useField('Logo')

const submitAddForm = handleSubmit(async () => {
  addSpinner.value = true;
  const formData = new FormData();
  formData.append('name', String(name.value));
  formData.append('email', String(email.value));
  formData.append('website', String(website.value));
  if (logo.value instanceof Blob) {
    formData.append('logo', logo.value);
  }
  try {
    let res = await api.post('companies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (res.status === 201) {
      data.value.unshift({
        ...res.data.data,
        employees_count: 0,
      })
      success.value = 'Company added.'
      addModal.value = false
      veeResetForm()
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
        error.value = 'Something went wrong while adding.'
      }
    }
  } finally {
    addSpinner.value = false
  }
})

function updateFileName(event: any) {
  const file = event.target.files[0];
  if (file) {
    logo.value = file;
    const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg'];
    validatedLogoFormat.value = supportedFormats.includes(file.type)
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const width = image.width;
      const height = image.height;
      URL.revokeObjectURL(image.src);
      validatedLogoSize.value = width >= 100 && height >= 100;
    };
  }
  uploadedFileName.value = file ? file.name : '';
}

//View Company Start
const viewModal = ref<boolean>(false)
const dataForView = ref<Company | null>()

const handleView = (data: Company) => {
  viewModal.value = true
  dataForView.value = data
}

//Edit Company Start
const editModal = ref<boolean>(false)
const editSpinner = ref<boolean>(false)
const dataForEdit = reactive({
  id: 0,
  name: '',
  email: '',
  website: ''
})

const handleEdit = (data: Company) => {
  editModal.value = true
  dataForEdit.id = data.id
  dataForEdit.name = data.name
  dataForEdit.email = data.email
  dataForEdit.website = data.website
}

const editRecord = async () => {
  editSpinner.value = true;
  let params = {
    name: dataForEdit.name,
    email: dataForEdit.email,
    website: dataForEdit.website,
  }
  try {
    let res = await api.put(`companies/${dataForEdit.id}`, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status === 200) {
      const index = data.value.findIndex((c: Company) => c.id === dataForEdit.id);
      if (index !== -1) {
        data.value[index].name = res.data.data.name
        data.value[index].email = res.data.data.email
        data.value[index].website = res.data.data.website
        data.value[index].updated_at = res.data.data.updated_at
      }
      success.value = 'Company Updated.'
      editModal.value = false
      dataForEdit.id = 0
      dataForEdit.name = ''
      dataForEdit.email = ''
      dataForEdit.website = ''
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
        error.value = 'Something went wrong while updating.'
      }
    }
  } finally {
    editSpinner.value = false
  }
}

//Delete Company Start
const deleteModal = ref<boolean>(false)
const deleteSpinner = ref<boolean>(false)
const dataForDelete = ref<Company | null>()

const handleDelete = (data: Company) => {
  deleteModal.value = true
  dataForDelete.value = data
}

const deleteRecord = async () => {
  deleteSpinner.value = true;
  try {
    let res = await api.delete(`companies/${dataForDelete.value?.id}`)
    if (res.status === 200) {
      data.value = data.value.filter((c: Company) => c.id !== dataForDelete.value?.id);
      success.value = 'Company deleted.'
      deleteModal.value = false
      dataForDelete.value = null
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
        error.value = 'Something went wrong while deleting.'
      }
    }
  } finally {
    deleteSpinner.value = false
  }
}

</script>

<template>
  <div class="flex justify-between items-center flex-wrap">
    <h3 class="text-3xl font-medium text-gray-700">
      Companies
    </h3>
    <Tooltip content="Add Company" position="top">
      <button @click="addModal = true"
        class="px-6 py-3 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
        Add Company
      </button>
    </Tooltip>
  </div>

  <Modal v-model:showModal="addModal" title="Add Company">
    <template #content>
      <label class="block">
        <span class="text-sm text-gray-700">Company Name</span>
        <input type="text" v-model="name"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="Google">
        <span class="text-red-700">{{ errors.Name }}</span>
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Email</span>
        <input type="email" v-model="email"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="example@email.com">
        <span class="text-red-700">{{ errors.Email }}</span>
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Website</span>
        <input type="text" v-model="website"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="https://test.com">
        <span class="text-red-700">{{ errors.Website }}</span>
      </label>

      <div class="block mt-5">
        <div class="mt-1 flex items-center">
          <input type="file" id="logo" name="logo" class="hidden" accept="image/jpeg,image/jpg,image/png,image/svg"
            @change="updateFileName">
          <label for="logo"
            class="px-4 py-2 text-white bg-indigo-600 rounded-md cursor-pointer hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none">
            Upload Logo
          </label>
          <span class="ml-1">{{ uploadedFileName }}</span>
        </div>
        <span class="text-red-700">{{ errors.Logo }}</span>
        <span v-if="!validatedLogoFormat" class="text-red-700">Logo should be SVG, PNG, JPG or JPEG</span>
        <span v-if="!validatedLogoSize" class="text-red-700">Logo should be minimum 100x100</span>
      </div>
    </template>
    <template #action>
      <button @click="submitAddForm" :disabled="addSpinner"
        :class="['px-6 py-3 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none', addSpinner ? 'cursor-not-allowed' : '']">
        <Icon v-if="addSpinner" name="spinnerSmall" class="mr-2" />{{ addSpinner ? 'Adding...' : 'Add Company' }}
      </button>
    </template>
  </Modal>

  <Modal v-model:showModal="deleteModal" title="Delete Company">
    <template #content>
      <div class="px-2 text-center">
        <Icon name="elimination" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want
          to delete {{ dataForDelete?.name }} ?</h3>
      </div>
    </template>
    <template #action>
      <button @click="deleteRecord" :disabled="deleteSpinner"
        :class="['px-6 py-3 mt-3 font-medium tracking-wide text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none', deleteSpinner ? 'cursor-not-allowed' : '']">
        <Icon v-if="deleteSpinner" name="spinnerSmall" class="mr-2" />{{ deleteSpinner ? 'Deleting...' : 'Yes, I\'m sure'
        }}
      </button>
    </template>
  </Modal>

  <Modal v-model:showModal="viewModal" :title="dataForView ? dataForView?.name : 'View Company'">
    <template #content>
      <div class="flex justify-around items-center overflow-hidden">
        <img class="w-40 h-50" :src="`${baseURL}${dataForView?.logo}`" alt="Sunset in the mountains">
        <div class="pl-3">
          <div class="mb-2 text-xl font-bold text-gray-900">
            {{ dataForView?.name }}
          </div>
          <div class="text-base text-gray-700">
            <span>Email: {{ dataForView?.email }}</span><br />
            <span>Website: <a :href="dataForView?.website" target="_blank" class="text-indigo-700 underline">{{
              dataForView?.website }}</a></span><br />
            <span>Employees: {{ dataForView?.employees_count }}</span><br />
            <span>Created: {{ dataForView?.created_at }}</span><br />
          </div>
        </div>
      </div>
    </template>

  </Modal>

  <Modal v-model:showModal="editModal" title="Edit Company">
    <template #content>
      <label class="block">
        <span class="text-sm text-gray-700">Company Name</span>
        <input type="text" v-model="dataForEdit.name"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="Google">
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Email</span>
        <input type="email" v-model="dataForEdit.email"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="example@email.com">
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Website</span>
        <input type="text" v-model="dataForEdit.website"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="https://test.com">
      </label>

    </template>
    <template #action>
      <button @click="editRecord" :disabled="editSpinner"
        :class="['px-6 py-3 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none', editSpinner ? 'cursor-not-allowed' : '']">
        <Icon v-if="editSpinner" name="spinnerSmall" class="mr-2" />{{ editSpinner ? 'Updating...' : 'Update Company' }}
      </button>
    </template>
  </Modal>

  <div class="mt-4">
    <PaginatedTable :records="data" :search-filter="searchFilter" :columns="4">
      <template #headings>
        <tr>
          <th
            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
            Company Name
          </th>
          <th
            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
            Website
          </th>
          <th
            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
            Created At
          </th>
          <th
            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
            Action
          </th>
        </tr>
      </template>
      <template #row="{ record }">
        <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 w-10 h-10">
              <img class="w-10 h-10 rounded-full" :src="`${baseURL}${record.logo}`" alt="">
            </div>

            <div class="ml-4">
              <div class="text-sm font-medium leading-5 text-gray-900">
                {{ record.name }}
              </div>
              <div class="text-sm leading-5 text-gray-500">
                {{ record.email }}
              </div>
            </div>
          </div>
        </td>

        <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          <div class="text-sm leading-5 text-gray-900">
            {{ record.website }}
          </div>
        </td>

        <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          <div class="text-sm leading-5 text-gray-900">
            {{ record.created_at }}
          </div>
        </td>

        <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
          <div class="flex justify-between items-center  flex-wrap">
            <Tooltip content="View Company" position="top">
              <Icon @click="handleView(record)" name="eye" />
            </Tooltip>
            <Tooltip content="Edit Company" position="top">
              <Icon @click="handleEdit(record)" name="edit" />
            </Tooltip>
            <Tooltip content="Delete Company" position="top">
              <Icon @click="handleDelete(record)" name="trash" />
            </Tooltip>
          </div>
        </td>
      </template>
    </PaginatedTable>
  </div>
</template>

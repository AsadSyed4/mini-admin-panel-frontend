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


const api = useApi()
const data = ref<Employee[]>([])
const companies = ref<Company[]>([])

function searchFilter(data: any, searchTerm: string) {
  const term = searchTerm.toLowerCase()
  return data.filter((d: any) =>
    d.first_name.toLowerCase().includes(term)
    || d.last_name.toLowerCase().includes(term)
    || d.email.toLowerCase().includes(term)
    || d.phone.toLowerCase().includes(term)
    || d.company.name.toLowerCase().includes(term),
  )
}

async function fetchEmployees() {
  showLoader.value = true
  try {
    let res = await api.get('employees')
    if (res.status === 200) {
      data.value = res.data.data.employees
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
        error.value = 'Something went wrong while fetching.'
      }
    }
  } finally {
    showLoader.value = false
  }
}

onMounted(async () => {
  await fetchEmployees();
  company_id.value = companies.value[0].id
})

//Add Company Start
const addModal = ref<boolean>(false)
const addSpinner = ref<boolean>(false)

const schema = yup.object({
  FirstName: yup.string().required('First Name is required'),
  LastName: yup.string().required('Last Name is required'),
  Email: yup.string().required('Email is required').email('Invalid email format'),
  Phone: yup.string().required('Phone is required').test('phone', 'Invalid phone number format', (value: any) => {
    if (!value) return true;
    const phoneRegex = /^\+?\d{10}$/;
    return phoneRegex.test(value);
  }),
  Company: yup.string().required('Company is required'),
});

const {
  errors,
  handleSubmit,
  resetForm: veeResetForm,
} = useForm({
  validationSchema: schema,
})

const { value: first_name } = useField('FirstName')
const { value: last_name } = useField('LastName')
const { value: email } = useField('Email')
const { value: phone } = useField('Phone')
const { value: company_id } = useField('Company')

const submitAddForm = handleSubmit(async () => {
  addSpinner.value = true;
  let params = {
    first_name: first_name.value,
    last_name: last_name.value,
    email: email.value,
    phone: phone.value,
    company_id: company_id.value,
  }
  try {
    let res = await api.post('employees', params)
    if (res.status === 201) {
      const index = companies.value.findIndex((e: Company) => e.id === company_id.value);
      if (index !== -1) {
        data.value.unshift({
          ...res.data.data,
          company: {
            id: companies.value[index].id,
            name: companies.value[index].name
          },
        })
      }

      success.value = 'Employee added.'
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
        error.value = 'Something went wrong adding.'
      }
    }
  } finally {
    addSpinner.value = false
  }
})

//View Employee Start
const viewModal = ref<boolean>(false)
const dataForView = ref<Employee | null>()

const handleView = (data: Employee) => {
  viewModal.value = true
  dataForView.value = data
}

//Edit Company Start
const editModal = ref<boolean>(false)
const editSpinner = ref<boolean>(false)
const dataForEdit = reactive({
  id: 0,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  company_id: 0
})

const handleEdit = (data: Employee) => {
  editModal.value = true
  dataForEdit.id = data.id
  dataForEdit.first_name = data.first_name
  dataForEdit.last_name = data.last_name
  dataForEdit.email = data.email
  dataForEdit.phone = data.phone
  dataForEdit.company_id = data.company_id
}

const editRecord = async () => {
  editSpinner.value = true;
  let params = {
    first_name: dataForEdit.first_name,
    last_name: dataForEdit.last_name,
    email: dataForEdit.email,
    phone: dataForEdit.phone,
    company_id: dataForEdit.company_id,
  }
  try {
    let res = await api.put(`employees/${dataForEdit.id}`, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status === 200) {
      const index = data.value.findIndex((e: Employee) => e.id === dataForEdit.id);
      if (index !== -1) {
        data.value[index].first_name = res.data.data.first_name
        data.value[index].last_name = res.data.data.last_name
        data.value[index].email = res.data.data.email
        data.value[index].email = res.data.data.email
        data.value[index].phone = res.data.data.phone
        data.value[index].company_id = res.data.data.company_id
        data.value[index].company.id = res.data.data.company_id
        data.value[index].updated_at = res.data.data.updated_at
        const companyIndex = companies.value.findIndex((c: Company) => c.id === res.data.data.company_id);
        if (companyIndex !== -1) {
          data.value[index].company.name = companies.value[companyIndex].name
        }
      }
      success.value = 'Employee Updated.'
      editModal.value = false
      dataForEdit.id = 0
      dataForEdit.first_name = ''
      dataForEdit.last_name = ''
      dataForEdit.email = ''
      dataForEdit.phone = ''
      dataForEdit.company_id = 0
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

//Delete Employee Start
const deleteModal = ref<boolean>(false)
const deleteSpinner = ref<boolean>(false)
const dataForDelete = ref<Employee | null>()

const handleDelete = (data: Employee) => {
  deleteModal.value = true
  dataForDelete.value = data
}

const deleteRecord = async () => {
  deleteSpinner.value = true;
  try {
    let res = await api.delete(`employees/${dataForDelete.value?.id}`)
    if (res.status === 200) {
      data.value = data.value.filter((e: Employee) => e.id !== dataForDelete.value?.id);
      success.value = 'Employee deleted.'
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
      Employees
    </h3>
    <button @click="addModal = true"
      class="px-6 py-3 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
      Add Employee
    </button>
  </div>

  <Modal v-model:showModal="addModal" title="Add Employee">
    <template #content>
      <label class="block">
        <span class="text-sm text-gray-700">First Name</span>
        <input type="text" v-model="first_name"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="John">
        <span class="text-red-700">{{ errors.FirstName }}</span>
      </label>

      <label class="block">
        <span class="text-sm text-gray-700">Last Name</span>
        <input type="text" v-model="last_name"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="Due">
        <span class="text-red-700">{{ errors.LastName }}</span>
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Email</span>
        <input type="email" v-model="email"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="example@email.com">
        <span class="text-red-700">{{ errors.Email }}</span>
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Phone</span>
        <input type="text" v-model="phone"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="e.g. +1234567890 or 1234567890">
        <span class="text-red-700">{{ errors.Phone }}</span>
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Company</span>
        <select type="text" v-model="company_id"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
          <option v-for="(company, index) in companies" :index="index" :value="company.id">{{ company.name }}</option>
        </select>
        <span class="text-red-700">{{ errors.Company }}</span>
      </label>
    </template>
    <template #action>
      <button @click="submitAddForm" :disabled="addSpinner"
        :class="['px-6 py-3 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none', addSpinner ? 'cursor-not-allowed' : '']">
        <Icon v-if="addSpinner" name="spinnerSmall" class="mr-2" />{{ addSpinner ? 'Adding...' : 'Add Employee' }}
      </button>
    </template>
  </Modal>

  <Modal v-model:showModal="viewModal"
    :title="dataForView ? dataForView?.first_name + ' ' + dataForView?.last_name : 'View Employee'">
    <template #content>
      <div class="text-center">
        <div class="mb-2 text-xl font-bold text-gray-900">
          {{ dataForView?.first_name }} {{ dataForView?.last_name }}
        </div>
        <div class="text-base text-gray-700">
          <span>Email: {{ dataForView?.email }}</span><br />
          <span>Phone: {{ dataForView?.phone }}</span><br />
          <span>Company: {{ dataForView?.company.name }}</span><br />
          <span>Created: {{ dataForView?.created_at }}</span><br />
        </div>
      </div>
    </template>

  </Modal>

  <Modal v-model:showModal="deleteModal" title="Delete Employee">
    <template #content>
      <div class="px-2 text-center">
        <Icon name="elimination" />
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want
          to delete {{ dataForDelete?.first_name }} {{ dataForDelete?.last_name }} ?</h3>
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

  <Modal v-model:showModal="editModal" title="Edit Employee">
    <template #content>
      <label class="block">
        <span class="text-sm text-gray-700">First Name</span>
        <input type="text" v-model="dataForEdit.first_name"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="John">
      </label>

      <label class="block">
        <span class="text-sm text-gray-700">Last Name</span>
        <input type="text" v-model="dataForEdit.last_name"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="Due">
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Email</span>
        <input type="email" v-model="dataForEdit.email"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="example@email.com">
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Phone</span>
        <input type="text" v-model="dataForEdit.phone"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
          placeholder="e.g. +1234567890 or 1234567890">
      </label>

      <label class="block mt-3">
        <span class="text-sm text-gray-700">Company</span>
        <select type="text" v-model="dataForEdit.company_id"
          class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
          <option v-for="(company, index) in companies" :index="index" :value="company.id">{{ company.name }}</option>
        </select>
      </label>
    </template>
    <template #action>
      <button @click="editRecord" :disabled="editSpinner"
        :class="['px-6 py-3 mt-3 font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none', editSpinner ? 'cursor-not-allowed' : '']">
        <Icon v-if="editSpinner" name="spinnerSmall" class="mr-2" />{{ editSpinner ? 'Updating...' : 'Update Employee' }}
      </button>
    </template>
  </Modal>

  <div class="mt-4">
    <PaginatedTable :records="data" :search-filter="searchFilter" :columns="5">
      <template #headings>
        <tr>
          <th
            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
            Name
          </th>
          <th
            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
            Phone
          </th>
          <th
            class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
            Company
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
          <div class="text-sm font-medium leading-5 text-gray-900">
            {{ record.first_name }} {{ record.last_name }}
          </div>
          <div class="text-sm leading-5 text-gray-500">
            {{ record.email }}
          </div>
        </td>

        <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          <div class="text-sm leading-5 text-gray-900">
            {{ record.phone }}
          </div>
        </td>

        <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          <div class="text-sm leading-5 text-gray-900">
            {{ record.company.name }}
          </div>
        </td>

        <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
          <div class="text-sm leading-5 text-gray-900">
            {{ record.created_at }}
          </div>
        </td>

        <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
          <div class="flex justify-between items-center  flex-wrap">
            <Tooltip content="View Employee" position="top">
              <Icon @click="handleView(record)" name="eye" />
            </Tooltip>
            <Tooltip content="Edit Employee" position="top">
              <Icon @click="handleEdit(record)" name="edit" />
            </Tooltip>
            <Tooltip content="Delete Employee" position="top">
              <Icon @click="handleDelete(record)" name="trash" />
            </Tooltip>
          </div>
        </td>
      </template>
    </PaginatedTable>
  </div>
</template>

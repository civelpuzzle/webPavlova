<script setup>
import { ref, reactive } from 'vue'
import AdminAuth from '../components/admin/AdminAuth.vue'
import AdminDashboard from '../components/admin/AdminDashboard.vue'
import Toast from '../components/admin/Toast.vue'
import '../assets/admin.css'

const token = ref(localStorage.getItem('adminToken') || '')
const adminName = ref(localStorage.getItem('adminName') || '')
const toast = reactive({ visible: false, message: '', type: 'success' })

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.visible = true
  setTimeout(() => { toast.visible = false }, 3000)
}

const handleLogin = (data) => {
  token.value = data.token
  adminName.value = data.adminName
  localStorage.setItem('adminToken', data.token)
  localStorage.setItem('adminName', data.adminName)
  showToast('Вход выполнен успешно')
}

const handleLogout = () => {
  token.value = ''
  adminName.value = ''
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminName')
  showToast('Вы вышли из панели')
}
</script>

<template>
  <div class="admin-page">
    <AdminAuth v-if="!token" @login="handleLogin" @show-toast="showToast" />
    <AdminDashboard
      v-else
      :token="token"
      :admin-name="adminName"
      @logout="handleLogout"
      @show-toast="showToast"
    />
    <Toast :visible="toast.visible" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login', 'showToast'])
const isLogin = ref(true)
const loginForm = ref({ name: '', password: '' })
const regForm = ref({ name: '', password: '', email: '', description: '' })
const authError = ref('')

const submitLogin = async () => {
  authError.value = ''
  try {
    const res = await fetch('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm.value)
    })
    const data = await res.json()
    if (!res.ok) { authError.value = data.message || 'Ошибка входа'; return }
    emit('login', data)
  } catch { authError.value = 'Ошибка сети. Проверьте сервер.' }
}

const submitRegister = async () => {
  authError.value = ''
  try {
    const res = await fetch('/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm.value)
    })
    const data = await res.json()
    if (!res.ok) { authError.value = data.message || 'Ошибка регистрации'; return }
    emit('showToast', 'Администратор зарегистрирован. Теперь войдите.')
    isLogin.value = true
    regForm.value = { name: '', password: '', email: '', description: '' }
  } catch { authError.value = 'Ошибка сети. Проверьте сервер.' }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-logo">🔐 <span>VapeZone</span> Admin</div>
      <div class="auth-subtitle">Панель управления каталогом</div>

      <form v-if="isLogin" class="auth-form" @submit.prevent="submitLogin">
        <div class="form-group">
          <label>Имя администратора</label>
          <input type="text" v-model="loginForm.name" required>
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input type="password" v-model="loginForm.password" required>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Войти</button>
        <button type="button" class="btn-link" @click="isLogin = false; authError = ''">
          Создать нового администратора
        </button>
      </form>

      <form v-else class="auth-form" @submit.prevent="submitRegister">
        <div class="form-group">
          <label>Имя администратора *</label>
          <input type="text" v-model="regForm.name" required>
        </div>
        <div class="form-group">
          <label>Пароль *</label>
          <input type="password" v-model="regForm.password" required>
        </div>
        <div class="form-group">
          <label>E-mail</label>
          <input type="email" v-model="regForm.email">
        </div>
        <div class="form-group">
          <label>Описание</label>
          <input type="text" v-model="regForm.description">
        </div>
        <button type="submit" class="btn btn-primary btn-full">Зарегистрировать</button>
        <button type="button" class="btn-link" @click="isLogin = true; authError = ''">
          ← Вернуться ко входу
        </button>
      </form>

      <div class="error-msg">{{ authError }}</div>
    </div>
  </div>
</template>

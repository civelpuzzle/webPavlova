<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'

const emit = defineEmits(['open-modal'])
const router = useRouter()
const route = useRoute()

const isNavOpen = ref(false)
const isDarkTheme = ref(false)

const toggleNav = () => { isNavOpen.value = !isNavOpen.value }
const closeNav = () => { isNavOpen.value = false }

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.body.classList.toggle('theme-dark', isDarkTheme.value)
}

const navigateToSection = (sectionId) => {
  closeNav()
  if (route.path !== '/') {
    router.push({ path: '/', hash: `#${sectionId}` })
  } else {
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleResize = () => { if (window.innerWidth > 768) isNavOpen.value = false }
onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="header__logo">VapeZone</RouterLink>

      <nav class="nav" :class="{ 'nav--open': isNavOpen }">
        <ul class="nav__list">
          <li><RouterLink to="/" class="nav__link" @click="closeNav">Главная</RouterLink></li>
          <li><a href="#" class="nav__link" @click.prevent="navigateToSection('advantages')">Почему мы</a></li>
          <li><RouterLink to="/catalog" class="nav__link" @click="closeNav">Каталог</RouterLink></li>
          <li><a href="#" class="nav__link" @click.prevent="navigateToSection('steps')">Как заказать</a></li>
          <li><a href="#" class="nav__link" @click.prevent="navigateToSection('reviews')">Отзывы</a></li>
          <li><a href="#" class="nav__link" @click.prevent="navigateToSection('order')">Контакты</a></li>
          <li class="nav__login-item">
            <a href="#" class="button button--primary button--small nav__login-button"
               @click.prevent="emit('open-modal'); closeNav()">Войти</a>
          </li>
        </ul>
      </nav>

      <div class="header__actions">
        <button class="theme-toggle" @click="toggleTheme">{{ isDarkTheme ? '☀️' : '🌙' }}</button>
        <a href="#" class="button button--primary button--small header__login"
           @click.prevent="emit('open-modal')">Войти</a>
        <button class="burger" :class="{ 'burger--active': isNavOpen }" @click="toggleNav">
          <span class="burger__line"></span>
          <span class="burger__line"></span>
          <span class="burger__line"></span>
        </button>
      </div>
    </div>
  </header>
</template>

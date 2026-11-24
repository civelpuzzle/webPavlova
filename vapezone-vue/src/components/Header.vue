<!-- src/components/Header.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const emit = defineEmits(['open-modal'])

const isNavOpen = ref(false)
const isDarkTheme = ref(false)

const toggleNav = () => isNavOpen.value = !isNavOpen.value
const closeNav = () => isNavOpen.value = false

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.body.classList.toggle('theme-dark', isDarkTheme.value)
}

const handleResize = () => { if (window.innerWidth > 768) isNavOpen.value = false }
onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <a href="#" class="header__logo">VapeZone</a>
      <nav class="nav" :class="{ 'nav--open': isNavOpen }">
        <ul class="nav__list">
          <li><a href="#" class="nav__link nav__link--active" @click="closeNav">Главная</a></li>
          <li><a href="#advantages" class="nav__link" @click="closeNav">Почему мы</a></li>
          <li><a href="catalog.html" class="nav__link" @click="closeNav">Каталог</a></li>
          <li><a href="#steps" class="nav__link" @click="closeNav">Как заказать</a></li>
          <li><a href="#reviews" class="nav__link" @click="closeNav">Отзывы</a></li>
          <li><a href="#order" class="nav__link" @click="closeNav">Контакты</a></li>
          <li class="nav__login-item">
            <a href="#" class="button button--primary button--small nav__login-button" @click.prevent="emit('open-modal'); closeNav()">Войти</a>
          </li>
        </ul>
      </nav>
      <div class="header__actions">
        <button class="theme-toggle" @click="toggleTheme">{{ isDarkTheme ? '☀️' : '🌙' }}</button>
        <a href="#" class="button button--primary button--small header__login" @click.prevent="emit('open-modal')">Войти</a>
        <button class="burger" :class="{ 'burger--active': isNavOpen }" @click="toggleNav">
          <span class="burger__line"></span><span class="burger__line"></span><span class="burger__line"></span>
        </button>
      </div>
    </div>
  </header>
</template>

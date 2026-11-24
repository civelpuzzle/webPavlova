    <!-- src/components/Hero.vue -->
<script setup>
const emit = defineEmits(['open-modal'])
</script>
<template>
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__content">
        <h1 class="hero__title">Культура пара, которой доверяют</h1>
        <p class="hero__text">Устройства, жидкости и аксессуары от проверенных брендов. Поможем подобрать то, что подходит именно вам, и доставим по городу за 24 часа. Мы за ЗОЖ!</p>
        <div class="hero__buttons">
          <a href="#catalog" class="button button--light">Ассортимент</a>
          <button class="button button--outline" style="border-color: #fff; color: #fff;" @click="emit('open-modal')">Оставить заявку</button>
        </div>
      </div>
      <img src="/logo.jpg" alt="VapeZone" class="hero__image">
    </div>
  </section>
</template>

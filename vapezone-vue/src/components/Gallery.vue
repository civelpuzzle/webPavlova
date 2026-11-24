<!-- src/components/Gallery.vue -->
<script setup>
import { ref } from 'vue'
const images = ['/hqd.png', '/podSystem.png', '/soll.png', '/zames.png']
const activeImage = ref(images[0])
</script>
<template>
  <section class="gallery" id="gallery">
    <div class="container">
      <h2>Галерея</h2>
      <div class="gallery__layout">
        <div class="gallery__main"><img :src="activeImage" alt="Галерея товаров"></div>
        <div class="gallery__thumbs">
          <img v-for="(img, index) in images" :key="index" :src="img" :alt="'Фото ' + (index + 1)" :class="{ active: activeImage === img }" @click="activeImage = img">
        </div>
      </div>
    </div>
  </section>
</template>

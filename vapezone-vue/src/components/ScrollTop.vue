<!-- src/components/ScrollTop.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const isVisible = ref(false)
const handleScroll = () => isVisible.value = window.scrollY > 400
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>
<template>
  <button class="scroll-top" :class="{ 'scroll-top--visible': isVisible }" @click="window.scrollTo({ top: 0, behavior: 'smooth' })">↑</button>
</template>

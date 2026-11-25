<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  image: String,
  title: String,
  description: String,
  link: { type: String, default: '/catalog' }
})
</script>

<template>
  <article class="product-card">
    <img :src="image" :alt="title" class="product-card__image">
    <h3 class="product-card__title">{{ title }}</h3>
    <p class="product-card__description">{{ description }}</p>
    <RouterLink :to="link" class="button button--outline button--small">Подробнее</RouterLink>
  </article>
</template>

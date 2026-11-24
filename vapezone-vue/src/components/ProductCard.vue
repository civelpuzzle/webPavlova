<!-- src/components/ProductCard.vue -->
<script setup>
defineProps({ image: String, title: String, description: String, link: { type: String, default: 'catalog.html' } })
</script>
<template>
  <article class="product-card">
    <img :src="image" :alt="title" class="product-card__image">
    <h3 class="product-card__title">{{ title }}</h3>
    <p class="product-card__description">{{ description }}</p>
    <a :href="link" class="button button--outline button--small">Подробнее</a>
  </article>
</template>

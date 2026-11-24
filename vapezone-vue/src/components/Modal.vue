<!-- src/components/Modal.vue -->
<script setup>
import { ref } from 'vue'
const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])
const form = ref({ name: '', phone: '' })
const isSubmitted = ref(false)
const submitForm = () => {
  isSubmitted.value = true
  setTimeout(() => { emit('close'); isSubmitted.value = false; form.value = { name: '', phone: '' } }, 2500)
}
</script>
<template>
  <div class="modal" :class="{ 'modal--open': isOpen }" @click.self="emit('close')">
    <div class="modal__overlay"></div>
    <div class="modal__window">
      <button class="modal__close" @click="emit('close')">✕</button>
      <template v-if="!isSubmitted">
        <h3 class="modal__title">Оставить заявку</h3>
        <p class="modal__text">Оставьте контакты — мы перезвоним и ответим на все вопросы.</p>
        <form class="modal__form" @submit.prevent="submitForm">
          <label class="modal__label">Имя *<input type="text" class="modal__input" v-model="form.name" required></label>
          <label class="modal__label">Телефон *<input type="tel" class="modal__input" v-model="form.phone" required></label>
          <button type="submit" class="button button--primary">Отправить</button>
        </form>
      </template>
      <div v-else class="modal__success">Спасибо! Заявка отправлена.<br>Мы свяжемся с вами в ближайшее время.</div>
    </div>
  </div>
</template>

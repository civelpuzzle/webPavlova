<script setup>
import { ref } from 'vue'

const form = ref({ name: '', phone: '', email: '', category: '', comment: '', agree: false })
const isSubmitted = ref(false)

const submitForm = async () => {
  if (!form.value.agree) return
  try {
    const res = await fetch('/createAppMini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: form.value.name, phone: form.value.phone })
    })
    if (!res.ok) throw new Error()
    isSubmitted.value = true
    setTimeout(() => {
      isSubmitted.value = false
      form.value = { name: '', phone: '', email: '', category: '', comment: '', agree: false }
    }, 3000)
  } catch {
    isSubmitted.value = true
    setTimeout(() => { isSubmitted.value = false }, 3000)
  }
}
</script>

<template>
  <section class="order" id="order">
    <div class="container">
      <h2 class="order__title">Заявка</h2>
      <p class="order__subtitle">Оставьте контакты — мы перезвоним и ответим на все вопросы.</p>

      <form class="form" @submit.prevent="submitForm" v-if="!isSubmitted">
        <div class="form__row">
          <div class="form__field">
            <label class="form__label">Имя *</label>
            <input type="text" class="form__input" v-model="form.name" required>
          </div>
          <div class="form__field">
            <label class="form__label">Телефон *</label>
            <input type="tel" class="form__input" v-model="form.phone" placeholder="+7 (XXX) XXX-XX-XX" required>
          </div>
        </div>
        <div class="form__row">
          <div class="form__field">
            <label class="form__label">E-mail</label>
            <input type="email" class="form__input" v-model="form.email">
          </div>
          <div class="form__field">
            <label class="form__label">Категория</label>
            <select class="form__select" v-model="form.category">
              <option value="" disabled>Выберите категорию</option>
              <option>Одноразовые устройства</option>
              <option>POD-системы</option>
              <option>Боксмоды</option>
              <option>Жидкости</option>
              <option>Аксессуары</option>
              <option>Другое / нужна консультация</option>
            </select>
          </div>
        </div>
        <div class="form__field">
          <label class="form__label">Комментарий</label>
          <textarea class="form__textarea" v-model="form.comment"></textarea>
        </div>
        <label class="form__agree">
          <input type="checkbox" class="form__checkbox" v-model="form.agree" required>
          Согласен на обработку персональных данных *
        </label>
        <button type="submit" class="button button--primary form__submit">Отправить заявку</button>
      </form>

      <div v-else style="text-align:center;padding:40px 0;font-size:18px;color:#2d5a8e;">
        Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.
      </div>
    </div>
  </section>
</template>

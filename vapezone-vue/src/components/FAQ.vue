<!-- src/components/FAQ.vue -->
<script setup>
import { ref } from 'vue'
const faqs = [
  { q: 'С какого возраста можно покупать товары в магазине?', a: 'Все товары продаются только совершеннолетним. При получении заказа потребуется документ, подтверждающий возраст 18+.' },
  { q: 'Как быстро осуществляется доставка?', a: 'По городу курьер привезёт заказ в течение 24 часов. Доставка по стране занимает от 2 до 4 дней.' },
  { q: 'Можно ли оплатить заказ при получении?', a: 'Да, вы можете оплатить заказ наличными или картой курьеру при получении.' },
  { q: 'Как накопить бонусы по программе лояльности?', a: 'С каждой покупки начисляются бонусы, а для постоянных клиентов действуют дополнительные скидки.' },
  { q: 'Что делать, если испаритель быстро вышел из строя?', a: 'Обратитесь к нам — мы проверим партию, поможем подобрать замену и подскажем по обслуживанию.' }
]
const openIndex = ref(null)
</script>
<template>
  <section class="faq" id="faq">
    <div class="container">
      <h2>Часто задаваемые вопросы</h2>
      <div class="faq__list">
        <div v-for="(faq, index) in faqs" :key="index" class="faq__item" :class="{ 'faq__item--open': openIndex === index }">
          <button class="faq__question" @click="openIndex = openIndex === index ? null : index">
            {{ faq.q }} <span class="faq__arrow">▾</span>
          </button>
          <div class="faq__answer" :style="{ maxHeight: openIndex === index ? '500px' : '0' }"><p>{{ faq.a }}</p></div>
        </div>
      </div>
    </div>
  </section>
</template>

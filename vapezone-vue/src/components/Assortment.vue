<script setup>
import ProductCard from './ProductCard.vue'

const categories = [
  { id: 1, image: '/hqd.png', title: 'Одноразовые устройства', description: 'Готовые к использованию устройства «из коробки». До 6000 затяжек.' },
  { id: 2, image: '/podSystem.png', title: 'POD-системы', description: 'Компактные устройства на каждый день. Простое обслуживание и заправка.' },
  { id: 3, image: '/bocsMod.png', title: 'Боксмоды', description: 'Мощные устройства для густого пара и гибкой настройки.' },
  { id: 4, image: '/ziza.png', title: 'Классические жидкости', description: 'Проверенные вкусы, никотин 0–12 мг. Флаконы 60–120 мл.' },
  { id: 5, image: '/soll.png', title: 'Солевые жидкости', description: 'Мягкая затяжка и яркий вкус. Идеальны для POD-систем.' },
  { id: 6, image: '/ispar.png', title: 'Картриджи и испарители', description: 'Оригинальные расходники для всех популярных POD-систем.' },
  { id: 7, image: '/aksesuarEpt.png', title: 'Аксессуары', description: 'Зарядные устройства, чехлы, дрип-типы и средства для ухода.' },
  { id: 8, image: '/zames.png', title: 'Компоненты для самозамеса', description: 'Базы, глицерин и ароматизаторы для собственных жидкостей.' }
]
</script>

<template>
  <section class="catalog" id="catalog">
    <div class="container">
      <h2>Ассортимент</h2>
      <div class="catalog__grid">
        <ProductCard
          v-for="item in categories"
          :key="item.id"
          :image="item.image"
          :title="item.title"
          :description="item.description"
          link="/catalog"
        />
      </div>
    </div>
  </section>
</template>

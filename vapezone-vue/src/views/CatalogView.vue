<script setup>
import { ref, onMounted } from 'vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const items = ref([])
const categories = ref(['Все'])
const activeCategory = ref('Все')
const isLoading = ref(true)
const errorMsg = ref('')

const filteredItems = () => {
  return activeCategory.value === 'Все'
    ? items.value
    : items.value.filter(i => i.category_name === activeCategory.value)
}

const loadItems = async () => {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const res = await fetch('/items')
    if (!res.ok) throw new Error('Ошибка сети')
    const data = await res.json()
    items.value = data || []
    const unique = [...new Set(data.map(i => i.category_name))]
    categories.value = ['Все', ...unique]
  } catch {
    errorMsg.value = 'Не удалось загрузить товары. Проверьте, запущен ли сервер.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadItems)
</script>

<template>
  <div>
    <Header />
    <main>
      <section class="catalog">
        <div class="container">
          <h2>Каталог товаров</h2>

          <div v-if="isLoading" style="text-align:center;padding:40px;color:#5a6480;">Загрузка товаров...</div>
          <div v-else-if="errorMsg" style="text-align:center;padding:40px;color:#d94848;">{{ errorMsg }}</div>

          <template v-else>
            <div class="category-filters" v-if="categories.length > 1">
              <button
                v-for="cat in categories"
                :key="cat"
                class="button button--outline category-btn"
                :class="{ 'active-category': activeCategory === cat }"
                @click="activeCategory = cat"
              >{{ cat }}</button>
            </div>

            <div v-if="filteredItems().length === 0" style="text-align:center;padding:40px;color:#5a6480;">
              В этой категории пока нет товаров.
            </div>

            <div v-else class="catalog__grid">
              <article v-for="item in filteredItems()" :key="item.id_item" class="product-card">
                <div class="catalog-img-wrapper">
                  <img :src="item.photo || '/logo.jpg'" :alt="item.name" class="catalog-img"
                       @error="(e) => e.target.src = '/logo.jpg'">
                </div>
                <h3 class="product-card__title">{{ item.name }}</h3>
                <p class="product-card__description">
                  <strong>Цена:</strong> {{ Number(item.price).toFixed(2) }} ₽<br>
                  <strong>Категория:</strong> {{ item.category_name }}
                </p>
              </article>
            </div>
          </template>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

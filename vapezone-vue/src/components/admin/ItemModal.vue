<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'add' },
  item: Object,
  categories: Array,
  suppliers: Array
})
const emit = defineEmits(['close', 'save'])

const form = ref({
  name: props.item?.name || '',
  price: props.item?.price ?? '',
  stock_balance: props.item?.stock_balance ?? '',
  id_category: props.item?.id_category || '',
  id_supplier: props.item?.id_supplier || '',
  photo: props.item?.photo || ''
})

const title = computed(() => props.mode === 'edit' ? 'Редактировать товар' : 'Добавить товар')

const submit = () => {
  emit('save', {
    name: form.value.name.trim(),
    price: parseFloat(form.value.price),
    stock_balance: parseInt(form.value.stock_balance, 10),
    id_category: parseInt(form.value.id_category, 10),
    id_supplier: parseInt(form.value.id_supplier, 10),
    photo: form.value.photo.trim() || null
  })
}
</script>

<template>
  <div class="admin-modal" @click.self="emit('close')">
    <div class="admin-modal__overlay"></div>
    <div class="admin-modal__window">
      <button class="admin-modal__close" @click="emit('close')">✕</button>
      <h3>{{ title }}</h3>
      <form class="admin-modal-form" @submit.prevent="submit">
        <div class="form-group">
          <label>Название *</label>
          <input type="text" v-model="form.name" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Цена (₽) *</label>
            <input type="number" step="0.01" v-model="form.price" required>
          </div>
          <div class="form-group">
            <label>Остаток (шт.) *</label>
            <input type="number" v-model="form.stock_balance" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Категория *</label>
            <select v-model="form.id_category" required>
              <option value="" disabled>Выберите категорию</option>
              <option v-for="c in categories" :key="c.id_category" :value="c.id_category">{{ c.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Поставщик *</label>
            <select v-model="form.id_supplier" required>
              <option value="" disabled>Выберите поставщика</option>
              <option v-for="s in suppliers" :key="s.id_supplier" :value="s.id_supplier">{{ s.name }}</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Путь к фото</label>
          <input type="text" v-model="form.photo" placeholder="/items/photo.jpg">
        </div>
        <div class="admin-modal-actions">
          <button type="submit" class="btn btn-primary">Сохранить</button>
          <button type="button" class="btn btn-outline" @click="emit('close')">Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

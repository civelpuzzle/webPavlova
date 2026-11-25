<script setup>
import { ref, onMounted } from 'vue'
import ItemModal from './ItemModal.vue'

const props = defineProps({ token: String, adminName: String })
const emit = defineEmits(['logout', 'showToast'])

const items = ref([])
const categories = ref([])
const suppliers = ref([])
const isLoading = ref(true)
const loadError = ref('')
const isModalOpen = ref(false)
const modalMode = ref('add')
const editingItem = ref(null)

const fetchWithAuth = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${props.token}`,
      ...(options.headers || {})
    }
  })
  if (res.status === 401) {
    emit('logout')
    throw new Error('Unauthorized')
  }
  return res
}

const loadAll = async () => {
  try {
    const [catRes, supRes] = await Promise.all([
      fetchWithAuth('/admin/categories'),
      fetchWithAuth('/admin/suppliers')
    ])
    categories.value = await catRes.json()
    suppliers.value = await supRes.json()
    await loadItems()
  } catch (e) {
    if (e.message !== 'Unauthorized') {
      emit('showToast', 'Ошибка загрузки данных', 'error')
    }
  }
}

const loadItems = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    const res = await fetchWithAuth('/admin/items')
    if (!res.ok) { loadError.value = 'Ошибка загрузки'; return }
    items.value = await res.json()
  } catch (e) {
    if (e.message !== 'Unauthorized') loadError.value = 'Ошибка сети'
  } finally {
    isLoading.value = false
  }
}

const openAdd = () => {
  modalMode.value = 'add'
  editingItem.value = null
  isModalOpen.value = true
}

const openEdit = (item) => {
  modalMode.value = 'edit'
  editingItem.value = { ...item }
  isModalOpen.value = true
}

const deleteItem = async (item) => {
  if (!confirm(`Удалить товар «${item.name}»?`)) return
  try {
    const res = await fetchWithAuth(`/admin/items/${item.id_item}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { emit('showToast', data.message || 'Ошибка удаления', 'error'); return }
    emit('showToast', 'Товар удалён')
    await loadItems()
  } catch (e) {
    if (e.message !== 'Unauthorized') emit('showToast', 'Ошибка сети', 'error')
  }
}

const handleSave = async (payload) => {
  try {
    let res
    if (modalMode.value === 'edit' && editingItem.value) {
      res = await fetchWithAuth(`/admin/items/${editingItem.value.id_item}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
    } else {
      res = await fetchWithAuth('/admin/items', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    }
    const data = await res.json()
    if (!res.ok) { emit('showToast', data.message || 'Ошибка сохранения', 'error'); return }
    emit('showToast', data.message || 'Сохранено')
    isModalOpen.value = false
    await loadItems()
  } catch (e) {
    if (e.message !== 'Unauthorized') emit('showToast', 'Ошибка сети', 'error')
  }
}

onMounted(loadAll)
</script>

<template>
  <div>
    <header class="dash-header">
      <div class="dash-logo">🔐 <span>VapeZone</span> Admin</div>
      <div class="dash-header__right">
        <span class="admin-name">👤 {{ adminName }}</span>
        <button class="btn btn-outline btn-small" @click="emit('logout')">Выйти</button>
      </div>
    </header>

    <div class="dash-content">
      <div class="dash-toolbar">
        <h2>Каталог товаров</h2>
        <button class="btn btn-primary" @click="openAdd">+ Добавить товар</button>
      </div>

      <div class="table-wrapper">
        <table class="items-table">
          <thead>
            <tr>
              <th>ID</th><th>Фото</th><th>Название</th><th>Цена</th>
              <th>Остаток</th><th>Категория</th><th>Поставщик</th><th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading"><td colspan="8" class="loading-cell">Загрузка...</td></tr>
            <tr v-else-if="loadError"><td colspan="8" class="loading-cell error-text">{{ loadError }}</td></tr>
            <tr v-else-if="items.length === 0"><td colspan="8" class="loading-cell">Товаров пока нет</td></tr>
            <tr v-else v-for="item in items" :key="item.id_item">
              <td>{{ item.id_item }}</td>
              <td>
                <div class="table-img-wrapper">
                  <img :src="item.photo || '/logo.jpg'" :alt="item.name"
                       @error="(e) => e.target.src = '/logo.jpg'">
                </div>
              </td>
              <td class="cell-name">{{ item.name }}</td>
              <td>{{ Number(item.price).toFixed(2) }} ₽</td>
              <td>{{ item.stock_balance }}</td>
              <td>{{ item.category_name || '—' }}</td>
              <td>{{ item.supplier_name || '—' }}</td>
              <td class="cell-actions">
                <button class="btn btn-small btn-edit" @click="openEdit(item)">✏️</button>
                <button class="btn btn-small btn-delete" @click="deleteItem(item)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ItemModal
      v-if="isModalOpen"
      :key="modalMode + '-' + (editingItem?.id_item || 'new')"
      :mode="modalMode"
      :item="editingItem"
      :categories="categories"
      :suppliers="suppliers"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>

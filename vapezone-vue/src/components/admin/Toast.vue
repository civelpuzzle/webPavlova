<script setup>
defineProps({ visible: Boolean, message: String, type: String })
</script>

<template>
  <div class="toast" :class="{
    'toast--visible': visible,
    'toast--success': type === 'success',
    'toast--error': type === 'error'
  }">{{ message }}</div>
</template>

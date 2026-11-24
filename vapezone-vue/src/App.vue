<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import Advantages from './components/Advantages.vue'
import Assortment from './components/Assortment.vue'
import Steps from './components/Steps.vue'
import Reviews from './components/Reviews.vue'
import Gallery from './components/Gallery.vue'
import FAQ from './components/FAQ.vue'
import OrderForm from './components/OrderForm.vue'
import Footer from './components/Footer.vue'
import Modal from './components/Modal.vue'
import ScrollTop from './components/ScrollTop.vue'

const isModalOpen = ref(false)
const openModal = () => isModalOpen.value = true
const closeModal = () => isModalOpen.value = false
</script>

<template>
  <div id="app">
    <Header @open-modal="openModal" />
    <main>
      <Hero @open-modal="openModal" />
      <Advantages />
      <Assortment />
      <Steps />
      <Reviews />
      <Gallery />
      <FAQ />
      <OrderForm />
    </main>
    <Footer />

    <Modal :is-open="isModalOpen" @close="closeModal" />
    <ScrollTop />
  </div>
</template>

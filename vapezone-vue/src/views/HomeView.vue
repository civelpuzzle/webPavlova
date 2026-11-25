<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import Hero from '../components/Hero.vue'
import Advantages from '../components/Advantages.vue'
import Assortment from '../components/Assortment.vue'
import Steps from '../components/Steps.vue'
import Reviews from '../components/Reviews.vue'
import Gallery from '../components/Gallery.vue'
import FAQ from '../components/FAQ.vue'
import OrderForm from '../components/OrderForm.vue'
import Footer from '../components/Footer.vue'
import Modal from '../components/Modal.vue'
import ScrollTop from '../components/ScrollTop.vue'

const isModalOpen = ref(false)
</script>

<template>
  <div>
    <Header @open-modal="isModalOpen = true" />
    <main>
      <Hero @open-modal="isModalOpen = true" />
      <Advantages />
      <Assortment />
      <Steps />
      <Reviews />
      <Gallery />
      <FAQ />
      <OrderForm />
    </main>
    <Footer />
    <Modal :is-open="isModalOpen" @close="isModalOpen = false" />
    <ScrollTop />
  </div>
</template>

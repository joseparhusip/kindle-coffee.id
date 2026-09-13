<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
</script>

<template>
  <LoadingScreen />
  <NavBar />
  <main>
    <RouterView />
  </main>
  <FooterBar />
</template>

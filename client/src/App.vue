<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-grow min-h-full">
      <RouterView/>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default{
  components : {
    Navbar,
    Footer,
  }
}
</script>

<style>
</style>
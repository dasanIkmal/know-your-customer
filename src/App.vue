<script setup>
import { ref } from "vue";

const formModel = ref({
  name: "",
});
</script>

<template>
  <div class="container mx-auto px-8">
    <nav class="flex gap-3"></nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>

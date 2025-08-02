<script setup>
import AdminNav from "@/components/AdminNav.vue";
</script>

<template>
  <AdminNav />
  <div class="pt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:min-h-screen">
    <RouterView />
  </div>
</template>

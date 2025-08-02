<script setup>
import { RouterLink } from "vue-router";
import Link from "./Link.vue";
import Logo from "./Logo.vue";
</script>

<template>
  <header
    class="bg-gray-700 flex justify-between absolute top-0 w-full z-10 px-10 py-5"
  >
    <div>
      <Logo />
    </div>
    <nav>
      <RouterLink
        :to="{ name: 'products' }"
        class="rounded text-white font-bold p-2"
      >
        Productos
      </RouterLink>

      <RouterLink
        :to="{ name: 'sales' }"
        class="rounded text-white font-bold p-2"
      >
        Ventas
      </RouterLink>

      <Link to="shop">Ir a Tienda</Link>
    </nav>
  </header>
</template>

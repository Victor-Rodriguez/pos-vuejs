<script setup>
import { useCartStore } from "@/stores/cart";
import { formatCurrency } from "@/helpers";

const cart = useCartStore();

defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="rounded bg-white shadow relative">
    <img :src="product.image" :alt="`Imagen de ${product.name}`" />

    <div class="p-3 space-y-2">
      <h3 class="text-xl font-black text-gray-500">{{ product.name }}</h3>
      <p class="text-gray-500">Disponibles: {{ product.availability }}</p>
      <p class="text-2xl font-extrabold text-gray-900">
        {{ formatCurrency(product.price) }}
      </p>
    </div>

    <button
      type="button"
      class="absolute top-5 -right-4"
      @click="cart.addItem(product)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-8 h-8 bg-green-500 rounded-full text-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </button>
  </div>
</template>

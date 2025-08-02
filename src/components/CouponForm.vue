<script setup>
import { useCouponStore } from "@/stores/coupons";

const store = useCouponStore();
</script>

<template>
  <p class="mt-5 py-5 font-bold border-t border-gray-200">
    ¿Tienes un código de cupón?
  </p>

  <div class="flex">
    <input
      type="text"
      placeholder="Ingresa tu código de cupón"
      class="p-2 bg-white border-gray-300 w-full rounded-md"
      v-model="store.couponInput"
    />
    <button
      type="button"
      class="p-3 bg-green-400 font-bold rounded-md disabled:opacity-30"
      @click="store.applyCoupon"
      :disabled="store.isValidCoupon"
    >
      Aplicar
    </button>
  </div>
  <p class="py-2 text-center text-sm font-extrabold">
    {{ store.couponValidationMessage }}
  </p>
</template>

<script setup>
import { ref } from "vue";
import { useSalesStore } from "@/stores/sales";
import { formatDateToDDMMYYYY, formatCurrency } from "@/helpers";
import SaleDetail from "@/components/SaleDetail.vue";

const sales = useSalesStore();
</script>
<template>
  <h1 class="text-4xl font-black my-10">Resumen de Ventas</h1>
  <div class="md:flex md:items-start gap-5">
    <div class="md:w-1/2 lg:w-1/3 bg-white flex justify-center p-5">
      <DatePicker
        v-model="sales.date"
        mode="date"
        is-expanded
        color="green"
        :attributes="[
          {
            key: 'today',
            highlight: {
              color: 'green',
              fillMode: 'light',
            },
            dates: new Date(),
          },
        ]"
        class="w-full"
      />
    </div>
    <div
      class="md:w-1/2 lg:w-2/3 space-y-5 lg:h-screen lg:overflow-y-scroll p-5 pb-32"
    >
      <p class="text-center text-lg" v-if="sales.isDateSelected">
        Ventas de la fecha:
        <span class="font-black">{{ formatDateToDDMMYYYY(sales.date) }}</span>
      </p>
      <p class="text-center text-lg" v-else>
        Selecciona una fecha para ver las ventas
      </p>

      <div v-if="sales.salesCollection.length" class="space-y-5">
        <p class="text-right text-2xl">
          Total del día:
          <span class="font-black">
            {{ formatCurrency(sales.totalSalesOfDay) }}
          </span>
        </p>

        <SaleDetail
          v-for="sale in sales.salesCollection"
          :key="sale.id"
          :sale="sale"
        />
      </div>
      <p class="text-center text-lg" v-else-if="sales.noSales">
        No hay ventas para mostrar
      </p>
    </div>
  </div>
</template>

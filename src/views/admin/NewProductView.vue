<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import Link from "@/components/Link.vue";
import useImage from "@/composables/useImage";
import { useProductsStore } from "@/stores/products";

const { url, onFileChange, isImageUploaded } = useImage();
const products = useProductsStore();
const router = useRouter();

const formData = reactive({
  name: "",
  category: "",
  price: "",
  availability: "",
  image: "",
});

const submitHandler = async (data) => {
  const { image, ...values } = data;
  try {
    await products.createProduct({
      ...values,
      image: url.value,
    });
    // Redirect to products list after successful creation
    router.push({ name: "products" });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div>
    <Link to="products">Volver</Link>
    <h1 class="text-4xl font-black my-10">Nuevo Producto</h1>

    <div class="flex justify-center bg-white shadow">
      <div class="mt-10 p-10 w-full 2xl:w-2/4">
        <FormKit
          type="form"
          submit-label="Agregar Producto"
          incomplete-message="Todos los campos son requeridos"
          @submit="submitHandler"
          :value="formData"
        >
          <FormKit
            type="text"
            name="name"
            label="Nombre"
            placeholder="Nombre del Producto"
            validation="required"
            :validation-messages="{
              required: 'El nombre del producto es obligatorio',
            }"
            v-model.trim="formData.name"
          />

          <FormKit
            type="file"
            name="image"
            label="Imagen del Producto"
            validation="required"
            :validation-messages="{
              required: 'La imagen del producto es obligatoria',
            }"
            accept=".jpg"
            @change="onFileChange"
            v-model.trim="formData.image"
          />

          <div v-if="isImageUploaded">
            <p class="font-black">Imagen Producto:</p>
            <img :src="url" alt="Imagen del Producto" class="w-32" />
          </div>

          <FormKit
            type="select"
            name="category"
            label="Categoría"
            validation="required"
            :validation-messages="{
              required: 'La categoría del producto es obligatoria',
            }"
            :options="products.categoryOptions"
            v-model.number="formData.category"
          />

          <FormKit
            type="number"
            name="price"
            label="Precio"
            placeholder="Precio del Producto"
            validation="required"
            :validation-messages="{
              required: 'El precio del producto es obligatorio',
            }"
            min="1"
            v-model.number="formData.price"
          />

          <FormKit
            type="number"
            name="availability"
            label="Disponible"
            placeholder="Cantidad Disponible"
            validation="required"
            :validation-messages="{
              required: 'La cantidad disponible es obligatoria',
            }"
            min="1"
            v-model.number="formData.availability"
          />
        </FormKit>
      </div>
    </div>
  </div>
</template>

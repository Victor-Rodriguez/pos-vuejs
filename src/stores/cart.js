import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useCouponStore } from "./coupons";
import { getCurrentDate } from "@/helpers";

export const useCartStore = defineStore("cart", () => {
  const coupon = useCouponStore();
  const db = useFirestore();

  const items = ref([]);
  const subtotal = ref(0); // Total price of items in the cart
  const taxes = ref(0); // Taxes applied to the subtotal
  const total = ref(0); // Total amount to be paid (subtotal + taxes)

  const MAX_PRODUCTS = 5; // Maximum number of products to display
  const TAX_RATE = 0.13; // Tax rate for the subtotal

  //  WatchEffect for changes in items to update subtotal, taxes, and total
  watchEffect(() => {
    subtotal.value = items.value.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
    // Calculate taxes based on the subtotal
    taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2));
    // Calculate total amount with discount
    total.value = Number(
      (subtotal.value + taxes.value - coupon.discountAmount).toFixed(2)
    );
  });

  function addItem(item) {
    const index = isItemInCart(item.id);
    if (index >= 0) {
      if (isProductAvailable(item, index)) {
        alert("Haz alcanzado el máximo permitido del producto: " + item.name);
        return;
      }
      // Update quantity if item already exists in the cart
      items.value[index].quantity++;
    } else {
      items.value.push({ ...item, quantity: 1, id: item.id });
    }
  }

  function updateQuantity(id, quantity) {
    items.value = items.value.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
  }

  // Remove an item from the cart
  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  async function checkout() {
    try {
      await addDoc(collection(db, "sales"), {
        items: items.value.map((item) => {
          const { availability, category, ...data } = item; // Exclude availability and category from the saved data
          return data;
        }),
        subtotal: subtotal.value,
        taxes: taxes.value,
        discount: coupon.discountAmount,
        total: total.value,
        date: getCurrentDate(),
      });
      // Commit the transaction to update the stock
      items.value.forEach(async (item) => {
        const productRef = doc(db, "products", item.id); // Reference to the product document
        await runTransaction(db, async (transaction) => {
          const currentProduct = await transaction.get(productRef); // Get the current product data
          const availability =
            currentProduct.data().availability - item.quantity; // Update availability
          transaction.update(productRef, { availability }); // Update the product document with new availability
        });
      });

      // Clear the cart after successful checkout
      $reset();
      coupon.$reset(); // Reset the coupon store after checkout
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  }

  function $reset() {
    items.value = [];
    subtotal.value = 0;
    taxes.value = 0;
    total.value = 0;
  }

  // Check if an item is already in the cart
  const isItemInCart = (id) => items.value.findIndex((item) => item.id === id);

  const isProductAvailable = (item, index) => {
    return (
      items.value[index].quantity >= item.availability ||
      items.value[index].quantity >= MAX_PRODUCTS
    );
  };

  const isEmpty = computed(() => items.value.length === 0);

  const checkProductAvailability = computed(() => {
    return (product) =>
      product.availability < MAX_PRODUCTS ? product.availability : MAX_PRODUCTS;
  });

  return {
    items,
    subtotal,
    taxes,
    total,
    addItem,
    updateQuantity,
    removeItem,
    checkout,
    isEmpty,
    checkProductAvailability,
  };
});

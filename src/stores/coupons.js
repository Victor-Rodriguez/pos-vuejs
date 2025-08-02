import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { useCartStore } from "./cart";

export const useCouponStore = defineStore("coupon", () => {
  const cart = useCartStore();

  const couponInput = ref("");
  const couponValidationMessage = ref("");
  const discountPercentage = ref(0);
  const discountAmount = ref(0);

  const VALID_COUPONS = [
    {
      code: "10DESCUENTO",
      discount: 0.1,
    },
    {
      code: "20DESCUENTO",
      discount: 0.2,
    },
  ];

  watch(discountPercentage, () => {
    discountAmount.value = (cart.total * discountPercentage.value).toFixed(2);
  });

  function applyCoupon() {
    if (VALID_COUPONS.some((coupon) => coupon.code === couponInput.value)) {
      couponValidationMessage.value = "Aplicando...";

      setTimeout(() => {
        discountPercentage.value = VALID_COUPONS.find(
          (coupon) => coupon.code === couponInput.value
        ).discount;
        couponValidationMessage.value = "¡Cupón aplicado con éxito!";
      }, 3000);
    } else {
      couponValidationMessage.value = "Cupón inválido";
    }

    setTimeout(() => {
      couponValidationMessage.value = "";
      couponInput.value = "";
    }, 6000);
  }

  //Reset the coupon state
  function $reset() {
    couponInput.value = "";
    discountPercentage.value = 0;
    discountAmount.value = 0;
    couponValidationMessage.value = "";
  }

  const isValidCoupon = computed(() => {
    return discountPercentage.value > 0;
  });

  return {
    couponInput,
    discountAmount,
    couponValidationMessage,
    applyCoupon,
    $reset,
    isValidCoupon,
  };
});

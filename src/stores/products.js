import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";
import {
  collection,
  addDoc,
  where,
  query,
  limit,
  orderBy,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";

export const useProductsStore = defineStore("products", () => {
  const db = useFirestore();
  const storage = useFirebaseStorage();

  const selectedCategory = ref(1); // Default category ID
  const categories = [
    { id: 1, name: "Sudadera" },
    { id: 2, name: "Tenis" },
    { id: 3, name: "Lentes" },
  ];

  const q = query(collection(db, "products"), orderBy("availability", "asc"));
  const productsCollection = useCollection(q);

  //   Function to create a new product
  async function createProduct(product) {
    await addDoc(collection(db, "products"), product);
  }

  //   Function to update a product
  async function updateProduct(docRef, product) {
    const { image, url, ...values } = product;
    // If an new image is uploaded, update the product with the new image URL
    // Otherwise, update the product without changing the image
    if (image.length) {
      await updateDoc(docRef, { ...values, image: url.value });
    } else {
      await updateDoc(docRef, values);
    }
  }

  //   Function to delete a product
  async function deleteProduct(id) {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    const { image } = docSnap.data(); //Get the image URL from the document
    const imageRef = storageRef(storage, image); // Create a reference to the image in Firebase Storage

    await Promise.all([
      deleteDoc(docRef), // Delete the product document
      deleteObject(imageRef), // Delete the image from Firebase Storage
    ]);
  }

  const categoryOptions = computed(() => {
    const options = [
      {
        label: "Selecciona una categoría",
        value: "",
        attrs: { disabled: true },
      },
      ...categories.map((category) => {
        return { label: category.name, value: category.id };
      }),
    ];
    return options;
  });

  const noResults = computed(() => {
    return productsCollection.value.length === 0;
  });

  const filteredProducts = computed(() => {
    return productsCollection.value
      .filter((product) => product.category === selectedCategory.value)
      .filter((product) => product.availability > 0);
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    productsCollection,
    categories,
    selectedCategory,
    categoryOptions,
    noResults,
    filteredProducts,
  };
});

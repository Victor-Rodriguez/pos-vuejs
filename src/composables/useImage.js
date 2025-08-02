import { ref, computed } from "vue";
import { useFirebaseStorage } from "vuefire";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { uid } from "uid";

export default function useImage() {
  const url = ref("");
  const storage = useFirebaseStorage();

  const onFileChange = (e) => {
    const file = e.target.files[0];
    const fileName = uid() + ".jpg"; // Genera un nombre de archivo único
    const sRef = storageRef(storage, "/products/" + fileName);

    //Subida del archivo
    const uploadTask = uploadBytesResumable(sRef, file);

    uploadTask.on(
      "state_changed",
      () => {}, //Image uploading, do nothing here
      (error) => {
        // Error handling
        console.error("Upload failed:", error);
      },
      () => {
        //Upload is complete

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          url.value = downloadURL; // Set the URL to the ref
        });
      }
    );
  };

  const isImageUploaded = computed(() => {
    return url.value ? url.value : null;
  });

  return {
    url,
    onFileChange,
    isImageUploaded,
  };
}

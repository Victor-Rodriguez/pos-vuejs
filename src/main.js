import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
// Firebase
import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "./config/firebase";
import { plugin, defaultConfig } from "@formkit/vue";
import { rootClasses } from "../formkit.theme.mjs";

// SweetAlert2
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// VCalendar
import { setupCalendar, DatePicker } from "v-calendar";
import "v-calendar/dist/style.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

app.use(createPinia());
app.use(
  plugin,
  defaultConfig({
    config: {
      rootClasses,
    },
  })
);

// SweetAlert2
app.use(VueSweetalert2);
app.use(router);

// Use calendar defaults (optional)
app.use(setupCalendar, {});

// Use the components
app.component("DatePicker", DatePicker);

app.mount("#app");

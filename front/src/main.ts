import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import ToastService from "primevue/toastservice";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";

// import "primevue/resources/themes/lara-light-indigo/theme.css";
// import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
const app = createApp(App);

async function initializeApp() {
  app.use(router);
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: ".my-app-dark",
      },
    },
  });
  app.use(ToastService);
  app.mount("#app");
  router.push('/task');
}

initializeApp();

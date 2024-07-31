import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";

const app = createApp(App);

async function initializeApp() {
  app.use(router);
  app.mount("#app");
}

initializeApp();

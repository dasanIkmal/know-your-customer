import { createApp } from "vue";
import "./style.css";

// UI library
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// Routing
import router from "./router";

// Store
import { createPinia } from "pinia";

import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(ElementPlus).use(router).use(pinia);

app.mount("#app");

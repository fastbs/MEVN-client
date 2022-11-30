import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
//import store from "./store";
import { registerLicense } from "@syncfusion/ej2-base";

import "bootstrap/dist/js/bootstrap.bundle.min";
import "@mdi/font/css/materialdesignicons.css";
import "@sweetalert2/themes/bootstrap-4/bootstrap-4.css";

registerLicense("ORg4AjUWIQA/Gnt2VVhiQlFadVlJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRdkJhXn9ec3ZUR2FcUEY=");

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
//  .use(store)
  .mount('#app');

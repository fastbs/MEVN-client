<template>
  <div>
    <nav class="navbar navbar-expand-lg border-bottom navbar-dark bg-primary">
      <div class="container-fluid">
        <router-link class="navbar-brand" :to="{ name: 'Home' }"
          >Fastbs Application</router-link
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-2 me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-for="item of menu" :key="item.name">
              <router-link
                class="nav-link"
                :to="{ name: item.route }"
                active-class="active"
                ><span :class="'mdi ' + item.icon + ' me-2'" />{{
                  item.name
                }}</router-link
              >
            </li>
          </ul>
          <form class="d-flex" role="search">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Поиск..."
              aria-label="Search"
            />
            <button
              class="btn btn-outline-light"
              type="button"
              @click="updateMenu"
            >
              Поиск
            </button>
          </form>
        </div>
      </div>
    </nav>

    <router-view @update-menu="updateMenu"></router-view>

    <div class="footer bg-dark d-flex align-items-center">
      <div class="">
        <span class="text-white ms-2">SyncfusionWebApp12</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import AuthService from "@/services/AuthService";
import { useMainStore } from "@/store/MainStore";

export default {
  name: "App",

  setup() {
    const menu = ref([]);
    const store = useMainStore();

    store.count = 3;

    const updateMenu = async () => {
      const response = await AuthService.getMenu();
      menu.value = response.data.menu;
    };

    updateMenu();

    return { menu, updateMenu };
  },
};
</script>

<style>
@import "bootstrap/dist/css/bootstrap.css";
@import "@syncfusion/ej2-base/styles/bootstrap.css";
@import "@syncfusion/ej2-popups/styles/bootstrap.css";
@import "@syncfusion/ej2-navigations/styles/bootstrap.css";

html {
  position: relative;
  min-height: 100%;
}

body {
  margin-bottom: 30px !important; /* Height of the footer */
  padding: 0;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px; /* Set the fixed height of the footer here */
}
</style>

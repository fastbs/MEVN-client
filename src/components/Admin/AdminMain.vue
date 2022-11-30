<template>
  <div class="container-fluid">
    <div class="row m-3">
      <div class="mb-3"><h1>Admin start's here...</h1></div>
      <div class="mb-3">
        <ejs-filemanager
          id="file-manager"
          :ajaxSettings="ajaxSettings"
        ></ejs-filemanager>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  FileManagerComponent,
  DetailsView,
  NavigationPane,
  Toolbar,
} from "@syncfusion/ej2-vue-filemanager";

export default {
  name: "AdminMain",

  components: {
    "ejs-filemanager": FileManagerComponent,
  },

  provide: {
    filemanager: [DetailsView, NavigationPane, Toolbar],
  },

  setup() {
    const files = ref([]);
    const upload = ref(null);

    const ajaxSettings = ref({
      url: "http://127.0.0.1:8090/",
      getImageUrl:
        "http://127.0.0.1:8090/GetImage",
      uploadUrl:
        "http://127.0.0.1:8090/Upload",
      downloadUrl:
        "http://127.0.0.1:8090/Download",
    });

    return {
      files,
      upload,
      ajaxSettings,
    };
  },
};
</script>

<style scoped>
@import "@syncfusion/ej2-base/styles/bootstrap5.css";
@import "@syncfusion/ej2-icons/styles/bootstrap5.css";
@import "@syncfusion/ej2-inputs/styles/bootstrap5.css";
@import "@syncfusion/ej2-popups/styles/bootstrap5.css";
@import "@syncfusion/ej2-buttons/styles/bootstrap5.css";
@import "@syncfusion/ej2-splitbuttons/styles/bootstrap5.css";
@import "@syncfusion/ej2-navigations/styles/bootstrap5.css";
@import "@syncfusion/ej2-layouts/styles/bootstrap5.css";
@import "@syncfusion/ej2-grids/styles/bootstrap5.css";
@import "@syncfusion/ej2-vue-filemanager/styles/bootstrap5.css";
</style>

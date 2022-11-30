<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-6" v-if="!loading && gantts.length > 0">
        <div class="mb-3"><h1>Диаграммы Ганта</h1></div>
        <div class="" v-for="item in gantts" :key="item.title">
          <div class="card mb-3 shadow">
            <div class="card-body">
              <h4 class="card-title">{{ item.title }}</h4>
              <hr />
              <p class="card-text text-truncate">{{ item.description }}</p>
              <div class="d-flex justify-content-end">
                <router-link
                  class="btn btn-primary me-2"
                  v-if="permissions.find((x) => x.action == 'get').allow"
                  :to="{ name: 'GanttView', params: { id: item._id } }"
                  ><span class="mdi mdi-chart-gantt mdi-18px me-1"></span>Просмотр</router-link
                >
                <button
                  v-if="permissions.find((x) => x.action == 'delete').allow"
                  type="button"
                  class="btn btn-danger me-2"
                  @click="deleteGantt(item._id)"
                >
                  <span class="mdi mdi-delete mdi-18px me-1"></span>Удалить
                </button>

                <!--  <router-link
                  class="btn btn-success me-2"
                  v-if="permissions.find((x) => x.action == 'put').allow"
                  :to="{ name: 'EditPost', params: { id: post._id } }"
                  >Edit</router-link
                >
                <button
                  type="button"
                  class="btn btn-danger me-2"
                  v-if="permissions.find((x) => x.action == 'delete').allow"
                  @click="deleteDiagram(post._id)"
                >
                  Delete
                </button> -->
              </div>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2">
          <router-link
            class="btn btn-primary mb-4"
            v-if="!loading && permissions.find((x) => x.action == 'post').allow"
            :to="{ name: 'GanttAdd' }"
            ><span class="mdi mdi-creation mdi-18px me-2"></span>Создать диаграмму Ганта</router-link
          >
        </div>
      </div>
      <div v-else-if="!loading">
        <h2 class="mb-3 mt-8">There are no diagrams..</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import GanttService from "@/services/GanttService";

export default {
  name: "GanttFetch",

  setup() {
    const router = useRouter();

    const gantts = ref([]);
    const loading = ref(true);
    const permissions = ref({});

    const getGantts = async () => {
      try {
        const response = await GanttService.fetch();
        gantts.value = response.data.gantts;
        loading.value = false;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Беда в GanttFetch - getGantts!!!",
          text: err.response.data.message,
        });
      }
    };

    const deleteGantt = async (value) => {
      Swal.fire({
        icon: "question",
        title: "Are you sure to delete the Gantt?",
        showDenyButton: true,
        confirmButtonText: "Confirm delete",
        denyButtonText: "Dismiss",
        confirmButtonColor: "#dc3545",
        denyButtonColor: "#0d6efd",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await GanttService.delete(value);
            getGantts();
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Беда в GanttFetch - deleteGantt!!!",
              text: err.response.data.message,
            });
          }
        }
      });
    };

    onMounted(async () => {
      const response = await AuthService.checkPermissions({
        resource: "gantts",
      });
      permissions.value = response.data.permissions;
      if (permissions.value.find((x) => x.action == "fetch").allow) {
        getGantts();
      } else {
        Swal.fire({
          icon: "error",
          title: "Беда в GanttFetch - mounted!!!",
          text: "Доступ запрещен!",
        }).then(() => {
          router.push({ name: "Home" });
        });
      }
    });

    return { router, gantts, loading, permissions, deleteGantt };
  },
};
</script>

<style scoped>
@import "bootstrap/dist/css/bootstrap.css";
</style>

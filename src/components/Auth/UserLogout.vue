<template>
  <div class="row m-3">
    <div
      class="modal fade"
      id="logoutModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-light" id="exampleModalLabel">Выход</h5>
          </div>
          <div class="modal-body">
            Вы действительно желаете выйти из системы?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              @click="onSubmit"
            >
              Выход
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="router.push({ name: 'Home' })"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";

export default {
  name: "UserLogout",

  emits: ["update-menu"],

  setup(props, context) {
    const router = useRouter();

    onMounted(() => {
      const modal = new bootstrap.Modal(document.getElementById("logoutModal"));
      modal.show();
    });

    const onSubmit = async () => {
      window.localStorage.removeItem("auth");
      context.emit("update-menu");
      router.push({ name: "Home" });
    };

    return { onSubmit, router };
  },
};

</script>

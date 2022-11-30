<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-6" v-if="!loading">
        <div class="card mb-3 mt-3 shadow">
          <div class="card-header bg-primary text-light">Add post</div>
          <div class="card-body">
            <div class="form-group mb-4">
              <label for="title">Post title</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><span class="mdi mdi-message mdi-24px"
                /></span>
                <input
                  type="text"
                  v-model="post.title"
                  id="title"
                  name="title"
                  :class="{
                    'is-invalid': v$.title.$error,
                    'form-control': true,
                  }"
                />
                <div v-if="v$.title.$error" class="invalid-feedback">
                  <span v-if="v$.title.required.$invalid">Post title required</span>
                </div>
              </div>
            </div>

            <div class="form-group mb-4">
              <label for="description">Post description</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><span class="mdi mdi-message-text mdi-24px"
                /></span>
                <input
                  type="text"
                  v-model="post.description"
                  id="description"
                  name="description"
                  :class="{
                    'is-invalid': v$.description.$error,
                    'form-control': true,
                  }"
                />
                <div v-if="v$.description.$error" class="invalid-feedback">
                  <span v-if="v$.description.required.$invalid"
                    >Post desription required</span
                  >
                </div>
              </div>
            </div>

            <div class="form-group">
              <button type="button" class="btn btn-primary" @click="addPost">
                Add post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import PostsService from "@/services/PostsService";

export default {
  name: "PostAdd",

  setup() {
    const router = useRouter();

    const post = reactive({ title: "", description: "" });
    const loading = ref(true);
    const permissions = ref({});

    const rules = computed(() => ({
      title: {
        required,
      },
      description: {
        required,
      },
    }));

    const v$ = useVuelidate(rules, post);

    const addPost = async () => {
      const isFormCorrect = await v$.value.$validate();

      if (isFormCorrect) {
        await PostsService.add({
          title: post.title,
          description: post.description,
        });
        router.push({ name: "PostsFetch" });
      }
    };

    onMounted(async () => {
      const response = await AuthService.checkPermissions({
        resource: "posts",
      });
      permissions.value = response.data.permissions;
      if (permissions.value.find((x) => x.action == "post").allow) {
        loading.value = false;
      } else {
        Swal.fire({
          icon: "error",
          title: "Беда в PostAdd - mounted!!!",
          text: "Доступ запрещен!",
        });
        router.push({ name: "Home" });
      }
    });

    return { post, loading, addPost, v$ };
  },
};
</script>

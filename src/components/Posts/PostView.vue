<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-6" v-if="!loading">
        <div class="mb-3"><h1>Post</h1></div>
        <div class="card mb-3 shadow">
          <div class="card-body">
            <h4 class="card-title">{{ post.title }}</h4>
            <hr />
            <p class="card-text text-truncate">{{ post.description }}</p>
            <div class="d-flex justify-content-end">
              <router-link
                class="btn btn-success me-2"
                v-if="permissions.find((x) => x.action == 'put').allow"
                :to="{ name: 'PostEdit', params: { id: post._id } }"
                >Edit</router-link
              >
              <button
                type="button"
                class="btn btn-danger me-2"
                v-if="permissions.find((x) => x.action == 'delete').allow"
                @click="deletePost(post._id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div class="d-grid gap-2">
          <router-link
            class="btn btn-primary mb-4"
            v-if="!loading && permissions.find((x) => x.action == 'post').allow"
            :to="{ name: 'PostAdd' }"
            >Add post</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import PostsService from "@/services/PostsService";

export default {
  name: "PostView",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();

    const post = ref({});
    const loading = ref(true);
    const permissions = ref({});

    const getPost = async () => {
      try {
        const response = await PostsService.get({ id: props.id });
        post.value = response.data.post;
        loading.value = false;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Беда в PostView - getPost!!!",
          text: err.response.data.message,
        });
      }
    };

    const deletePost = async () => {
      Swal.fire({
        icon: "question",
        title: "Are you sure to delete the post?",
        showDenyButton: true,
        confirmButtonText: "Confirm delete",
        denyButtonText: "Dismiss",
        confirmButtonColor: "#dc3545",
        denyButtonColor: "#0d6efd",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await PostsService.delete(post.value._id);
            router.push({ name: "PostsFetch" });
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Беда в PostView - deletePost!!!",
              text: err.response.data.message,
            });
          }
        }
      });
    };

    onMounted(async () => {
      const response = await AuthService.checkPermissions({
        resource: "posts",
      });
      permissions.value = response.data.permissions;
      if (permissions.value.find((x) => x.action == "get").allow) {
        getPost();
      } else {
        Swal.fire({
          icon: "error",
          title: "Беда в PostView - mounted!!!",
          text: "Доступ запрещен!",
        }).then(() => {
          router.push({ name: "Home" });
        });
      }
    });

    return { router, post, loading, permissions, deletePost };
  },
};
</script>

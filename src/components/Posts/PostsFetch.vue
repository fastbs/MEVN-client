<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-6" v-if="!loading && posts.length > 0">
        <div class="mb-3"><h1>Posts</h1></div>
        <div class="" v-for="post in posts" :key="post.title">
          <div class="card mb-3 shadow">
            <div class="card-body">
              <h4 class="card-title">{{ post.title }}</h4>
              <hr />
              <p class="card-text text-truncate">{{ post.description }}</p>
              <div class="d-flex justify-content-end">
                <router-link
                  class="btn btn-primary me-2"
                  v-if="permissions.find((x) => x.action == 'get').allow"
                  :to="{ name: 'PostView', params: { id: post._id } }"
                  >View</router-link
                >
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
      <div v-else-if="!loading">
        <h2 class="mb-3 mt-8">There are no posts..</h2>
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
  name: "PostsFetch",

  setup() {
    const router = useRouter();

    const posts = ref([]);
    const loading = ref(true);
    const permissions = ref({});

    const getPosts = async () => {
      try {
        const response = await PostsService.fetch();
        posts.value = response.data.posts;
        loading.value = false;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Беда в PostsFetch - getPosts!!!",
          text: err.response.data.message,
        });
      }
    };

    const deletePost = async (value) => {
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
            await PostsService.delete(value);
            getPosts();
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Беда в PostsFetch - deletePost!!!",
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
      if (permissions.value.find((x) => x.action == "fetch").allow) {
        getPosts();
      } else {
        Swal.fire({
          icon: "error",
          title: "Беда в PostsFetch - mounted!!!",
          text: "Доступ запрещен!",
        }).then(() => {
          router.push({ name: "Home" });
        });
      }
    });

    return { router, posts, loading, permissions, deletePost };
  },
};
</script>

<style scoped>
@import "bootstrap/dist/css/bootstrap.css";
</style>

import { createRouter, createWebHistory } from "vue-router";
import CommonRoutes from "./CommonRoutes";
import PostsRoutes from "./PostsRoutes";
import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";
import GanttRoutes from "./GanttRoutes";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: CommonRoutes.concat(AuthRoutes).concat(PostsRoutes).concat(AdminRoutes).concat(GanttRoutes)
});

export default router;
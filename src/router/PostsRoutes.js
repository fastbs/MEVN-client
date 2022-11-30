import PostsFetch from "@/components/Posts/PostsFetch";
import PostView from "@/components/Posts/PostView";
import PostAdd from "@/components/Posts/PostAdd";
import PostEdit from "@/components/Posts/PostEdit";

const routes = [
  {
    path: "/posts",
    name: "PostsFetch",
    component: PostsFetch
  },
  {
    path: "/posts/new",
    name: "PostAdd",
    component: PostAdd
  },
  {
    path: "/posts/edit/:id",
    name: "PostEdit",
    component: PostEdit,
    props: true
  },
  {
    path: "/posts/:id",
    name: "PostView",
    component: PostView,
    props: true
  },
];

export default routes;

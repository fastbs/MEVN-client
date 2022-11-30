import UserLogin from "@/components/Auth/UserLogin";
import UserLogout from "@/components/Auth/UserLogout";
import UserRegistration from "@/components/Auth/UserRegistration";

const routes = [
  {
    path: "/login",
    name: "UserLogin",
    component: UserLogin
  },
  {
    path: "/logout",
    name: "UserLogout",
    component: UserLogout
  },
  {
    path: "/registration",
    name: "UserRegistration",
    component: UserRegistration
  }
];

export default routes;

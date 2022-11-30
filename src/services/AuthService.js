import api from "@/services/api";

export default {
  registerUser(params) {
    return api().post("users/register", params);
  },

  loginUser(params) {
    return api().post("users/login", params);
  },

  checkPermissions(params) {
    return api().post("users/permissions", params);
  },

  getMenu() {
    return api().get("users/menu");
  },

  async checkAction(resource, action) {
    try {
      const resp =  await api().post("users/permissions", { "resource": resource });
      if (resp.data.permissions.find((x) => x.action == action).allow) {
        return true;
      }
    }
    catch {
      console.log("catch")
      return false;
    }

    console.log("return")
    
    return false;
  },


};

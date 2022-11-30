import api from "@/services/api";

export default {
  fetch () {
    return api().get("stuffs")
  },
  get (params) {
    return api().get(`stuffs/${params.id}`)
  }
};

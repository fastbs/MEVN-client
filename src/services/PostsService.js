import api from "@/services/api";

export default {
  fetch () {
    return api().get('posts')
  },
  add (params) {
    return api().post('posts', params)
  },
  get (params) {
    return api().get(`posts/${params.id}`)
  },
  update (params) {
    return api().put(`posts/${params._id}`, params)
  },
  delete (id) {
    return api().delete(`posts/${id}`)
  }
};

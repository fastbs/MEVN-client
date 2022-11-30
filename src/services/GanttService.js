import api from "@/services/api";

export default {
  fetch() {
    return api().get("gantts");
  },
  add(params) {
    return api().post("gantts", params);
  },
  get(params) {
    return api().get(`gantts/${params.id}`);
  },
  update(params) {
    return api().put(`gantts/${params._id}`, params);
  },
  delete(id) {
    return api().delete(`gantts/${id}`);
  },

  fetchTemplates() {
    return api().get("ganttTemplates");
  },
  getTemplate(params) {
    return api().get(`ganttTemplates/${params.id}`);
  },
  addTemplate(params) {
    return api().post("ganttTemplates", params);
  },

  fetchAttachments(params) {
    return api().get(`ganttAttachments/${params.id}/${params.taskId}`);
  },
  addAttachment(params) {
    return api().post("ganttAttachments", params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getAttachment(params) {
    return api().get(`ganttAttachments/${params.ganttId}/${params.taskId}/${params.listId}`, {
      responseType: 'blob'
    });
  },
  updateAttachment(params) {
    return api().put(`ganttAttachments/${params.ganttId}/${params.taskId}/${params.listId}`, params);
  },
  deleteAttachment(params) {
    return api().delete(`ganttAttachments/${params.ganttId}/${params.taskId}/${params.listId}`);
  },
};

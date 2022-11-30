<template>
  <div
    class="modal fade"
    :id="props.id"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered" style="max-width: 1000px">
      <div class="modal-content" v-if="attachments.showModal">
        <div class="modal-header bg-primary">
          <h5 class="modal-title text-light" id="exampleModalLabel">
            Вложения для {{ attachments.rowData.TaskID }} -
            {{ attachments.rowData.TaskName }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="hideAttachmentsModal()"
          ></button>
        </div>
        <div class="modal-body">
          <ejs-grid
            id="aGrid"
            :dataSource="attachments.data.list"
            :toolbar="aParams.toolbar"
            :editSettings="aParams.editSettings"
            :toolbarClick="aToolbarClickHandler"
            :rowSelected="aRowSelected"
            :rowDeselecting="aRowDeselecting"
            :actionComplete="aActionComplete"
            :created="gridCreated"
          >
            <e-columns>
              <e-column
                field="position"
                headerText="№"
                textAlign="Left"
                width="40"
                :allowEditing="false"
              ></e-column>
              <e-column
                field="fileName"
                headerText="Файл"
                textAlign="Left"
                width="100"
                :allowEditing="false"
              ></e-column>
              <e-column
                field="fileSize"
                headerText="Размер"
                width="120"
                :allowEditing="false"
              ></e-column>
              <e-column
                field="description"
                headerText="Комментарий"
                width="150"
              ></e-column>
            </e-columns>
          </ejs-grid>

          <input
            id="hiddenAttachment"
            class="hide"
            type="file"
            @change.prevent="submitAttachment($event)"
          />
          <a id="attachmentAnchor" class="hide" />
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click.prevent="handleAttachment($event)"
          >
            Создать вложение
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="hideAttachmentsModal()"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";

import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Toolbar,
  Edit,
} from "@syncfusion/ej2-vue-grids";

import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import GanttService from "@/services/GanttService";

//import { useMainStore } from "@/store/MainStore";

export default {
  name: "AttachmentModal",

  props: {
    id: {
      type: String,
    },
  },

  components: {
    "ejs-grid": GridComponent,
    "e-columns": ColumnsDirective,
    "e-column": ColumnDirective,
  },

  provide: {
    grid: [Toolbar, Edit],
  },

  setup(props) {
    //const store = useMainStore();
    const permissionsAttachments = ref({});

    const attachments = reactive({
      id: null,
      showModal: false,
      data: {},
      rowData: {},
      file: null,
    });

    let attachmentsModal = null;

    const gridData = ref([]);
    const aParams = reactive({});

    onMounted(async () => {
      let response = await AuthService.checkPermissions({
        resource: "ganttAttachments",
      });
      permissionsAttachments.value = response.data.permissions;

      attachmentsModal = new bootstrap.Modal(document.getElementById(props.id));
    });

    const showAttachmentsModal = async (_id, args) => {
      GanttService.fetchAttachments({
        id: _id,
        taskId: args.rowData.TaskID,
      }).then((res) => {
        attachments.id = _id;
        attachments.rowData = args.rowData;
        if (res.data.ganttAttachments)
          attachments.data = res.data.ganttAttachments;
        else attachments.data.list = null;
        attachments.showModal = true;

        aParams.toolbar = [
          {
            text: "Add",
            tooltipText: "Add",
            prefixIcon: "mdi mdi-plus mdi-18px",
            id: "attachmentAdd",
            disabled: false,
          },
          {
            text: "Download",
            tooltipText: "Download",
            prefixIcon: "mdi mdi-magnify mdi-18px",
            id: "attachmentDownload",
            disabled: true,
          },
          {
            text: "Edit",
            tooltipText: "Edit",
            prefixIcon: "mdi mdi-pencil mdi-18px",
            id: "attachmentEdit",
            disabled: true,
          },
          {
            text: "Delete",
            tooltipText: "Delete",
            prefixIcon: "mdi mdi-close-thick mdi-18px",
            id: "attachmentDelete",
            disabled: true,
          },
        ];
        aParams.editSettings = {
          allowEditing: true,
          allowAdding: false,
          allowDeleting: false,
        };

        attachmentsModal.show();
      });
    };

    const hideAttachmentsModal = async () => {
      attachmentsModal.hide();
    };

    const aRowSelected = () => {
      document
        .getElementById("aGrid")
        .ej2_instances[0].enableToolbarItems(
          ["attachmentDownload", "attachmentEdit", "attachmentDelete"],
          true
        );
    };

    const aRowDeselecting = () => {
      document
        .getElementById("aGrid")
        .ej2_instances[0].enableToolbarItems(
          ["attachmentDownload", "attachmentEdit", "attachmentDelete"],
          false
        );
    };

    const aActionComplete = async (args) => {
      if (
        args.action === "edit" &&
        args.data.description !=
          attachments.data.list[args.rowIndex].description
      ) {
        console.log(args);
        try {
          await GanttService.updateAttachment({
            ganttId: attachments.id,
            taskId: attachments.rowData.TaskID,
            listId: args.data._id,
            description: args.data.description,
          });

          GanttService.fetchAttachments({
            id: attachments.id,
            taskId: attachments.rowData.TaskID,
          }).then((res) => {
            if (res.data.ganttAttachments)
              attachments.data = res.data.ganttAttachments;
            else attachments.data.list = null;
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Беда в AttachmentModal - deleteAttachment!!!",
            text: err.response.data.message,
          });
        }
      }
    };

    const aToolbarClickHandler = async (args) => {
      const ej = document.getElementById("aGrid").ej2_instances[0];

      if (args.item.id === "attachmentAdd") {
        document.getElementById("hiddenAttachment").click();
      }

      if (args.item.id === "attachmentEdit") {
        console.log(ej.selectedRowIndex);
        console.log(ej);
        console.log(ej.editCell);
        ej.startEdit(); //editCell(ej.selectedRowIndex, "description");
      }

      if (args.item.id === "attachmentDelete") {
        try {
          await GanttService.deleteAttachment({
            ganttId: attachments.id,
            taskId: attachments.rowData.TaskID,
            listId: attachments.data.list[ej.selectedRowIndex]._id,
          });

          GanttService.fetchAttachments({
            id: attachments.id,
            taskId: attachments.rowData.TaskID,
          }).then((res) => {
            if (res.data.ganttAttachments)
              attachments.data = res.data.ganttAttachments;
            else attachments.data.list = null;
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Беда в AttachmentModal - deleteAttachment!!!",
            text: err.response.data.message,
          });
        }
      }

      if (args.item.id === "attachmentDownload") {
        let anchor = document.getElementById("attachmentAnchor");
        let item = attachments.data.list[ej.selectedRowIndex];

        GanttService.getAttachment({
          ganttId: attachments.id,
          taskId: attachments.rowData.TaskID,
          listId: item._id,
        }).then((res) => {
          let attachment = window.URL.createObjectURL(new Blob([res.data]));

          anchor.href = attachment;
          anchor.download = item.fileName;
          anchor.click();
          console.log(item, anchor);
        });
      }
    };

    const handleAttachment = () => {
      document.getElementById("hiddenAttachment").click();
    };

    const submitAttachment = async (event) => {
      attachments.file = event.target.files[0];

      let formData = new FormData();
      formData.append("id", attachments.id);
      formData.append("taskId", attachments.rowData.TaskID);
      formData.append("filename", event.target.files[0].name);
      formData.append("attachment", attachments.file);

      GanttService.addAttachment(formData).then(() => {
        GanttService.fetchAttachments({
          id: attachments.id,
          taskId: attachments.rowData.TaskID,
        }).then((res) => {
          if (res.data.ganttAttachments)
            attachments.data = res.data.ganttAttachments;
          else attachments.data = null;
        });
      });
    };

    const gridCreated = async () => {
      document.getElementById("aGrid_toolbarItems").style.height = "55px";

      document.styleSheets[0].insertRule(
        `button[id^="attachment"] {
            padding: 0 4px !important;
            border: none !important;
            }`,
        0
      );
    };

    //    provide("showAttachmentsModal", showAttachmentsModal);

    return {
      props,
      attachments,
      gridData,
      aParams,
      showAttachmentsModal,
      hideAttachmentsModal,
      handleAttachment,
      submitAttachment,
      aToolbarClickHandler,
      aRowSelected,
      aRowDeselecting,
      aActionComplete,
      gridCreated,
    };
  },
};
</script>

<style scoped>
@import "@syncfusion/ej2-vue-grids/styles/bootstrap5.css";

.hide {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>
<template>
  <div class="container-fluid">
    <div class="row m-3" v-if="!loading">
      <div class="mb-3">
        <h3>Диаграмма: {{ gData.title }} - {{ gData.description }}</h3>
      </div>
      <div
        class="mb-3"
        v-if="
          permissions.find((x) => x.action == 'put').allow ||
          permissions.find((x) => x.action == 'delete').allow
        "
      >
        <button
          v-if="permissions.find((x) => x.action == 'put').allow"
          type="button"
          class="btn btn-primary me-3"
          @click="updateGantt"
        >
          <span class="mdi mdi-upload mdi-18px me-1"></span>Сохранить
        </button>
        <button
          v-if="permissions.find((x) => x.action == 'delete').allow"
          type="button"
          class="btn btn-danger me-3"
          @click="deleteGantt"
        >
          <span class="mdi mdi-delete mdi-18px me-1"></span>Удалить
        </button>
        <button
          v-if="permissionsTemplates.find((x) => x.action == 'post').allow"
          type="button"
          class="btn btn-secondary me-3"
          @click="showTemplateModal"
        >
          <span class="mdi mdi-shape mdi-18px me-1"></span>Создать шаблон
        </button>
        <button type="button" class="btn btn-success me-3" @click="action">
          <span class="mdi mdi-hammer mdi-18px me-1"></span>Клац
        </button>
        <button type="button" class="btn btn-info me-3" @click="action2">
          <span class="mdi mdi-hammer mdi-18px me-1"></span>Клац 2
        </button>
      </div>
      <div class="mb-2">
        <ejs-gantt
          ref="gantt"
          id="GanttContainer"
          :dataSource="gData.data"
          :readOnly="gParams.readOnly"
          :taskFields="gParams.taskFields"
          :editDialogFields="gParams.editDialogFields"
          :resourceFields="gParams.resourceFields"
          :resources="gParams.editingResources"
          :highlightWeekends="gParams.highlightWeekends"
          :workWeek="gParams.workWeek"
          :toolbar="gParams.toolbar"
          :editSettings="gParams.editSettings"
          :contextMenuItems="gParams.contextMenuItems"
          :height="gParams.height"
          :allowExcelExport="gParams.allowExcelExport"
          :allowPdfExport="gParams.allowPdfExport"
          :enableContextMenu="gParams.enableContextMenu"
          :allowSorting="gParams.allowSorting"
          :allowResizing="gParams.allowResizing"
          :toolbarClick="toolbarClick"
          :contextMenuClick="contextMenuClick"
          :contextMenuOpen="contextMenuOpen"
          :created="ganttCreated"
          :actionBegin="actionBegin"
        ></ejs-gantt>
      </div>
    </div>

    <div class="modal fade" id="templateModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title text-light" id="exampleModalLabel">
              Создание шаблона
            </h5>
          </div>
          <div class="modal-body">
            <div class="form-group mb-3">
              <label for="title">Заголовок</label>
              <div
                :class="{
                  'e-input-group': true,
                  'e-input-focus': false,
                  'e-error': v$.title.$error,
                }"
              >
                <span
                  class="
                    e-input-group-icon
                    mdi mdi-message-outline mdi-18px
                    e-input-btn-ripple
                  "
                ></span>
                <input
                  type="text"
                  v-model="template.title"
                  id="title"
                  name="title"
                  class="e-input"
                  placeholder="Введите заголовок"
                />
              </div>
              <div v-if="v$.title.$error" class="myClass">
                <span v-if="v$.title.required.$invalid"
                  >Заголовок обязателен</span
                >
              </div>
            </div>

            <div class="form-group">
              <label for="description">Описание</label>
              <div
                :class="{
                  'e-input-group': true,
                  'e-error': v$.description.$error,
                }"
              >
                <span
                  class="
                    e-input-group-icon
                    mdi mdi-message-text-outline mdi-18px
                  "
                ></span>
                <input
                  type="text"
                  v-model="template.description"
                  id="description"
                  name="description"
                  class="e-input"
                  placeholder="Введите описание"
                />
              </div>
              <div v-if="v$.description.$error" class="myClass">
                <span v-if="v$.description.required.$invalid"
                  >Описание обязательно</span
                >
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="createTemplate"
            >
              Создать шаблон
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>

    <a-modal id="attachmentsModal" ref="attachmentsModalRef"></a-modal>
    <s-modal id="stuffModal" ref="stuffModalRef"></s-modal>

    <div class="position-absolute top-0 end-0 pe-3" style="z-index: 11">
      <div
        id="liveToast"
        class="toast hide"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style="background-color: #c0ff00; margin-top: 65px"
      >
        <div class="toast-header">
          <span class="mdi mdi-application-export mdi-18px me-1"></span>
          <strong class="me-auto">Fastbs Application</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Закрыть"
          ></button>
        </div>
        <div class="toast-body">
          Шаблон <b>{{ template.title }}</b> сохранен.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
//import { L10n, setCulture } from "@syncfusion/ej2-base";
//import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/ru.json";
import {
  GanttComponent,
  Edit,
  Selection,
  DayMarkers,
  Toolbar,
  ExcelExport,
  PdfExport,
  ContextMenu,
} from "@syncfusion/ej2-vue-gantt";

import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";
import GanttService from "@/services/GanttService";
import _gp from "@/gParams.json";

import { useMainStore } from "@/store/MainStore";
import AttachmentModal from "@/components/Attachments/AttachmentModal.vue";
import StuffModal from "@/components/Stuffs/StuffModal.vue";

//L10n.load({ ru: EJ2_LOCALE.ru });
//setCulture("ru");

export default {
  name: "GanttView",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  components: {
    "ejs-gantt": GanttComponent,
    "a-modal": AttachmentModal,
    "s-modal": StuffModal,
  },

  provide: {
    gantt: [
      Edit,
      Selection,
      DayMarkers,
      Toolbar,
      ExcelExport,
      PdfExport,
      ContextMenu,
    ],
  },

  setup(props) {
    const router = useRouter();
    const store = useMainStore();
    const attachmentsModalRef = ref();
    const stuffModalRef = ref();

    const gData = ref({});
    const gParams = reactive(_gp);
    const template = ref({});
    const loading = ref(true);
    const permissions = ref({});
    const permissionsTemplates = ref({});
    let gInstance = null;
    let templateModal = null;
    let liveToast = null;

    const rules = computed(() => ({
      title: {
        required,
      },
      description: {
        required,
      },
    }));

    const v$ = useVuelidate(rules, template);

    document.querySelectorAll(".e-contextmenu-wrapper").forEach((node) => {
      node.remove();
    });

    onMounted(async () => {
      loading.value = true;

      let response = await AuthService.checkPermissions({
        resource: "gantts",
      });
      permissions.value = response.data.permissions;

      response = await AuthService.checkPermissions({
        resource: "ganttTemplates",
      });
      permissionsTemplates.value = response.data.permissions;

      templateModal = new bootstrap.Modal(
        document.getElementById("templateModal")
      );

      liveToast = new bootstrap.Toast(document.getElementById("liveToast"));

      if (permissions.value.find((x) => x.action == "get").allow) {
        getGantt();
      } else {
        Swal.fire({
          icon: "error",
          title: "Беда в GanttView - mounted!!!",
          text: "Доступ запрещен!",
        }).then(() => {
          router.push({ name: "Home" });
        });
      }
    });

    const getGantt = async () => {
      try {
        const response = await GanttService.get({ id: props.id });
        gData.value = response.data.gantt;

        gParams.readOnly = true;
        gParams.toolbar = [
          "ExpandAll",
          "CollapseAll",
          "ZoomIn",
          "ZoomOut",
          "ZoomToFit",
        ];

        if (permissions.value.find((x) => x.action == "put").allow) {
          gParams.readOnly = false;
          gParams.allowExcelExport = true;
          gParams.allowPdfExport = true;
          gParams.enableContextMenu = true;

          gParams.editSettings.allowAdding = true;
          gParams.editSettings.allowEditing = true;
          gParams.editSettings.allowExcelExport = true;
          gParams.editSettings.allowPdfExport = true;
          gParams.editSettings.allowTaskbarEditing = true;

          gParams.toolbar = [
            "Add",
            "Edit",
            "Update",
            "Delete",
            "Cancel",
            "ExpandAll",
            "CollapseAll",
            "ZoomIn",
            "ZoomOut",
            "ZoomToFit",
            "ExcelExport",
            "CsvExport",
            "PdfExport",
          ];
        }

        if (permissions.value.find((x) => x.action == "delete").allow) {
          gParams.editSettings.allowDeleting = true;
        }

        loading.value = false;
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Беда в GanttView - getGantt!!!",
          text: err.response.data.message,
        });
      }
    };

    const deleteGantt = async () => {
      Swal.fire({
        icon: "question",
        title: "Are you sure to delete the Gantt?",
        showDenyButton: true,
        confirmButtonText: "Confirm delete",
        denyButtonText: "Dismiss",
        confirmButtonColor: "#dc3545",
        denyButtonColor: "#0d6efd",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await GanttService.delete(gData.value._id);
            router.push({ name: "GanttFetch" });
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Беда в GanttView - deleteGantt!!!",
              text: err.response.data.message,
            });
          }
        }
      });
    };

    const updateGantt = async () => {
      //const gantt = document.getElementById("GanttContainer").ej2_instances[0];

      try {
        await GanttService.update({
          _id: gData.value._id,
          title: gData.value.title,
          description: gData.value.description,
          data: gInstance.properties.dataSource,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Беда в GanttView - updateGantt!!!",
          text: err.message,
        });
      }
    };

    const showTemplateModal = async () => {
      template.value.title = `Шаблон "${gData.value.title}"`;
      template.value.description = gData.value.description;
      templateModal.show();
    };

    const createTemplate = async () => {
      const isFormCorrect = await v$.value.$validate();

      if (isFormCorrect) {
        try {
          let ds = gInstance.properties.dataSource;
          //document.getElementById("GanttContainer").ej2_instances[0].properties.dataSource;

          let sd = Date.parse("5000-01-01T00:00:00.000Z");

          ds.forEach((item) => {
            if (Date.parse(item.StartDate) < sd) {
              sd = Date.parse(item.StartDate);
            }
          });

          console.log("Start Date:", sd);

          await GanttService.addTemplate({
            title: template.value.title,
            description: template.value.description,
            data: ds,
            startDate: new Date(sd),
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Беда в GanttView - createTemplate!!!",
            text: err.message,
          });
        }

        templateModal.hide();
        liveToast.show();
      }
    };

    const toolbarClick = (args) => {
      //var ganttObj = document.getElementById("GanttContainer").ej2_instances[0];
      //console.log("toolbarClick", args.item.id);

      if (args.item.id === "GanttContainer_excelexport") {
        gInstance.excelExport();
      } else if (args.item.id === "GanttContainer_csvexport") {
        gInstance.csvExport();
      } else if (args.item.id === "GanttContainer_pdfexport") {
        gInstance.pdfExport();
      }
    };

    const contextMenuClick = (args) => {
      //console.log("enter contextMenuClick");
      //console.log("args = ", args);

      const record = args.rowData;
      //const ganttObj = document.getElementById("GanttContainer").ej2_instances[0];
      if (args.item.id === "collapserow") {
        gInstance.collapseByID(Number(record.ganttProperties.taskId));
      }
      if (args.item.id === "expandrow") {
        gInstance.expandByID(Number(record.ganttProperties.taskId));
      }
      if (args.item.id === "hidecols" && args.column != null) {
        gInstance.hideColumn(args.column.headerText);
      }
      if (args.item.id === "showcols") {
        gInstance.ganttColumns.forEach((item) => {
          gInstance.showColumn(item.headerText);
        });
      }
      if (args.item.id === "attachments") {
        attachmentsModalRef.value.showAttachmentsModal(props.id, args);
      }
      if (args.item.id === "stuff") {
        stuffModalRef.value.showModal(props.id, args);
      }

      if (args.item.id === "properties") {
        /*{
            "text": "Свойства",
            "target": ".e-content",
            "id": "properties",
            "iconCss": "mdi mdi-18px mdi-pencil-outline"
        },*/
        gInstance.openEditDialog(args.rowData.TaskID);
      }
    };

    const contextMenuOpen = (args) => {
      //console.log("open args: ", args)
      if (args.type !== "Header") {
        if (!args.rowData.hasChildRecords) {
          args.hideItems.push("Collapse the Row");
          args.hideItems.push("Expand the Row");
        } else {
          if (args.rowData.expanded) {
            args.hideItems.push("Expand the Row");
          } else {
            args.hideItems.push("Collapse the Row");
          }
        }
      }
    };

    const ganttCreated = () => {
      gInstance = document.getElementById("GanttContainer").ej2_instances[0];
      document.getElementById("GanttContainer_Gantt_Toolbar").style.height =
        "60px";
      document.styleSheets[0].insertRule(
        `button[id^="GanttContainer_"] {
            padding: 0 4px !important;
            border: none !important;
            }`,
        0
      );
    };

    const action = () => {
      console.log("Клац here...");

      console.log(gInstance);
      console.log("selectedRowIndex: ", gInstance.selectedRowIndex);
    };

    const action2 = () => {
      console.log("Клац2 here...");
      //console.log("store: ", store);

      /*       var cell = gInstance.getRecordByID(gInstance.selectedRowIndex);
      cell.TaskName = "********************";
      console.log("cell = ", cell);
      gInstance.updateRecordByIndex(gInstance.selectedRowIndex, cell);
 */
    };

    const actionBegin = (args) => {
      console.log("actionBegin args = ", args);
      console.log("  ==>> action = ", args.requestType);
      //args.cancel = true;
    };

    return {
      store,
      router,
      gData,
      gParams,
      template,
      v$,
      loading,
      permissions,
      permissionsTemplates,
      attachmentsModalRef,
      stuffModalRef,
      updateGantt,
      deleteGantt,
      showTemplateModal,
      createTemplate,
      toolbarClick,
      contextMenuClick,
      contextMenuOpen,
      ganttCreated,
      action,
      action2,
      actionBegin,
    };
  },

  async beforeRouteLeave() {
    const gInstance =
      document.getElementById("GanttContainer").ej2_instances[0];

    /*     if (gInstance.contextMenuModule )
      await gInstance.contextMenuModule.destroy();

    document.querySelectorAll(".e-contextmenu-wrapper").forEach((node) => {
      node.remove();
    }); */

    gInstance.destroy();

    return true;
  },
};
</script>

<style scoped>
@import "@syncfusion/ej2-base/styles/bootstrap5.css";
@import "@syncfusion/ej2-buttons/styles/bootstrap5.css";
@import "@syncfusion/ej2-calendars/styles/bootstrap5.css";
@import "@syncfusion/ej2-dropdowns/styles/bootstrap5.css";
@import "@syncfusion/ej2-inputs/styles/bootstrap5.css";
@import "@syncfusion/ej2-navigations/styles/bootstrap5.css";
@import "@syncfusion/ej2-popups/styles/bootstrap5.css";
@import "@syncfusion/ej2-splitbuttons/styles/bootstrap5.css";
@import "@syncfusion/ej2-layouts/styles/bootstrap5.css";
@import "@syncfusion/ej2-grids/styles/bootstrap5.css";
@import "@syncfusion/ej2-treegrid/styles/bootstrap5.css";
@import "@syncfusion/ej2-vue-gantt/styles/bootstrap5.css";
@import "@syncfusion/ej2-vue-grids/styles/bootstrap5.css";

.myClass {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.errorClass {
  border-color: #dc3545;
}

.e-gantt-toolbar {
  height: 50px !important;
}
</style>

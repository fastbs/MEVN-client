<template>
  <div class="container-fluid">
    <div class="row justify-content-center m-3">
      <div class="col-12 col-md-8 col-lg-6" v-if="!loading">
        <div class="card mb-3 mt-3 shadow">
          <div class="card-header bg-primary text-light">
            Новая диаграмма Ганта
          </div>
          <div class="card-body">
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
                  v-model="gantt.title"
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

            <div class="form-group mb-3">
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
                  v-model="gantt.description"
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

            <div class="form-group mb-3">
              <label for="startDate">Дата и время начала</label>
              <div
                :class="{
                  'e-input-group': true,
                  'e-error': v$.startDate.$error,
                }"
              >
                <ejs-datetimepicker
                  id="startDate"
                  name="startDate"
                  v-model="gantt.startDate"
                  placeholder="Выберите дату и время"
                  style="
                    width: 100%;
                    border-width: 0px;
                    background-color: #ffffff;
                  "
                ></ejs-datetimepicker>
              </div>
              <div v-if="v$.startDate.$error" class="myClass">
                <span v-if="v$.startDate.required.$invalid"
                  >Дата и время начала обязательны</span
                >
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="template">Шаблон</label>
              <div
                :class="{
                  'e-input-group': true,
                  'e-error': v$.template.$error,
                }"
              >
                <span
                  class="e-input-group-icon mdi mdi-chart-gantt mdi-18px"
                ></span>
                <select
                  id="template"
                  name="template"
                  placeholder="Выберите шаблон"
                  v-model="gantt.template"
                  class="e-input"
                  style="
                    width: 94%;
                    border-width: 0px;
                    background-color: #ffffff;
                  "
                >
                  <option value="">Выберите шаблон</option>
                  <option
                    v-for="item in ganttTemplates"
                    :key="item.title"
                    :value="item._id"
                  >
                    {{ item.title }} - {{ item.description }}
                  </option>
                </select>
              </div>
              <div v-if="v$.template.$error" class="myClass">
                <span v-if="v$.template.required.$invalid"
                  >Шаблон обязателен</span
                >
              </div>
            </div>

            <div class="form-group mt-4">
              <button type="button" class="btn btn-primary" @click="addGantt">
                Создать диаграмму Ганта
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onBeforeMount, onUpdated } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { DateTimePickerComponent } from "@syncfusion/ej2-vue-calendars";
//import { TextBoxComponent } from "@syncfusion/ej2-vue-inputs";
import Swal from "sweetalert2";
import Common from "@/common";
import AuthService from "@/services/AuthService";
import GanttService from "@/services/GanttService";

export default {
  name: "GanttAdd",

  components: {
    "ejs-datetimepicker": DateTimePickerComponent,
    //"ejs-textbox": TextBoxComponent,
  },

  setup() {
    const router = useRouter();

    const gantt = reactive({
      title: "",
      description: "",
      startDate: "",
      template: "",
    });
    const ganttTemplates = ref([]);
    const loading = ref(true);

    const rules = computed(() => ({
      title: {
        required,
      },
      description: {
        required,
      },
      startDate: {
        required,
      },
      template: {
        required,
      },
    }));

    const v$ = useVuelidate(rules, gantt);

    onBeforeMount(async () => {
      try {
        if (
          AuthService.checkAction("gantts", "post") &&
          AuthService.checkAction("ganttTemplates", "fetch") &&
          AuthService.checkAction("ganttTemplates", "get")
        ) {
          const response = await GanttService.fetchTemplates();
          ganttTemplates.value = response.data.ganttTemplates;

          loading.value = false;
        } else {
          throw new Error("Доступ запрещен!");
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Беда в GanttAdd - mounted!!!",
          text: err.message,
        });
        router.push({ name: "Home" });
      }
    });

    onUpdated(() => {
      Common.onFocusBlur();
    });

    const calcDate = (arr, diffDate) => {
      arr.forEach((item) => {
        let sd = new Date(Date.parse(item.StartDate) + diffDate);
        let ed = new Date(Date.parse(item.EndDate) + diffDate);
        item.StartDate = sd;
        item.EndDate = ed;
        if (item.subtasks != null) {
          calcDate(item.subtasks, diffDate);
        }
      });
    };

    const addGantt = async () => {
      const isFormCorrect = await v$.value.$validate();

      if (isFormCorrect) {
        try {
          const response = await GanttService.getTemplate({
            id: gantt.template,
          });
          if (!response) {
            throw new Error(`Ошибка обращения к шаблону id: ${gantt.template}`);
          } else {
            const ganttTemplate = response.data.ganttTemplate;
            const diffDate =
              gantt.startDate - Date.parse(ganttTemplate.startDate);

            calcDate(ganttTemplate.data, diffDate);

            GanttService.add({
              title: gantt.title,
              description: gantt.description,
              data: ganttTemplate.data,
              startDate: gantt.startDate,
            }).then((res) => {
              router.push({ name: "GanttView", params: { id: res.data.id } });
            });
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Беда в GanttAdd - addGantt!!!",
            text: err.message,
          });
        }
      }
    };

    return { gantt, ganttTemplates, loading, addGantt, v$ };
  },
};
</script>

<style scoped>
@import "@syncfusion/ej2-base/styles/bootstrap5.css";
@import "@syncfusion/ej2-buttons/styles/bootstrap5.css";
@import "@syncfusion/ej2-inputs/styles/bootstrap5.css";
@import "@syncfusion/ej2-popups/styles/bootstrap5.css";
@import "@syncfusion/ej2-vue-calendars/styles/bootstrap5.css";

.myClass {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

.errorClass {
  border-color: #dc3545;
}
</style>

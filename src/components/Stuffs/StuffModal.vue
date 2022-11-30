<template>
  <div
    class="modal fade"
    :id="props.id"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered" style="max-width: 1000px">
      <div class="modal-content" v-if="stuff.showModal">
        <div class="modal-header bg-primary">
          <h5 class="modal-title text-light" id="exampleModalLabel">
            Эксперимент для {{ stuff.args.rowData.TaskID }} -
            {{ stuff.args.rowData.TaskName }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="hideModal()"
          ></button>
        </div>
        <div class="modal-body">
          <div class="accordion" id="accordionPanelsStayOpenExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Аккордеонный элемент #1
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div class="accordion-body">
                  <p>
                    <strong>Это тело аккордеона третьего элемента.</strong> По
                    умолчанию он скрыт, пока плагин свертывания не добавит
                    соответствующие классы, которые мы используем для стилизации
                    каждого элемента.
                  </p>
                  <select
                    class="form-select mb-3"
                    aria-label="Default select example"
                    @change="onChange"
                  >
                    <option selected value="-1">Выберите класс</option>
                    <option
                      v-for="item in stuff.types"
                      :key="item._id"
                      :value="item._id"
                    >
                      {{ item.type }}
                    </option>
                  </select>
                  Выбран элемент: {{ stuff.selected.index }} -
                  {{ stuff.selected.name }}
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                <button
                  id="headingButtonTwo"
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseTwo"
                  disabled
                >
                  Аккордеонный элемент #2
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-headingTwo"
              >
                <div class="accordion-body">
                  <p>
                    <strong>Это тело аккордеона третьего элемента.</strong> По
                    умолчанию он скрыт, пока плагин свертывания не добавит
                    соответствующие классы, которые мы используем для стилизации
                    каждого элемента.
                  </p>
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-headingThree">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseThree"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseThree"
                  disabled
                >
                  Аккордеонный элемент #3
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseThree"
                class="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-headingThree"
              >
                <div class="accordion-body">
                  <p>
                    <strong>Это тело аккордеона третьего элемента.</strong> По
                    умолчанию он скрыт, пока плагин свертывания не добавит
                    соответствующие классы, которые мы используем для стилизации
                    каждого элемента.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click.prevent="action($event)"
          >
            Действие
          </button>
          <button type="button" class="btn btn-secondary" @click="hideModal()">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";

import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
//import Swal from "sweetalert2";
//import AuthService from "@/services/AuthService";
import StuffsService from "@/services/StuffsService";

//import { useMainStore } from "@/store/MainStore";

import { StuffFactory } from "@/components/Stuffs/StuffClass";

export default {
  name: "StuffModal",

  props: {
    id: {
      type: String,
    },
  },

  setup(props) {
    //const store = useMainStore();

    const stuff = reactive({
      id: null,
      args: null,
      showModal: false,
      types: null,
      items: [],
      selected: {
        index: null,
        name: null,
      },
    });

    let stuffModal = null;

    onMounted(async () => {
      stuffModal = new bootstrap.Modal(document.getElementById(props.id));
    });

    const showModal = async (_id, args) => {
      stuff.id = _id;
      stuff.args = args;

      StuffsService.fetch().then((res) => {
        if (res.data.stuffs) stuff.types = res.data.stuffs;
        else stuff.types = null;

        console.log("stuffs:", res.data.stuffs);

        stuff.showModal = true;
        stuffModal.show();
      });
    };

    const hideModal = async () => {
      stuffModal.hide();
    };

    const action = async () => {
      /*       const hat = StuffFactory.createStuff("Hat");
      const boots = StuffFactory.createStuff("Boots");

      console.log(hat);
      console.log(boots); */

      stuff.types.forEach((item) => {
        let st = stuff.items.push(StuffFactory.createStuff(item.type));
        console.log(st);
      });
      console.log(stuff.items.length);
      console.log(stuff.items);
    };

    const onChange = async (event) => {
      console.log("onSelect", event);
      stuff.selected.index = event.originalTarget.selectedIndex;
      stuff.selected.name =
        event.originalTarget.selectedIndex > 0
          ? stuff.types[event.originalTarget.selectedIndex - 1].type
          : "undefined";

      let hbTwo = document.getElementById("headingButtonTwo");
      let apTwo = document.getElementById("panelsStayOpen-collapseTwo");

      if (event.originalTarget.selectedIndex) {
        hbTwo.removeAttribute("disabled");
        hbTwo.classList.remove("collapsed");
        apTwo.classList.add("show");
      } else {
        hbTwo.setAttribute("disabled", "disabled");
        hbTwo.classList.add("collapsed");
        apTwo.classList.remove("show");
      }
    };

    return {
      props,
      stuff,
      showModal,
      hideModal,
      action,
      onChange,
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
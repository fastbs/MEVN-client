<template>
  <div class="container-fluid">
    <div class="row m-3 justify-content-center">
      <div class="col-sm-4">
        <div class="card mb-3 mt-3 shadow">
          <div class="card-header bg-primary text-light">Registration form</div>
          <div class="card-body">
            <div class="form-group mb-4">
              <label for="email">Имя</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><span class="mdi mdi-account mdi-24px"
                /></span>
                <input
                  type="text"
                  v-model="state.name"
                  id="name"
                  name="name"
                  :class="{
                    'is-invalid': v$.name.$error,
                    'form-control': true,
                  }"
                />
                <div v-if="v$.name.$error" class="invalid-feedback">
                  <span v-if="v$.name.required.$invalid">Имя обязателено</span>
                  <span v-if="v$.name.minLength.$invalid"
                    >Минимальная длина - 4 символа</span
                  >
                </div>
              </div>
            </div>

            <div class="form-group mb-4">
              <label for="email">Email</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><span class="mdi mdi-email mdi-24px"
                /></span>
                <input
                  type="email"
                  v-model="state.email"
                  id="email"
                  name="email"
                  :class="{
                    'is-invalid': v$.email.$error,
                    'form-control': true,
                  }"
                />
                <div v-if="v$.email.$error" class="invalid-feedback">
                  <span v-if="v$.email.required.$invalid"
                    >Email обязателен</span
                  >
                  <span v-if="v$.email.email.$invalid">Некоректный email</span>
                </div>
              </div>
            </div>

            <div class="form-group mb-4">
              <label for="password">Пароль</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><span class="mdi mdi-lock mdi-24px"
                /></span>
                <input
                  type="password"
                  v-model="state.password"
                  id="password"
                  name="password"
                  :class="{
                    'is-invalid': v$.password.$error,
                    'form-control': true,
                  }"
                />
                <div v-if="v$.password.$error" class="invalid-feedback">
                  <span v-if="v$.password.required.$invalid"
                    >Пароль обязателен</span
                  >
                  <span v-if="v$.password.minLength.$invalid"
                    >Минимальная длина - 6 символов</span
                  >
                </div>
              </div>
            </div>

            <div class="form-group mb-4">
              <label for="password">Проверка пароля</label>
              <div class="input-group">
                <span class="input-group-text"
                  ><span class="mdi mdi-lock mdi-24px"
                /></span>
                <input
                  type="password"
                  v-model="state.confirmPassword"
                  id="confirm"
                  name="confirm"
                  :class="{
                    'is-invalid': v$.confirmPassword.$error,
                    'form-control': true,
                  }"
                />
                <div v-if="v$.confirmPassword.$error" class="invalid-feedback">
                  <span v-if="v$.confirmPassword.required.$invalid"
                    >Пароль обязателен</span
                  >
                  <span v-if="v$.confirmPassword.minLength.$invalid"
                    >Минимальная длина - 6 символов</span
                  >
                  <span v-if="v$.confirmPassword.sameAs.$invalid"
                    >Пароли должны совпадать</span
                  >
                </div>
              </div>
            </div>

            <div class="form-group">
              <button type="button" class="btn btn-primary" @click="onSubmit">
                Регистрация
              </button>
              <router-link
                class="btn btn-success ms-4"
                :to="{ name: 'UserLogin' }"
                >Логин</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";
import Swal from "sweetalert2";
import AuthService from "@/services/AuthService";

export default {
  name: "UserLogin",

  emits: ["update-menu"],

  setup(props, context) {
    const router = useRouter();

    const state = reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    const rules = computed(() => ({
      name: {
        required,
        minLength: minLength(4),
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(6),
      },
      confirmPassword: {
        required,
        minLength: minLength(6),
        sameAs: sameAs(state.password),
      },
    }));

    const v$ = useVuelidate(rules, state);

    const onSubmit = async () => {
      const isFormCorrect = await v$.value.$validate();

      if (isFormCorrect) {
        const user = {
          name: state.name,
          email: state.email,
          password: state.password,
        };

        try {
          await AuthService.registerUser(user);

          Swal.fire({
            icon: "success",
            title: "Успешнная регистрация",
          }).then(() => {
            context.emit("update-menu");
            router.push({ name: "UserLogin" });
          });
        } catch (err) {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Прям беда!",
            text: err.response.data.message,
          });
        }
      }
    };

    return { router, state, v$, onSubmit };
  },
};
</script>

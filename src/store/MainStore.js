import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", () => {
  const config = ref({
    siteURL: "http://localhost:8080/",
    attachmentsPath: "attachments/",
  });

  const count = ref(0);
  const name = ref("Eduardo");
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++
  }

  return { config, count, name, doubleCount, increment }
})
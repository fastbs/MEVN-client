import GanttFetch from "@/components/Gantt/GanttFetch";
import GanttView from "@/components/Gantt/GanttView";
import GanttAdd from "@/components/Gantt/GanttAdd";

const routes = [
  {
    path: "/gantt",
    name: "GanttFetch",
    component: GanttFetch
  },
  {
    path: "/gantt/:id",
    name: "GanttView",
    component: GanttView,
    props: true,
    beforeRouteLeave(to, from, next) {
      const answer = window.confirm('Вы хотите уйти? У вас есть несохранённые изменения!');
      if (answer) {
        next();
      } else {
        next(false);
      }
    }
  },
  {
    path: "/gantt/new",
    name: "GanttAdd",
    component: GanttAdd
  }
];

export default routes;

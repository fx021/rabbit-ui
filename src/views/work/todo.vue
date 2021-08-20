<template>
  <basic-container>
    <flow-todo-table search></flow-todo-table>
  </basic-container>
</template>

<script>
import FlowTodoTable from "@/components/FlowTodoTable/FlowTodoTable";

export default {
  components: {
    FlowTodoTable
  },
  data() {
    return {};
  },
};
</script>

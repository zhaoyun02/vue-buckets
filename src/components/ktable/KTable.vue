<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  //注入到子组件
  provide() {
    return {
      table: this,
    };
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultSort: {
      type: Object,
    },
  },
  mounted() {
    this.$on("reset", () => {
      this.$children.forEach((child) => {
        child.reset();
      });
    });
  },
};
</script>

<style scoped>
.container {
  display: flex;
}
</style>

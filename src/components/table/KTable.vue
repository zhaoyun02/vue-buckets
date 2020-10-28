<template>
  <div class='container'>
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
  },
  mounted() {
    console.log(this.$children);
  },
};
</script>

<style  scoped>
  .container{
    display: flex;
  }
</style>

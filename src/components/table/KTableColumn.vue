<template>
  <div class="col">
    <p>{{ label }}</p>
    <ul>
      <li v-for="(item, index) in table.data" :key="item.id">
        {{ item[prop] }}
        <slot :data="table.data" :index="index"></slot>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // 获取父组件注入到数据
  inject: ["table"],
  props: {
    prop: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
  },
  mounted() {
    console.log(this.table.data);
  },
};
</script>

<style scoped>
.col {
  margin-left: 20px;
}
ul {
  display: table-footer-group;
  list-style: none;
  text-align: center;
}
</style>

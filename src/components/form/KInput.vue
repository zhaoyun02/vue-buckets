<template>
  <div>
    <!-- v-bind="$attrs" 父组件中未绑定的属性会被保存到$attrs,使用时自动展开{...$attrs} -->
    <input :type="type" :value="value" @input="onInput" v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);
      //输入改变时校验数据
      this.$parent.$emit('validate')
    },
  },
};
</script>

<style lang="scss" scoped></style>

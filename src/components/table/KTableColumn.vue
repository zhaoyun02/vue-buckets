<template>
  <div class="col">
    <p class="title-container">
      {{ label }}
      <span class="sort">
        <i
          v-if="sortable"
          class="el-icon-caret-top"
          :class="{ isSelected: isSelectedTop }"
          @click="topClick"
        ></i>
        <i
          v-if="sortable"
          class="el-icon-caret-bottom"
          :class="{ isSelected: isSelectedBottom }"
          @click="bottomClick"
        ></i>
      </span>
    </p>
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
    sortable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSelectedTop: false,
      isSelectedBottom: false,
    };
  },
  mounted() {
    if (this.table.defaultSort) {
      if (this.table.defaultSort.prop === this.prop) {
        if (this.table.defaultSort.order === "descending") {
          this.bottomClick();
        } else if (this.table.defaultSort.order === "ascending") {
          this.topClick();
        } else {
          alert("输入正确的默认排序");
        }
      }
    }
  },
  methods: {
    // 正序
    topClick() {
      if (this.isSelectedTop) return;
      this.$parent.$emit("reset");
      this.isSelectedTop = true;
      this.isSelectedBottom = false;
      this.table.data &&
        this.table.data.sort((a, b) =>
          a[this.prop].toString().localeCompare(b[this.prop].toString())
        );
    },
    //倒序
    bottomClick() {
      if (this.isSelectedBottom) return;
      this.$parent.$emit("reset");
      this.isSelectedTop = false;
      this.isSelectedBottom = true;
      this.table.data &&
        this.table.data.sort((a, b) =>
          b[this.prop].toString().localeCompare(a[this.prop].toString())
        );
    },
    // 其他箭头置灰
    reset() {
      this.isSelectedTop = false;
      this.isSelectedBottom = false;
    },
  },
};
</script>

<style scoped>
.col {
  margin-left: 20px;
}
.title-container {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
}
.title-container .sort {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  height: 34px;
  width: 24px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
}
.el-icon-caret-top {
  height: 10px;
}
.isSelected {
  color: #409eff;
}
ul {
  display: table-footer-group;
  list-style: none;
  text-align: center;
}
li{
  margin-left: 10px;
}
</style>

<template>
  <div>
    <k-table
      :data="tableData"
      :defaultSort="{ prop: 'id', order: 'descending' }"
    >
      <k-table-column prop="id" label="顺序" sortable></k-table-column>
      <k-table-column prop="date" label="日期" sortable></k-table-column>
      <k-table-column prop="name" label="姓名" sortable></k-table-column>
      <k-table-column prop="address" label="地址" sortable></k-table-column>
      <k-table-column label="操作">
        <!-- 自定义列模板 作用域插槽-->
        <template v-slot="slotProps">
          <a @click="check(slotProps)">查看</a>
          <a @click="edit(slotProps)">编辑</a>
        </template>
      </k-table-column>
    </k-table>
  </div>
</template>

<script>
import KTable from "./KTable";
import KTableColumn from "./KTableColumn";
export default {
  components: {
    KTable,
    KTableColumn,
  },
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小1",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小2",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小3",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小4",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {
    check(data) {
      console.log(data);
    },
    edit(data) {
      console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped></style>

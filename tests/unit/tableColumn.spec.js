import { shallowMount, mount } from "@vue/test-utils";
import KTableColumn from "@/components/table/KTableColumn.vue";

const tableData = [
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
];
const table = {};
table.data = tableData;
table.defaultSort = false;
//套件
describe("KTableColumn.vue", () => {
  it("测试Table展示的行数与tableData的length是否一致", () => {
    const wrapper = shallowMount(KTableColumn, {
      provide: { table },
      propsData: { prop: "id", label: "顺序" },
    });
    // console.log(wrapper);
    const li = wrapper.findAll("li");
    // console.log(li.length);
    expect(li.length).toBe(table.data.length);
  });

  it("测试label是否存在", () => {
    const wrapper = shallowMount(KTableColumn, {
      provide: { table },
      propsData: { prop: "name", label: "姓名" },
    });

    expect(wrapper.text()).toMatch("姓名");
  });

  test("测试默认排序是否生效", () => {
    table.defaultSort = { prop: "id", order: "ascending" };
    const wrapper = mount(KTableColumn, {
      provide: { table },
      propsData: { prop: "id", label: "顺序", sortable: false },
      data() {
        return {
          isSelectedBottom: false,
          isSelectedTop: false,
        };
      },
    });

    expect(wrapper.vm.isSelectedTop).toBe(true);
  });

  test("测试点击排序是否生效", async () => {
    const wrapper = mount(KTableColumn, {
      provide: { table },
      propsData: { prop: "address", label: "地址", sortable: true },
    });
    const i = wrapper.find("i");
    await i.trigger("click");
    expect(wrapper.vm.isSelectedTop).toBe(true);
    expect(wrapper.vm.isSelectedBottom).toBe(false);
  });
});

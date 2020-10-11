function defineReactive(obj, key, val) {
  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      console.log("get", key, val);
      return val;
    },
    set(newValue) {
      console.log("set", key, val, newValue);
      // 若新值为一个对象需要再次做响应式处理
      observe(newValue);
      if (newValue !== val) {
        val = newValue;
      }
    },
  });
}
// 无法处理为一个对象新增响应式属性
function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
  });
}

function set(obj, key, val) {
  defineReactive(obj, key, val);
}
const obj = {
  foo: "foo",
  bar: "bar",
  baz: {
    a: 1,
  },
};
observe(obj);
set(obj,'dong','dong')

// defineReactive(obj, "foo", "fooValue");
obj.foo;
obj.foo = "foooooo";
obj.baz.a;
obj.dong
// console.log(obj.foo); // foooooo
// console.log(obj); // {} ?

// Array 不可用这个形式 数组有很多特殊的方法，eg：pop push ... 用definePropert无法拦截 
// 实际通过覆盖这些方法 增加通知更新等Vue需要使用的东西

function defineReactive(obj, key, val) {
  observe(val);
  //利用闭包原理将每一个响应式的key都与一个dep依赖关联
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      console.log("get", key, val);
      Dep.target && dep.addDep(Dep.target);
      return val;
    },
    set(newValue) {
      console.log("set", key, val, newValue);
      //   watchers.forEach((w) => w.update());
      if (newValue !== val) {
        val = newValue;
        // 若新值为一个对象需要再次做响应式处理
        observe(newValue);
        dep.notify();
      }
    },
  });
}
// 无法处理为一个对象新增响应式属性
function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  new Observer(obj);
  //   Object.keys(obj).forEach((key) => {
  //     defineReactive(obj, key, obj[key]);
  //   });
}

// 根据不同的数据类型做实现响应式数据
class Observer {
  constructor(value) {
    this.value = value;
    if (Array.isArray(value)) {
      // todo
    } else {
      this.walk(value);
    }
  }
  // 对象的响应式数据
  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

// 将$data上的数据代理到vue实例上
function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(v) {
        vm.$data[key] = v;
      },
    });
  });
}
// KVue做两件事 1.响应式数据 2.模版编译 compile
class KVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.$methods = options.methods;
    // 1.实现响应式数据
    observe(this.$data);
    // 2. 将$data上的数据代理到vue实例上
    proxy(this);
    // 3.compile 编译
    new Compile(options.el, this);
  }
}

// 解析模板
// 1.处理插值
// 2.处理指令和事件
// 3.以上两者初始化和更新
class Compile {
  // el: 节点 vm: Vue实例
  constructor(el, vm) {
    this.$el = document.querySelector(el);
    this.$vm = vm;
    if (this.$el) {
      this.compile(this.$el);
    }
  }
  compile(el) {
    const childNodes = el.childNodes;
    childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        // 元素节点类型为1
        // console.log("元素", node.nodeName);
        const attrs = node.attributes; // 结果不是数组，需要用Array.from转换
        Array.from(attrs).forEach((attr) => {
          // attr 形式 =>    k-text="xxx"
          const attrName = attr.name; //获取到text
          const attrValue = attr.value; //获取到xxx,该数据为vm中绑定的数据
          // kvue中的数据绑定以k-开头
          if (attrName.startsWith("k-")) {
            //获取操作text
            const operate = attrName.substring(2);
            //执行text操作
            this[operate] && this[operate](node, attrValue);
          } else if (attrName.startsWith("@")) {
            //获取事件名称 click
            const operate = attrName.substring(1); //click
            // 记录当前实例 在下面的箭头函数使用
            const that = this;
            node.addEventListener(operate, () => {
              that.$vm.$methods[attrValue].call(that.$vm);
            });
          } else if (attrName === "v-model") {
            // 初始化input的值
            node.value = this.$vm[attrValue];
            // input事件监听
            node.addEventListener("input", (e) => {
              this.$vm[attrValue] = e.target.value;
            });
          }
        });
      } else if (this.innerType(node)) {
        // 文本节点类型为3
        // console.log("插值", node.textContent);
        this.compileText(node);
      }
      if (node.childNodes) {
        this.compile(node);
      }
    });
  }
  // node:当前节点 、value: vm上的一个属性（动态绑定的数据）、dir: 操作指令（具体执行哪个操作函数）
  // 统一管理各个节点的操作
  update(node, value, dir) {
    // 1.首次渲染
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[value]);
    // 2.动态刷新数据
    new Watcher(this.$vm, value, (val) => {
      fn && fn(node, val);
    });
  }
  //text指令操作
  text(node, value) {
    this.update(node, value, "text");
  }
  textUpdater(node, value) {
    // console.log(this); this指向不是当前Compile实例了
    node.textContent = value;
  }
  //html指令操作
  html(node, value) {
    this.update(node, value, "html");
  }
  //html指令操作
  htmlUpdater(node, value) {
    node.innerHTML = value;
  }
  // 判断是否为文本类型&&是否为插值表达式
  innerType(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  // 编译文本
  compileText(node) {
    this.update(node, RegExp.$1, "text");
    // node.textContent = this.$vm[RegExp.$1];
  }
}
// let watchers = [];
// Watcher 的目的是每一个动态绑定的数据都需要一个监视器 （在Compile处为每一个绑定的数据添加这个监视器和相关的更新函数）
class Watcher {
  constructor(vm, key, updateFn) {
    this.$vm = vm;
    this.key = key;
    this.updateFn = updateFn;
    // watchers.push(this);
    // 利用访问this.$vm[key]，触发get 接机将Dep与Watcher关联
    Dep.target = this;
    this.$vm[key]; //访问触发get
    Dep.target = null;
  }
  update() {
    this.updateFn(this.$vm[this.key]);
  }
}

// 每个响应式key都与一个Dep关联
class Dep {
  constructor() {
    this.deps = [];
  }
  // 将wantcher加入到Dep中，以此将二者关联 dep又与响应式数据到key值关联
  addDep(dep) {
    this.deps.push(dep);
  }
  // 响应式数据set时，触发更新
  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}

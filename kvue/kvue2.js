function defineReactive(obj, key, val) {
  //若val是对象则需递归添加响应式
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
    // new Compile(options.el, this);
    if (options.el) {
      this.$mount(options.el);
    }
  }
  $mount(el) {
    this.$el = document.querySelector(el);
    //创建更新函数updateComponent
    const updateComponent = () => {
      const { render } = this.$options;
      const vNode = render.call(this, this.$createElement);
      this._update(vNode);
      // const parent = this.$el.parentElement;
      // parent.insertBefore(realDom, this.$el.nextSibling);
      // parent.removeChild(this.$el);
      // this.$el = realDom;
    };
    //一个组件创建一个watcher
    new Watcher(this, updateComponent);
  }
  $createElement(tag, props, children) {
    return { tag, props, children };
  }
  _update(vnode) {
    const preVnode = this._vnode;
    if (!preVnode) {
      //初始化
      this._patch_(this.$el, vnode);
    } else {
      //更新
      this._patch_(preVnode, vnode);
    }
  }
  _patch_(oldVnode, vnode) {
    //初始化
    if (oldVnode.nodeType) {
      const parent = oldVnode.parentElement;
      const refEle = oldVnode.nextSibling;
      const el = this.createEle(vnode);
      parent.insertBefore(el, refEle);
      parent.removeChild(oldVnode);
      //保存vnode
      this._vnode = vnode;
    } else {
      //更新
      const el = (vnode.el = oldVnode.el);

      //获取新旧属性props并比对是否更新
      const oldProps = oldVnode.props || {};
      const newProps = vnode.props || {};
      for (const key in newProps) {
        const oldValue = oldProps[key];
        const newValue = newProps[key];
        //属性更新
        if (oldValue !== newValue) {
          el.setAttribute(key, newValue);
        }
      }
      //属性删除
      for (const key in oldProps) {
        if (!(key in newProps)) {
          el.removeAttribute(key);
        }
      }

      //是否有孩子
      const oldCh = oldVnode.children;
      const newCh = vnode.children;
      //新孩子是字符串
      if (typeof newCh === "string") {
        if (typeof oldCh === "string") {
          if (oldCh !== newCh) {
            el.textContent = newCh;
          }
        } else {
          el.textContent = newCh;
        }
      } else {
        //新孩子是数组，老孩子是字符串
        if (typeof oldCh === "string") {
          el.innerHTML = "";
          newCh.forEach((child) => this.createEle(child));
        } else {
          //新孩子是数组，老孩子是数组
          this.updateChildren(el, oldCh, newCh);
        }
      }
    }
  }
  //新老孩子都是数组时的对比
  updateChildren(el, oldCh, newCh) {
    const oldLen = oldCh.length;
    const newLen = newCh.length;
    const len = Math.min(oldLen, newLen);
    //相同位置的替换
    for (let i = 0; i < len; i++) {
      this._patch_(oldCh[i], newCh[i]);
    }
    //新孩子多则追加，新孩子少则移除
    if (newLen > oldLen) {
      newCh.slice(len).forEach((child) => {
        const c = this.createEle(child);
        el.appendChild(c);
      });
    } else {
      oldCh.slice(len).forEach((child) => {
        const c = this.createEle(child);
        el.removeChild(c);
      });
    }
  }
  // 创建元素并设置相关属性及对孩子的处理
  createEle(vnode) {
    const el = document.createElement(vnode.tag);
    //设置元素的属性props
    if (vnode.props) {
      for (const key in vnode.props) {
        const value = vnode.props[key];
        el.setAttribute(key, value);
      }
    }

    // 有孩子的情况
    if (vnode.children) {
      //孩子为字符串
      if (typeof vnode.children === "string") {
        el.textContent = vnode.children;
      } else {
        //孩子为数组
        vnode.children.forEach((node) => {
          const child = this.createEle(node);
          el.appendChild(child);
        });
      }
    }
    // 备用
    vnode.el = el;
    return el;
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
  constructor(vm, updateFn) {
    this.$vm = vm;
    this.getter = updateFn;
    this.get();
  }
  get() {
    // 利用访问this.$vm[key]，触发get 接机将Dep与Watcher关联
    Dep.target = this;
    this.getter.call(this.$vm);
    Dep.target = null;
  }
  update() {
    this.get();
  }
}

// 每个响应式key都与一个Dep关联
class Dep {
  constructor() {
    // 数组去重，防止多个相同的watcher
    this.deps = new Set();
  }
  // 将wantcher加入到Dep中，以此将二者关联 dep又与响应式数据到key值关联
  addDep(dep) {
    this.deps.add(dep);
  }
  // 响应式数据set时，触发更新
  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}
